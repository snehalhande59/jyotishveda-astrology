import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const campaigns = [
      {
        id: 1,
        title: 'Shubh Kartik Purnima & Dev Diwali Maha Muhurat',
        message: 'Celebrate Kartik Purnima with special planetary blessings. Book your sacred Satyanarayan Pooja.',
        channel: 'All (Push + In-App)',
        targetAudience: 'All Registered Devotees',
        status: 'sent',
        scheduledAt: '2026-11-05T06:00:00Z',
        sentCount: 1420,
        openRate: '38.4%',
      },
      {
        id: 2,
        title: '20% Vedic Discount on Original Consecrated Rudraksha',
        message: 'Authentic 1 to 14 Mukhi Indonesian & Nepali Rudraksha energized with Vedic Pran Pratishtha.',
        channel: 'In-App Banner',
        targetAudience: 'Active Shop Visitors',
        status: 'active',
        scheduledAt: '2026-11-04T10:00:00Z',
        sentCount: 890,
        openRate: '42.1%',
      },
      {
        id: 3,
        title: 'Weekly Horoscope: Sun Enters Scorpio Special Reading',
        message: 'Find out how Surya Gochar impacts your career, finances, and relationships this month.',
        channel: 'Email Newsletter',
        targetAudience: 'Newsletter Subscribers',
        status: 'scheduled',
        scheduledAt: '2026-11-08T08:00:00Z',
        sentCount: 0,
        openRate: '0%',
      },
    ];

    return NextResponse.json({
      success: true,
      data: campaigns,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      data: {
        id: Date.now(),
        ...body,
        status: 'scheduled',
        sentCount: 0,
        openRate: '0%',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
