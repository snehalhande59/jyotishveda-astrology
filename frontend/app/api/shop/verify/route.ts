import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, orderDetails } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json({ success: false, message: 'Missing orderId or paymentId' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    let isValid = true;

    if (secret && signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');
      isValid = generatedSignature === signature;
    }

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid payment signature verification failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order verified and confirmed successfully',
      confirmedOrder: {
        orderId,
        paymentId,
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
        items: orderDetails?.validatedItems || [],
        total: orderDetails?.amount || 0,
        shippingAddress: orderDetails?.shippingAddress || {},
      },
    });
  } catch (error: any) {
    console.error('Verify order error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Payment verification error' }, { status: 500 });
  }
}
