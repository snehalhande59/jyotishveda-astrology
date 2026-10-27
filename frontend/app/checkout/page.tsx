'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';
import { CreditCard, ShieldCheck } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get('title') || 'Vedic Astrology Premium Service';
  const amount = parseFloat(searchParams.get('amount') || '999');
  const serviceType = searchParams.get('type') || 'report';
  const referenceId = searchParams.get('id') || 'general';

  const [showModal, setShowModal] = useState(false);

  const handleSuccess = (paymentRecord: any) => {
    setTimeout(() => {
      router.push(`/payment/status?status=success&orderId=${paymentRecord.orderId}&paymentId=${paymentRecord.paymentId}`);
    }, 1200);
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#D8C7A5] mt-1">
          Review your order details and complete payment via Razorpay.
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 mt-12 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C6D1F]">Order Summary</span>
              <h3 className="font-serif text-xl font-bold text-[#150D2A] mt-1">{title}</h3>
            </div>
            <div className="text-right">
              <span className="font-serif text-2xl font-bold text-[#150D2A]">₹{amount}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Service Type:</span>
              <strong className="text-gray-900 capitalize">{serviceType}</strong>
            </div>
            <div className="flex justify-between">
              <span>Tax / GST:</span>
              <strong className="text-gray-900">Included (18% GST)</strong>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100 text-sm">
              <strong className="text-gray-900">Total Payable:</strong>
              <strong className="text-[#8C6D1F] font-serif text-lg">₹{amount}</strong>
            </div>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/25 text-xs text-gray-600 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#8C6D1F] flex-shrink-0 mt-0.5" />
            <p>
              Payments are verified directly on our Strapi backend server via cryptographic signatures. Test credentials are ready.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all"
          >
            Pay with Razorpay (₹{amount})
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        serviceTitle={title}
        amount={amount}
        serviceType={serviceType}
        referenceId={referenceId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#D8C7A5]">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
