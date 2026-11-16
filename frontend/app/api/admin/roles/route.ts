import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const roles = [
      {
        id: 1,
        name: 'Super Admin',
        code: 'super_admin',
        description: 'Full unconstrained platform control, financial oversight, credentials management.',
        usersCount: 1,
        permissions: [
          'dashboard:read',
          'astrologers:manage',
          'users:manage',
          'crm:manage',
          'calendar:manage',
          'shop:manage',
          'support:manage',
          'notifications:manage',
          'content:manage',
          'finance:export',
          'settings:write',
        ],
      },
      {
        id: 2,
        name: 'Platform Operations Admin',
        code: 'admin',
        description: 'Operations supervisor, booking management, user inquiries, verification.',
        usersCount: 2,
        permissions: [
          'dashboard:read',
          'astrologers:manage',
          'users:manage',
          'crm:manage',
          'calendar:manage',
          'shop:manage',
          'support:manage',
          'notifications:manage',
          'content:manage',
          'finance:read',
        ],
      },
      {
        id: 3,
        name: 'Astrology Desk Manager',
        code: 'astrology_manager',
        description: 'Manages astrologer onboarding, slot schedules, and appointment calendars.',
        usersCount: 2,
        permissions: ['dashboard:read', 'astrologers:manage', 'calendar:manage', 'bookings:manage'],
      },
      {
        id: 4,
        name: 'Vedic Shop Coordinator',
        code: 'shop_manager',
        description: 'Product catalog maintenance, order fulfillment, shipping dispatch updates.',
        usersCount: 1,
        permissions: ['shop:manage', 'orders:manage'],
      },
      {
        id: 5,
        name: 'Customer Support Lead',
        code: 'support_staff',
        description: 'Resolves customer helpdesk tickets, consultation queries, chat inquiries.',
        usersCount: 3,
        permissions: ['support:manage', 'crm:read', 'bookings:read'],
      },
    ];

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
