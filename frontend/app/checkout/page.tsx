'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, clearCart, getCartTotals, CartItem } from '@/lib/cart';
import { getCurrentUser } from '@/lib/auth';
import { openRazorpayModal } from '@/lib/razorpay';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  Truck,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState(getCartTotals());
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Address Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const current = getCart();
    if (current.length === 0 && !confirmedOrder) {
      router.push('/shop');
      return;
    }
    setItems(current);
    setTotals(getCartTotals(current));

    const u = getCurrentUser();
    if (u) {
      setFullName(u.username || '');
      setEmail(u.email || '');
    }

    // Load Razorpay checkout script dynamically
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [router, confirmedOrder]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Send checkout request to server for validation & order creation
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: {
            fullName,
            phone,
            email,
            addressLine1,
            city,
            state: stateName,
            pincode,
          },
          user: getCurrentUser(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to initialize order on server.');
      }

      const { order } = data;

      // 2. Open Razorpay Gateway with graceful fallback
      let modalCompleted = false;

      await openRazorpayModal({
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: 'INR',
        name: isMr ? 'ज्योतिषवेदा वैदिक स्टोअर' : 'JyotishVeda Astrology Store',
        description: `Vedic Shop Order (${order.receipt})`,
        order_id: order.orderId,
        prefill: {
          name: fullName,
          email,
          contact: phone,
        },
        theme: {
          color: '#D97706',
        },
        handler: async (response: any) => {
          modalCompleted = true;
          try {
            const verifyRes = await fetch('/api/shop/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                orderDetails: order,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              setConfirmedOrder(verifyData.confirmedOrder);
            } else {
              setErrorMsg(isMr ? 'सर्व्हरवर पेमेंट पडताळणी अयशस्वी झाली.' : 'Payment verification failed on server.');
            }
          } catch (vErr: any) {
            setErrorMsg(vErr.message || (isMr ? 'पडताळणी अयशस्वी' : 'Payment verification failed'));
          } finally {
            setLoading(false);
          }
        },
        onFailure: (failedResp: any) => {
          setErrorMsg(failedResp?.error?.description || (isMr ? 'पेमेंट अयशस्वी झाले.' : 'Payment failed.'));
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      });
    } catch (err: any) {
      console.error('Order error:', err);
      setErrorMsg(err.message || (isMr ? 'ऑर्डर प्रक्रियेमध्ये त्रुटी आली.' : 'An error occurred during order submission.'));
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedOrder) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#EAE1D2] p-5 sm:p-8 md:p-12 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
              {isMr ? 'ऑर्डर यशस्वी झाली!' : 'Order Successfully Placed!'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810] mt-1">
              {isMr ? 'धन्यवाद! तुमची ऑर्डर नोंदवली गेली आहे' : 'Thank You! Your Sacred Order is Confirmed'}
            </h1>
            <p className="text-xs text-[#786C60] mt-2">
              {isMr ? 'ऑर्डर संदर्भ क्रमांक:' : 'Order ID:'} <span className="font-mono font-bold text-[#D97706]">{confirmedOrder.orderId}</span>
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE1D2] text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-[#EAE1D2] pb-2 font-bold text-[#2D1810]">
              <span>{isMr ? 'पाठवणीचा पत्ता:' : 'Shipping Address:'}</span>
              <span>₹{confirmedOrder.total}</span>
            </div>
            <p className="text-[#5C4535]">
              <strong>{confirmedOrder.shippingAddress?.fullName}</strong><br />
              {confirmedOrder.shippingAddress?.addressLine1}, {confirmedOrder.shippingAddress?.city}, {confirmedOrder.shippingAddress?.state} - {confirmedOrder.shippingAddress?.pincode}
            </p>
            <div className="flex items-center space-x-1.5 pt-2 text-[#92400E]">
              <Truck className="w-4 h-4 text-[#D97706]" />
              <span>{isMr ? 'प्राण प्रतिष्ठेनंतर ३ ते ५ दिवसांत सुरक्षित वितरण.' : 'Dispatch within 3-5 days after Vedic Pran Pratishtha consecration.'}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all shadow-md"
            >
              {isMr ? 'भांडारात परत जा' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* Header */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs text-[#786C60] mb-2">
            <Link href="/" className="hover:text-[#D97706]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <Link href="/shop" className="hover:text-[#D97706]">{isMr ? 'भांडार' : 'Shop'}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <Link href="/cart" className="hover:text-[#D97706]">{isMr ? 'खरेदी टोपली' : 'Cart'}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <span className="text-[#D97706] font-semibold">{isMr ? 'सुरक्षित चेकआउट' : 'Checkout'}</span>
          </nav>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
            {isMr ? 'सुरक्षित चेकआउट' : 'Secure Order Checkout'}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Address Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EAE1D2] p-4 sm:p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
              {isMr ? 'वितरण पत्ता तपशील' : 'Shipping & Delivery Address'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पूर्ण नाव' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'मोबाईल नंबर' : 'Phone Number'}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'ईमेल पत्ता' : 'Email Address'}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पत्ता (घर क्रमांक, इमारत, रस्ता)' : 'Delivery Address (Street, Building)'}</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'शहर' : 'City'}</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'राज्य' : 'State'}</label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पिनकोड' : 'Pincode'}</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-[#FFFBEB] p-4 rounded-2xl border border-[#FDE68A] text-xs text-[#785D46] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#D97706] flex-shrink-0" />
              <span>{isMr ? 'कार्ड किंवा खाजगी माहिती आमच्याकडे कधीही साठवली जात नाही.' : 'We never store your card numbers or CVVs. All transactions are securely handled by Razorpay.'}</span>
            </div>
          </div>

          {/* Order Summary & Payment Button */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE1D2] p-4 sm:p-6 md:p-8 shadow-sm space-y-5 static lg:sticky lg:top-24">
            <h3 className="font-serif font-bold text-base text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
              {isMr ? 'ऑर्डर तपशील' : 'Order Details'} ({totals.totalItems})
            </h3>

            {/* Items mini list */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between py-1 border-b border-[#F5EFE6]">
                  <div className="truncate max-w-[180px]">
                    <strong className="text-[#2D1810]">{isMr ? product.marathiName : product.name}</strong>
                    <span className="text-[11px] text-gray-500 block">Qty: {quantity}</span>
                  </div>
                  <span className="font-serif font-bold text-[#2D1810]">₹{product.price * quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-[#5C4535]">
                <span>{isMr ? 'उपएकूण:' : 'Subtotal:'}</span>
                <strong className="text-[#2D1810]">₹{totals.subtotal}</strong>
              </div>
              <div className="flex justify-between text-[#5C4535]">
                <span>{isMr ? 'पाठवणी:' : 'Shipping:'}</span>
                <strong className={totals.shipping === 0 ? 'text-emerald-700' : 'text-[#2D1810]'}>
                  {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
                </strong>
              </div>
              <div className="flex justify-between text-[#5C4535]">
                <span>{isMr ? 'वैदिक सेवा व विमा:' : 'Vedic Seva (3%):'}</span>
                <strong className="text-[#2D1810]">₹{totals.tax}</strong>
              </div>

              <div className="pt-3 border-t border-[#F3ECE1] flex justify-between items-baseline">
                <span className="font-serif font-bold text-sm text-[#2D1810]">{isMr ? 'एकूण रक्कम:' : 'Total:'}</span>
                <span className="font-serif text-2xl font-extrabold text-[#D97706]">
                  ₹{totals.total}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? (isMr ? 'प्रक्रिया सुरू आहे...' : 'Processing...') : (isMr ? `₹${totals.total} पेमेंट करा` : `Pay ₹${totals.total} via Razorpay`)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
