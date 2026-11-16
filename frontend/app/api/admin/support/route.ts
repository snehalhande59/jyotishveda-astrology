import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let tickets = [
      {
        id: 1,
        ticketNumber: 'TKT-2026-081',
        customerName: 'Snehal Hande',
        customerEmail: 'snehalhande59@gmail.com',
        category: 'Consultation Appointment',
        priority: 'high',
        status: 'open',
        subject: 'Rescheduling request for Kundli consultation with Acharya Devendra',
        description: 'Need to shift tomorrow morning slot from 10:30 AM to 04:00 PM due to urgent travel.',
        assignedStaff: 'Astro Support Lead',
        createdAt: '2026-11-05T11:20:00Z',
        replies: [
          {
            authorName: 'Astro Support Lead',
            authorRole: 'support',
            message: 'Namaste Snehal ji, checking pandit ji schedule for 4:00 PM slot right away.',
            createdAt: '2026-11-05T11:45:00Z',
          },
        ],
      },
      {
        id: 2,
        ticketNumber: 'TKT-2026-079',
        customerName: 'Anita Patil',
        customerEmail: 'anita.patil@example.com',
        category: 'Shop Order Delivery',
        priority: 'medium',
        status: 'in_progress',
        subject: 'Tracking update for Shri Navgrah Yantra brass parcel',
        description: 'Kindly provide courier tracking dispatch details for order #JV-ORD-2026-8903.',
        assignedStaff: 'Fulfillment Team',
        createdAt: '2026-11-04T15:30:00Z',
        replies: [
          {
            authorName: 'Fulfillment Team',
            authorRole: 'support',
            message: 'Shipped via BlueDart AWB: BLUEDART-8491027581. Expected delivery in 48 hours.',
            createdAt: '2026-11-04T17:10:00Z',
          },
        ],
      },
      {
        id: 3,
        ticketNumber: 'TKT-2026-074',
        customerName: 'Rahul Verma',
        customerEmail: 'rahul.verma@example.com',
        category: 'Report Download',
        priority: 'low',
        status: 'resolved',
        subject: 'Downloaded Career Astrology PDF font rendering query',
        description: 'Vedic chart planets Sanskrit glyph symbols resolved after updating PDF reader.',
        assignedStaff: 'Tech Desk',
        createdAt: '2026-11-02T10:15:00Z',
        replies: [
          {
            authorName: 'Tech Desk',
            authorRole: 'support',
            message: 'Updated font pack sent over email. Issue verified as resolved.',
            createdAt: '2026-11-02T11:30:00Z',
          },
        ],
      },
    ];

    if (status && status !== 'all') {
      tickets = tickets.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    if (priority && priority !== 'all') {
      tickets = tickets.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: tickets,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
