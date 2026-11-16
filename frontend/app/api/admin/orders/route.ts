import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase() || '';

    let orders = [
      {
        id: 'ord_1001',
        orderNumber: 'JV-ORD-2026-8901',
        customerName: 'Rohit Deshmukh',
        customerEmail: 'rohit.deshmukh@example.com',
        customerPhone: '+91 9820123456',
        items: [
          { name: 'Taurus (Vrishabha) Zodiac Bracelet', quantity: 1, price: 699 },
          { name: 'Gemini (Mithuna) Zodiac Pendant', quantity: 1, price: 699 },
        ],
        subtotal: 1398,
        shipping: 0,
        tax: 42,
        totalAmount: 1440,
        paymentStatus: 'paid',
        paymentMethod: 'Razorpay UPI',
        orderStatus: 'shipped',
        shippingAddress: {
          fullName: 'Rohit Deshmukh',
          addressLine1: 'Shivaji Chowk, Model Colony',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411016',
        },
        trackingNumber: 'DELHIVERY-9821734918',
        placedAt: '2026-11-04T14:32:00Z',
      },
      {
        id: 'ord_1002',
        orderNumber: 'JV-ORD-2026-8902',
        customerName: 'Priyanka Sharma',
        customerEmail: 'priyanka.sharma@example.com',
        customerPhone: '+91 9820123456',
        items: [
          { name: '5-Mukhi Indonesian Rudraksha Mala (108 Beads)', quantity: 1, price: 1299 },
        ],
        subtotal: 1299,
        shipping: 0,
        tax: 39,
        totalAmount: 1338,
        paymentStatus: 'paid',
        paymentMethod: 'Razorpay Card',
        orderStatus: 'processing',
        shippingAddress: {
          fullName: 'Priyanka Sharma',
          addressLine1: 'B-402, Sea Green Heights, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
        },
        trackingNumber: '',
        placedAt: '2026-11-05T09:12:00Z',
      },
      {
        id: 'ord_1003',
        orderNumber: 'JV-ORD-2026-8903',
        customerName: 'Anita Patil',
        customerEmail: 'anita.patil@example.com',
        customerPhone: '+91 9422345678',
        items: [
          { name: 'Pure Brass Shri Sampurna Navgrah Yantra', quantity: 1, price: 1899 },
          { name: 'Original Tulsi Japa Mala', quantity: 2, price: 598 },
        ],
        subtotal: 2497,
        shipping: 0,
        tax: 75,
        totalAmount: 2572,
        paymentStatus: 'paid',
        paymentMethod: 'NetBanking',
        orderStatus: 'delivered',
        shippingAddress: {
          fullName: 'Anita Patil',
          addressLine1: 'Plot 45, Anand Nagar, Gangapur Road',
          city: 'Nashik',
          state: 'Maharashtra',
          pincode: '422013',
        },
        trackingNumber: 'BLUEDART-8491027581',
        placedAt: '2026-11-01T11:00:00Z',
      },
      {
        id: 'ord_1004',
        orderNumber: 'JV-ORD-2026-8904',
        customerName: 'Amit Deshmukh',
        customerEmail: 'amit.deshmukh@example.com',
        customerPhone: '+91 9158012345',
        items: [
          { name: 'Vedic Brihat Parashara Hora Shastra (2 Volumes)', quantity: 1, price: 1499 },
        ],
        subtotal: 1499,
        shipping: 0,
        tax: 45,
        totalAmount: 1544,
        paymentStatus: 'pending',
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'pending',
        shippingAddress: {
          fullName: 'Amit Deshmukh',
          addressLine1: 'Flat 12, Ramkrishna Villa, Civil Lines',
          city: 'Nagpur',
          state: 'Maharashtra',
          pincode: '440001',
        },
        trackingNumber: '',
        placedAt: '2026-11-05T15:45:00Z',
      },
    ];

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.customerEmail.toLowerCase().includes(search) ||
          o.customerPhone.includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: orders,
      meta: {
        pagination: {
          page: 1,
          pageSize: 20,
          pageCount: 1,
          total: orders.length,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
