import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const astrologerId = searchParams.get('astrologerId');
    const month = searchParams.get('month');

    // Live Astrologer appointments schedule
    const appointments = [
      {
        id: 'apt-101',
        astrologerId: 1,
        astrologerName: 'Acharya Devendra Shastri',
        customerName: 'Snehal Hande',
        customerPhone: '+91 8459368256',
        customerEmail: 'snehalhande59@gmail.com',
        appointmentDate: '2026-11-06',
        appointmentTime: '10:30 AM',
        durationMinutes: 30,
        serviceType: 'Vedic Kundli Deep Dive',
        status: 'confirmed',
        meetingLink: 'https://meet.jyotishveda.com/astro-room-devendra',
        notes: 'Discussion on Sade Sati planetary remedies.',
      },
      {
        id: 'apt-102',
        astrologerId: 2,
        astrologerName: 'Dr. Radhika Joshi',
        customerName: 'Priyanka Sharma',
        customerPhone: '+91 9820123456',
        customerEmail: 'priyanka.sharma@example.com',
        appointmentDate: '2026-11-06',
        appointmentTime: '02:00 PM',
        durationMinutes: 45,
        serviceType: 'Kundli Milan & Vivaha Muhurat',
        status: 'confirmed',
        meetingLink: 'https://meet.jyotishveda.com/astro-room-radhika',
        notes: 'Kundli matching evaluation with Nadi Dosha cancellation.',
      },
      {
        id: 'apt-103',
        astrologerId: 1,
        astrologerName: 'Acharya Devendra Shastri',
        customerName: 'Amit Deshmukh',
        customerPhone: '+91 9158012345',
        customerEmail: 'amit.deshmukh@example.com',
        appointmentDate: '2026-11-07',
        appointmentTime: '11:00 AM',
        durationMinutes: 30,
        serviceType: 'Business Growth & Muhurat',
        status: 'pending',
        meetingLink: 'https://meet.jyotishveda.com/astro-room-devendra',
        notes: 'New partnership auspicious date calculation.',
      },
      {
        id: 'apt-104',
        astrologerId: 3,
        astrologerName: 'Pandit Suresh Kulkarni',
        customerName: 'Anita Patil',
        customerPhone: '+91 9422345678',
        customerEmail: 'anita.patil@example.com',
        appointmentDate: '2026-11-08',
        appointmentTime: '04:30 PM',
        durationMinutes: 30,
        serviceType: 'Vastu & Griha Pravesh Consultation',
        status: 'confirmed',
        meetingLink: 'https://meet.jyotishveda.com/astro-room-suresh',
        notes: 'Directional map review for residence.',
      },
      {
        id: 'apt-105',
        astrologerId: 2,
        astrologerName: 'Dr. Radhika Joshi',
        customerName: 'Rahul Verma',
        customerPhone: '+91 9711234567',
        customerEmail: 'rahul.verma@example.com',
        appointmentDate: '2026-11-09',
        appointmentTime: '06:00 PM',
        durationMinutes: 30,
        serviceType: 'Career Transit & Gemstone Guidance',
        status: 'completed',
        meetingLink: 'https://meet.jyotishveda.com/astro-room-radhika',
        notes: 'Prescribed Pukhraj ring energization process.',
      },
    ];

    let filtered = appointments;
    if (astrologerId && astrologerId !== 'all') {
      filtered = filtered.filter((a) => String(a.astrologerId) === String(astrologerId));
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
