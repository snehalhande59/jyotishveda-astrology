import { NextRequest, NextResponse } from 'next/server';
import { getRealBookings, recordRealBooking } from '@/lib/live-events-store';

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';
  const authHeader = req.headers.get('authorization') || '';
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  try {
    const res = await fetch(`${strapiUrl}/api/admin/bookings?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data) && data.data.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch {}

  // Return real platform bookings from live-events-store
  const realBookings = getRealBookings({ status, search });
  return NextResponse.json({
    success: true,
    data: realBookings,
    meta: {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: Math.max(1, Math.ceil(realBookings.length / 25)),
        total: realBookings.length,
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recorded = recordRealBooking(body);
    return NextResponse.json({ success: true, data: recorded });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create booking' }, { status: 400 });
  }
}
