import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';

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

