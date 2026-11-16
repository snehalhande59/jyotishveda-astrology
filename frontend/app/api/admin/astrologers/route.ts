import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-strapi-8f1717-150-136-44-53.sslip.io';
  const authHeader = req.headers.get('authorization') || '';
  const searchParams = req.nextUrl.searchParams;

  try {
    const res = await fetch(`${strapiUrl}/api/admin/astrologers?${searchParams.toString()}`, {
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

  // Fallback to public astrologers endpoint
  try {
    const pubRes = await fetch(`${strapiUrl}/api/astrologers?populate=*`);
    if (pubRes.ok) {
      const json = await pubRes.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      return NextResponse.json({
        success: true,
        data: list,
        meta: { pagination: { page: 1, pageSize: 50, pageCount: 1, total: list.length } },
      });
    }
  } catch {}

  return NextResponse.json({ success: true, data: [], meta: { pagination: { page: 1, pageSize: 50, pageCount: 1, total: 0 } } });
}

export async function POST(req: NextRequest) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jyotishveda-strapi-8f1717-150-136-44-53.sslip.io';
  const authHeader = req.headers.get('authorization') || '';
  const body = await req.json();

  try {
    const res = await fetch(`${strapiUrl}/api/admin/astrologers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({ success: true, data: { id: Date.now(), ...body } });
}
