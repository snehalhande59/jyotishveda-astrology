import { NextRequest, NextResponse } from 'next/server';
import { getRealBookings, recordRealBooking } from '@/lib/live-events-store';

let cachedBackendJwt: string | null = null;
let tokenExpiresAt = 0;

async function getBackendAdminToken(strapiUrl: string): Promise<string | null> {
  if (cachedBackendJwt && Date.now() < tokenExpiresAt) {
    return cachedBackendJwt;
  }
  try {
    const res = await fetch(`${strapiUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@astroveda.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@AstroVeda2026!',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const token = data?.jwt || data?.token;
      if (token) {
        cachedBackendJwt = token;
        tokenExpiresAt = Date.now() + 2 * 60 * 60 * 1000;
        return cachedBackendJwt;
      }
    }
  } catch (err) {
    console.warn('Backend admin auth fallback error:', err);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';
  let authHeader = req.headers.get('authorization') || '';
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  if (!authHeader || !authHeader.includes('.')) {
    const backendToken = await getBackendAdminToken(strapiUrl);
    if (backendToken) {
      authHeader = `Bearer ${backendToken}`;
    }
  }

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
