import { NextRequest, NextResponse } from 'next/server';

const AUDIT_LOGS = [
  {
    id: 'log_101',
    staffEmail: 'admin@astroveda.com',
    staffRole: 'Super Admin',
    action: 'ASTROLOGER_PROFILE_UPDATED',
    module: 'Astrologer Management',
    targetId: 'astro_1',
    targetTitle: 'Acharya Vidyadhar Shastri',
    details: 'Updated consultation fee to ₹1,499 and verified Parashara certification credentials',
    status: 'SUCCESS',
    ipAddress: '150.136.66.155',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: 'log_102',
    staffEmail: 'admin@astroveda.com',
    staffRole: 'Super Admin',
    action: 'BOOKING_STATUS_CHANGED',
    module: 'Appointments & Bookings',
    targetId: 'bk_2004',
    targetTitle: 'Rahul Kulkarni (Vedic Consultation)',
    details: 'Confirmed slot and dispatched Google Meet link to devotee and scholar',
    status: 'SUCCESS',
    ipAddress: '150.136.66.155',
    timestamp: new Date(Date.now() - 3600000 * 3.2).toISOString(),
  },
  {
    id: 'log_103',
    staffEmail: 'admin@astroveda.com',
    staffRole: 'Super Admin',
    action: 'SHOP_PRODUCT_CREATED',
    module: 'Shop & Products',
    targetId: 'prod_881',
    targetTitle: 'Authentic 7-Mukhi Nepali Rudraksha',
    details: 'Created inventory item with high-res imagery, lab certification, and price ₹2,499',
    status: 'SUCCESS',
    ipAddress: '150.136.66.155',
    timestamp: new Date(Date.now() - 3600000 * 6.5).toISOString(),
  },
  {
    id: 'log_104',
    staffEmail: 'admin@astroveda.com',
    staffRole: 'Super Admin',
    action: 'PAYMENT_AUDIT_VERIFIED',
    module: 'Payments & Transactions',
    targetId: 'TXN-2026-98124',
    targetTitle: 'Priyanka Sharma (₹1,499)',
    details: 'Verified Razorpay signature pay_PqL92Kls93Ksdj against bank ledger webhook',
    status: 'SUCCESS',
    ipAddress: '150.136.66.155',
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'log_105',
    staffEmail: 'admin@astroveda.com',
    staffRole: 'Super Admin',
    action: 'EXPORT_REPORTS_GENERATED',
    module: 'Reports & Export',
    targetId: 'rep_exp_all',
    targetTitle: 'Full Customer CSV Audit',
    details: 'Exported encrypted customer database report for monthly financial reconciliation',
    status: 'SUCCESS',
    ipAddress: '150.136.66.155',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'log_106',
    staffEmail: 'admin@astroveda.com',
    staffRole: 'Super Admin',
    action: 'ADMIN_LOGIN_SUCCESS',
    module: 'Authentication & Security',
    targetId: 'admin_session',
    targetTitle: 'Console Session Initialized',
    details: 'Secure login via Master Admin credentials with 2FA session token issue',
    status: 'SUCCESS',
    ipAddress: '150.136.66.155',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const moduleFilter = searchParams.get('module');
  const search = searchParams.get('search')?.toLowerCase() || '';

  let filtered = AUDIT_LOGS;
  if (moduleFilter && moduleFilter !== 'all') {
    filtered = filtered.filter((l) => l.module.toLowerCase().includes(moduleFilter.toLowerCase()));
  }
  if (search) {
    filtered = filtered.filter(
      (l) =>
        l.action.toLowerCase().includes(search) ||
        l.details.toLowerCase().includes(search) ||
        l.staffEmail.toLowerCase().includes(search) ||
        l.targetTitle.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    meta: {
      pagination: {
        page: 1,
        pageSize: 50,
        pageCount: 1,
        total: filtered.length,
      },
    },
  });
}
