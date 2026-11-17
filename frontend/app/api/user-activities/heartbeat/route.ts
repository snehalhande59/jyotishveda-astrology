import { NextRequest, NextResponse } from 'next/server';
import { recordActiveSession } from '@/lib/live-events-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';

    // Record real active visitor session in live telemetry store
    recordActiveSession({
      sessionId: body.sessionId,
      email: body.userEmail || body.email,
      username: body.username,
      path: body.path || '/',
      isGuest: !body.userEmail && !body.email,
    });

    try {
      await fetch(`${strapiUrl}/api/user-activities/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {}

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch {
    return NextResponse.json({ success: true });
  }
}

