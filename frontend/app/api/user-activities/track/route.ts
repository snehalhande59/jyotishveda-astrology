import { NextRequest, NextResponse } from 'next/server';
import { recordLiveEvent } from '@/lib/live-events-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Immediately store in live memory buffer so Admin Dashboard reflects it instantly
    const recorded = recordLiveEvent({
      eventType: body.eventType,
      serviceName: body.serviceName,
      serviceCategory: body.serviceCategory,
      userIdentifier: body.username || body.userEmail || body.metadata?.name,
      isGuest: body.isGuest,
      location: body.metadata?.place || body.metadata?.placeOfBirth,
      metadata: body.metadata,
    });

    // 2. Also forward to Strapi backend asynchronously
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';
    try {
      fetch(`${strapiUrl}/api/user-activities/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch {}

    return NextResponse.json({ success: true, eventId: recorded.id });
  } catch (err) {
    return NextResponse.json({ success: true });
  }
}

