import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const tier = searchParams.get('tier') || '';

    // Customer CRM profiles with detailed metrics
    let customers = [
      {
        id: 1,
        username: 'rohitdeshmukh',
        fullName: 'Rohit Deshmukh',
        email: 'rohit.deshmukh@example.com',
        phone: '+91 9820123456',
        tier: 'VIP',
        totalBookings: 8,
        totalSpend: 11492,
        servicesUsed: ['Kundli Matchmaking', 'Vedic Consultation', 'Career Report', 'Rudraksha Shop'],
        birthDetails: {
          dob: '1998-05-14',
          tob: '06:45',
          pob: 'Pune, Maharashtra',
          rashi: 'Taurus (Vrishabha)',
          nakshatra: 'Rohini',
        },
        followUpStatus: 'Satisfied Client',
        internalNotes: 'Prefers Marathi consultations with Acharya Shastri. Purchased 5-Mukhi Rudraksha.',
        createdAt: '2026-01-15T10:30:00Z',
        lastActive: '2026-11-05T12:30:00Z',
      },
      {
        id: 2,
        username: 'priyasharma',
        fullName: 'Priyanka Sharma',
        email: 'priyanka.sharma@example.com',
        phone: '+91 9820123456',
        tier: 'Regular',
        totalBookings: 3,
        totalSpend: 3997,
        servicesUsed: ['Marriage Compatibility', 'Yearly Horoscope'],
        birthDetails: {
          dob: '1995-11-20',
          tob: '14:20',
          pob: 'Mumbai, Maharashtra',
          rashi: 'Scorpio (Vrishchika)',
          nakshatra: 'Anuradha',
        },
        followUpStatus: 'Follow-up Due',
        internalNotes: 'Inquired about Manglik Dosha remedies for upcoming vivaha.',
        createdAt: '2026-03-22T14:15:00Z',
        lastActive: '2026-11-04T18:45:00Z',
      },
      {
        id: 3,
        username: 'rahulverma',
        fullName: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        phone: '+91 9711234567',
        tier: 'Regular',
        totalBookings: 2,
        totalSpend: 2498,
        servicesUsed: ['Career Astrology', 'Gemstone Consultation'],
        birthDetails: {
          dob: '1992-08-08',
          tob: '09:10',
          pob: 'Delhi, India',
          rashi: 'Leo (Simha)',
          nakshatra: 'Magha',
        },
        followUpStatus: 'Contacted',
        internalNotes: 'Recommended Yellow Sapphire for Jupiter transit period.',
        createdAt: '2026-04-10T09:00:00Z',
        lastActive: '2026-11-03T11:20:00Z',
      },
      {
        id: 4,
        username: 'anitapatil',
        fullName: 'Anita Patil',
        email: 'anita.patil@example.com',
        phone: '+91 9422345678',
        tier: 'VIP',
        totalBookings: 6,
        totalSpend: 8994,
        servicesUsed: ['Panchang Muhurat', 'Kundli Matching', 'Navgrah Yantra'],
        birthDetails: {
          dob: '1988-02-17',
          tob: '18:50',
          pob: 'Nashik, Maharashtra',
          rashi: 'Aquarius (Kumbha)',
          nakshatra: 'Shatabhisha',
        },
        followUpStatus: 'Satisfied Client',
        internalNotes: 'Requested Griha Pravesh auspicious shubh muhurat in December.',
        createdAt: '2026-02-05T16:20:00Z',
        lastActive: '2026-11-05T09:15:00Z',
      },
      {
        id: 5,
        username: 'amitdeshmukh',
        fullName: 'Amit Deshmukh',
        email: 'amit.deshmukh@example.com',
        phone: '+91 9158012345',
        tier: 'Prospect',
        totalBookings: 1,
        totalSpend: 999,
        servicesUsed: ['Free Kundli', 'Numerology Report'],
        birthDetails: {
          dob: '1996-07-25',
          tob: '04:30',
          pob: 'Nagpur, Maharashtra',
          rashi: 'Cancer (Karka)',
          nakshatra: 'Pushya',
        },
        followUpStatus: 'New Lead',
        internalNotes: 'Signed up after viewing Free Daily Rashifal. Interested in business consultation.',
        createdAt: '2026-10-28T11:45:00Z',
        lastActive: '2026-11-05T14:10:00Z',
      },
    ];

    if (search) {
      customers = customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          c.username.toLowerCase().includes(search)
      );
    }

    if (tier && tier !== 'All') {
      customers = customers.filter((c) => c.tier.toLowerCase() === tier.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: customers,
      meta: {
        pagination: {
          page: 1,
          pageSize: 20,
          pageCount: 1,
          total: customers.length,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
