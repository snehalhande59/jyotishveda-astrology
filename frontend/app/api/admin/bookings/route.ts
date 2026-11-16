import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-backend-0epp.onrender.com';
  const authHeader = req.headers.get('authorization') || '';
  const searchParams = req.nextUrl.searchParams;

  try {
    const res = await fetch(`${strapiUrl}/api/admin/bookings?${searchParams.toString()}`, {
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

  return NextResponse.json({
    success: true,
    data: [],
    meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } },
  });
}

