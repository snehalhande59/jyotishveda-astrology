import { NextRequest, NextResponse } from 'next/server';
import { getRecentLiveEvents } from '@/lib/live-events-store';

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-strapi-8f1717-150-136-44-53.sslip.io';
  const authHeader = req.headers.get('authorization') || '';
  const searchParams = req.nextUrl.searchParams;

  try {
    const res = await fetch(`${strapiUrl}/api/user-activities?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  const liveEvents = getRecentLiveEvents(50);
  return NextResponse.json({
    data: liveEvents,
    meta: {
      pagination: {
        page: 1,
        pageSize: 50,
        pageCount: 1,
        total: liveEvents.length,
      },
    },
  });
}
