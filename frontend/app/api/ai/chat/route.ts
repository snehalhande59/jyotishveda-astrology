import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], birthChart, language = 'en' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'AI Astrologer engine is not configured. Please set GEMINI_API_KEY in backend or environment to enable real-time Gemini AI astrological interpretations.',
      });
    }

    // Build authentic system prompt incorporating user's verified birth chart details
    const chartContext = birthChart
      ? `User's Authenticated Vedic Birth Chart Coordinates:
- Full Name: ${birthChart.fullName || 'Seeker'}
- Date of Birth: ${birthChart.dob || 'Unknown'} ${birthChart.tob || ''}
- Ascendant (Lagna): ${birthChart.ascendant?.signName || birthChart.lagna || 'Aries'}
- Moon Sign (Chandra Rashi): ${birthChart.moonSign?.signName || birthChart.rashi || 'Taurus'}
- Birth Star (Nakshatra): ${birthChart.nakshatra || 'Rohini'} (Pada ${birthChart.pada || 1})
- Current Mahadasha: ${birthChart.dasha?.balanceDashaPlanet || 'Jupiter'}`
      : 'User has not yet provided birth coordinates. Ask them politely to provide Date, Time, and City of Birth for accurate Vedic astronomical readings.';

    const systemInstruction = `You are JyotishVeda AI, an authentic Classical Vedic Astrologer grounded in Maharishi Parashara's Brihat Parasara Hora Sastra (BPHS) and Jaimini Sutras.
${chartContext}

Guidelines:
1. Always distinguish factual astronomical placements (Lagna, Rashi, Nakshatra, Dasha) from interpretive guidance.
2. NEVER invent fake planetary positions or contradict the user's authentic chart coordinates provided above.
3. If birth details are missing, explicitly explain that precise planetary Bhavas require date, time, and birthplace.
4. Provide spiritual, constructive, and karmically uplifting remedies (Mantras, Daan, Sattvic lifestyle) rather than fatalistic fear.
5. Language: Respond in ${language === 'mr' ? 'authentic Marathi (Devanagari script)' : 'clear English with authentic Sanskrit astrological terms in parentheses'}.
6. Clearly remember you are an AI Astrology Assistant designed to assist alongside learned human Acharyas.`;

    // Construct contents array for Gemini REST API
    const contents: any[] = [];

    // Prior conversation history (up to last 6 turns)
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    for (const h of recentHistory) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text || h.message }],
      });
    }

    // Current query
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const aiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('Gemini API Error:', errText);
      return NextResponse.json({
        success: false,
        configured: true,
        message: 'The AI Astrology provider returned a service error. Please try again shortly.',
      }, { status: 502 });
    }

    const aiData = await aiRes.json();
    const reply = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({
        success: false,
        configured: true,
        message: 'Unable to parse AI astrology guidance. Please rephrase your query.',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Internal server error while processing AI chat query.',
    }, { status: 500 });
  }
}
