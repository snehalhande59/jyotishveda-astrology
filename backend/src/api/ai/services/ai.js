'use strict';

/**
 * JyotishVeda Gemini AI Astrology Service
 * Communicates with the official Google Gemini API using GEMINI_API_KEY stored securely on the backend.
 */

function buildSystemInstruction({ birthChart, language }) {
  const chartContext = birthChart && (birthChart.dob || birthChart.ascendant || birthChart.lagna)
    ? `User's Authenticated Vedic Birth Chart Coordinates:
- Full Name: ${birthChart.fullName || 'Seeker'}
- Date of Birth: ${birthChart.dob || 'Provided'} ${birthChart.tob || ''}
- Place of Birth: ${birthChart.place || birthChart.pob || 'Provided'}
- Ascendant (Lagna): ${birthChart.ascendant?.signName || birthChart.lagna || 'Known'}
- Moon Sign (Chandra Rashi): ${birthChart.moonSign?.signName || birthChart.rashi || 'Known'}
- Birth Star (Nakshatra): ${birthChart.nakshatra || birthChart.moonSign?.nakshatra || 'Known'} (Pada ${birthChart.pada || 1})
- Current Mahadasha: ${birthChart.dasha?.balanceDashaPlanet || birthChart.currentDasha || 'Active'}`
    : 'User has not yet provided complete birth chart coordinates. For queries requiring personalized Kundli predictions, kindly invite them to provide their exact Date of Birth, Time of Birth, and Place of Birth.';

  const isMr = language === 'mr';

  return `You are JyotishVeda AI (ज्योतिषवेदा एआय), an authentic, compassionate Classical Vedic Astrologer grounded in Maharishi Parashara's Brihat Parasara Hora Sastra (BPHS), Jaimini Upadesha Sutras, and the Chitrapaksha / Lahiri Sidereal Ayanamsa.

${chartContext}

Core Astrological Capabilities & Knowledge:
1. Birth Chart (Kundli) & 12 Bhavas: Accurate analysis of Tanu (1st), Dhana (2nd), Sahaja (3rd), Sukha (4th), Putra (5th), Ari (6th), Kalatra (7th), Randhra (8th), Dharma (9th), Karma (10th), Labha (11th), and Vyaya (12th).
2. Navagrahas: Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, and Ketu - their dignities (Uchha, Neecha, Moolatrikona, Swakshetra), aspects (Drishti), and functional natures.
3. 27 Nakshatras & 12 Rashis: In-depth understanding of lunar mansions and planetary rulerships.
4. Vimshottari Mahadasha: 120-year planetary dasha sequence for timing life events (Career, Marriage, Wealth, Health, Spiritual Growth).
5. Ashta Kuta Guna Milan: 36 Guna compatibility system (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) for marital harmony.
6. Vedic Panchang: Five limbs of time (Tithi, Vaara, Nakshatra, Yoga, Karana).
7. Classical Doshas & Remedies: Authentic analysis of Manglik (Kuja) Dosha, Sade Sati, Shani Dhaiya, and Kaal Sarp Dosha with practical, spiritually uplifting remedies (Vedic mantras, Japa, Sattvic Daan, fasting/Vrata, Rudraksha, and ethical living).

Guidelines:
1. Distinguish between astronomical factual placements and interpretive guidance.
2. If birth details are provided, incorporate them faithfully without inventing conflicting planetary degrees.
3. If birth details are missing, address the philosophical or general astrological question and politely ask for birth details for personalized Kundli chart reading.
4. Provide spiritually constructive, empowering answers. Never cause panic or fatalistic fear. Emphasize that Karma and Free Will (Purushartha) work hand-in-hand with Daiva (Destiny).
5. Language: ${isMr ? 'Respond entirely in authentic, fluent Marathi (मराठी) using Devanagari script with natural astrological terminology (कुंडली, राशी, नक्षत्र, दशा, ग्रहस्थिती, उपाय).' : 'Respond in clear, elegant English with authentic Sanskrit astrological terms in parentheses (e.g., Ascendant (Lagna), 10th House (Karma Bhava)).'}
6. Remember you are an AI Astrology Assistant assisting seekers alongside learned human Acharyas and Pandits.`;
}

module.exports = ({ strapi }) => ({
  async generateAstrologyGuidance({ message, history = [], birthChart = null, language = 'en' }) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return {
        success: false,
        configured: false,
        message: 'Google Gemini AI engine is not configured on the backend. Please add GEMINI_API_KEY in Render environment variables.',
      };
    }

    const trimmedKey = apiKey.trim();
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const systemInstruction = buildSystemInstruction({ birthChart, language });

    // Sanitize and format conversation history
    const contents = [];
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-8); // Keep last 8 turns for contextual depth
      for (const turn of recentHistory) {
        const text = (turn.message || turn.text || '').trim();
        if (text) {
          const role = turn.sender === 'user' || turn.senderType === 'user' || turn.role === 'user' ? 'user' : 'model';
          contents.push({
            role,
            parts: [{ text }],
          });
        }
      }
    }

    // Append current query
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${trimmedKey}`;

    try {
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 900,
            topP: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        strapi.log.error(`[Gemini AI] API error status ${response.status}: ${errorBody}`);

        if (response.status === 429) {
          return {
            success: false,
            configured: true,
            rateLimited: true,
            message: 'Gemini AI service is temporarily experiencing high traffic. Please retry in a few moments.',
          };
        }

        if (response.status === 400 || response.status === 403) {
          return {
            success: false,
            configured: false,
            message: 'Gemini API key is invalid or lacks proper permissions. Please verify GEMINI_API_KEY.',
          };
        }

        return {
          success: false,
          configured: true,
          message: 'The AI Astrology provider returned a service error. Please try again shortly.',
        };
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply || reply.trim().length === 0) {
        return {
          success: false,
          configured: true,
          message: 'Unable to formulate astrological response. Please rephrase your question.',
        };
      }

      return {
        success: true,
        configured: true,
        reply: reply.trim(),
        model,
        timestamp: new Date().toISOString(),
      };
    } catch (netErr) {
      strapi.log.error('[Gemini AI] Network dispatch exception:', netErr);
      return {
        success: false,
        configured: true,
        message: 'Network error connecting to Gemini AI provider. Please retry.',
      };
    }
  },
});
