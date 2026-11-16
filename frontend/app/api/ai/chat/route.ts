import { NextRequest, NextResponse } from 'next/server';
import { getStrapiUrl } from '@/lib/api';

/**
 * Next.js Edge/Node API route for AI Astrology Chat.
 * Delegates securely to the Strapi backend on Render where GEMINI_API_KEY is stored.
 * Never exposes the Gemini API key in frontend bundles or client JavaScript.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], birthChart = null, language = 'en' } = body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message parameter is required and cannot be empty.' },
        { status: 400 }
      );
    }

    const strapiUrl = getStrapiUrl();
    const backendEndpoint = `${strapiUrl}/api/ai/chat`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const backendRes = await fetch(backendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          history,
          birthChart,
          language,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await backendRes.json().catch(() => null);

      if (!backendRes.ok) {
        return NextResponse.json(
          data || {
            success: false,
            configured: true,
            message: `Backend AI endpoint returned error (${backendRes.status})`,
          },
          { status: backendRes.status }
        );
      }

      return NextResponse.json(data);
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json(
          {
            success: false,
            configured: true,
            message: 'Request timed out waiting for AI astrologer. Please try again.',
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          configured: false,
          message: 'Unable to reach backend AI service. Please ensure the backend server is running.',
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('[AI Chat Route Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Internal server error processing AI astrology request.',
      },
      { status: 500 }
    );
  }
}
