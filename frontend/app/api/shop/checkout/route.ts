import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS_CATALOGUE } from '@/lib/shop-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingAddress, user } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.addressLine1 || !shippingAddress?.city || !shippingAddress?.pincode) {
      return NextResponse.json({ success: false, message: 'Incomplete shipping address' }, { status: 400 });
    }

    // 1. Strict Server-Side Validation: Never trust client-sent prices
    let validatedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const clientItem of items) {
      const serverProduct = PRODUCTS_CATALOGUE.find((p) => p.id === clientItem.product?.id || p.id === clientItem.id);
      if (!serverProduct) {
        return NextResponse.json({ success: false, message: `Product ${clientItem.product?.name || 'unknown'} not found in catalogue.` }, { status: 404 });
      }

      const qty = Math.max(1, parseInt(clientItem.quantity, 10) || 1);
      validatedSubtotal += serverProduct.price * qty;
      validatedItems.push({
        id: serverProduct.id,
        name: serverProduct.name,
        price: serverProduct.price,
        quantity: qty,
        total: serverProduct.price * qty,
      });
    }

    const shipping = validatedSubtotal >= 999 ? 0 : 99;
    const tax = Math.round(validatedSubtotal * 0.03); // 3% Vedic Seva & Insurance
    const finalAmount = validatedSubtotal + shipping + tax;

    const receipt = `shop_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // If Razorpay credentials are set in environment, create real Razorpay order
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_${Date.now()}`;
    let isTestMode = true;

    if (razorpaySecret && razorpayKeyId && razorpayKeyId !== 'rzp_test_placeholder') {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: finalAmount * 100, // paise
            currency: 'INR',
            receipt,
            notes: {
              type: 'shop_order',
              customer: shippingAddress.fullName,
              city: shippingAddress.city,
            },
          }),
        });

        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          orderId = rzpData.id;
          isTestMode = false;
        }
      } catch (e) {
        console.warn('Razorpay server order creation fallback to simulated order ID:', e);
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId,
        receipt,
        amount: finalAmount,
        currency: 'INR',
        keyId: razorpayKeyId,
        isTestMode,
        validatedSubtotal,
        shipping,
        tax,
        validatedItems,
        shippingAddress,
      },
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Checkout error' }, { status: 500 });
  }
}
