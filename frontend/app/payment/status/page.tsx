'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const orderId = searchParams.get('orderId') || 'order_sample_123';
  const paymentId = searchParams.get('paymentId') || 'pay_sample_456';

  const isSuccess = status === 'success';

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-sm max-w-md w-full text-center space-y-6">
        {isSuccess ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#150D2A]">
              Payment Successful!
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your payment has been verified by the Strapi 5 backend server. Your service entitlements have been activated.
            </p>

            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#D4AF37]/20 text-xs text-left space-y-1.5 text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <code className="text-[#8C6D1F] font-mono">{orderId}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID:</span>
                <code className="text-[#8C6D1F] font-mono">{paymentId}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <strong className="text-emerald-700 uppercase">Captured</strong>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Link
                href="/dashboard/reports"
                className="w-full block py-3 bg-[#150D2A] text-[#FDFBF7] font-semibold text-xs rounded-xl shadow-md hover:bg-[#8C6D1F] transition-colors"
              >
                Access My Reports
              </Link>
              <Link
                href="/dashboard"
                className="w-full block py-2.5 bg-[#FAF6F0] text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto" />
            <h1 className="font-serif text-2xl font-bold text-rose-600">
              Payment Failed or Pending
            </h1>
            <p className="text-xs text-gray-600">
              We could not verify the payment signature for this order. Please try again or reach out to customer support.
            </p>

            <Link
              href="/pricing"
              className="w-full block py-3 bg-[#150D2A] text-[#FDFBF7] font-semibold text-xs rounded-xl"
            >
              Return to Pricing
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#D8C7A5]">Loading status...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
