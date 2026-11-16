import { NextRequest, NextResponse } from 'next/server';

let coupons = [
  {
    id: 'cpn_1',
    code: 'VEDA20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    usageLimit: 500,
    usedCount: 142,
    validUntil: '2026-12-31T23:59:59Z',
    isActive: true,
    applicableTo: 'All Consultations & Reports',
  },
  {
    id: 'cpn_2',
    code: 'SHUBH100',
    discountType: 'flat',
    discountValue: 100,
    minOrderAmount: 800,
    usageLimit: 200,
    usedCount: 78,
    validUntil: '2026-12-15T23:59:59Z',
    isActive: true,
    applicableTo: 'Janam Kundli Reports',
  },
  {
    id: 'cpn_3',
    code: 'FESTIVAL50',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1000,
    usageLimit: 300,
    usedCount: 215,
    validUntil: '2027-03-31T23:59:59Z',
    isActive: true,
    applicableTo: 'Vedic Store Items',
  },
];

export async function GET(req: NextRequest) {
  const plans = [
    {
      id: 'plan_monthly',
      name: 'Vedic Sadhak (Monthly)',
      price: 499,
      billingCycle: 'monthly',
      features: [
        'Unlimited Janam Kundli Generations',
        'Daily & Weekly Personal Transits',
        'Priority Chat with Scholars',
        '10% Discount on Live Consultations',
      ],
      activeMembers: 14,
      status: 'active',
    },
    {
      id: 'plan_annual',
      name: 'Jyotish Acharya Premium (Annual)',
      price: 3999,
      billingCycle: 'yearly',
      features: [
        'Everything in Monthly Plan',
        '2 Free 30-Min Video Consultations',
        'Full Annual Varshaphala Chart (PDF)',
        'Custom Muhurat Calculations',
        'VIP WhatsApp Hotline',
      ],
      activeMembers: 9,
      status: 'active',
    },
  ];

  const activeSubscriptions = [
    {
      id: 'sub_101',
      customerName: 'Priyanka Sharma',
      customerEmail: 'priyanka.sharma@example.com',
      planName: 'Jyotish Acharya Premium (Annual)',
      amount: 3999,
      status: 'active',
      startDate: '2026-08-15T00:00:00Z',
      nextBillingDate: '2027-08-15T00:00:00Z',
      paymentMethod: 'Razorpay Auto-Debit (UPI)',
    },
    {
      id: 'sub_102',
      customerName: 'Rahul Kulkarni',
      customerEmail: 'rahul.kulkarni@example.com',
      planName: 'Vedic Sadhak (Monthly)',
      amount: 499,
      status: 'active',
      startDate: '2026-10-01T00:00:00Z',
      nextBillingDate: '2026-12-01T00:00:00Z',
      paymentMethod: 'Razorpay Card',
    },
    {
      id: 'sub_103',
      customerName: 'Anita Patil',
      customerEmail: 'anita.patil@example.com',
      planName: 'Vedic Sadhak (Monthly)',
      amount: 499,
      status: 'active',
      startDate: '2026-11-01T00:00:00Z',
      nextBillingDate: '2026-12-01T00:00:00Z',
      paymentMethod: 'Razorpay UPI',
    },
  ];

  return NextResponse.json({
    success: true,
    data: {
      plans,
      activeSubscriptions,
      coupons,
      metrics: {
        totalActiveSubscribers: activeSubscriptions.length,
        monthlyRecurringRevenue: 5496,
        activeCouponsCount: coupons.filter((c) => c.isActive).length,
        totalCouponRedemptions: coupons.reduce((sum, c) => sum + c.usedCount, 0),
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCoupon = {
      id: `cpn_${Date.now()}`,
      code: String(body.code || '').toUpperCase().trim(),
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue) || 10,
      minOrderAmount: Number(body.minOrderAmount) || 500,
      usageLimit: Number(body.usageLimit) || 100,
      usedCount: 0,
      validUntil: body.validUntil || '2026-12-31T23:59:59Z',
      isActive: true,
      applicableTo: body.applicableTo || 'All Services',
    };
    coupons.unshift(newCoupon);
    return NextResponse.json({ success: true, data: newCoupon });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
