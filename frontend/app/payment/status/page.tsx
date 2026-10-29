'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function PaymentStatusContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const orderId = searchParams.get('orderId') || 'order_sample_123';
  const paymentId = searchParams.get('paymentId') || 'pay_sample_456';

  const isSuccess = status === 'success';

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE1D2] shadow-sm max-w-md w-full text-center space-y-6">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
                {language === 'mr' ? 'पेमेंट यशस्वी झाले!' : 'Payment Successful!'}
              </h1>
              <p className="text-xs text-[#786C60] leading-relaxed mt-2">
                {language === 'mr'
                  ? 'आपले पेमेंट स्ट्रॅपी ५ बॅकएंड सर्व्हरद्वारे सत्यापित केले गेले आहे. आपल्या सेवा सक्रिय झाल्या आहेत.'
                  : 'Your payment has been securely verified. Your premium astrology entitlements are now activated.'}
              </p>
            </div>

            <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#EAE1D2] text-xs text-left space-y-2 text-[#5C4033]">
              <div className="flex justify-between items-center">
                <span className="text-[#786C60]">{language === 'mr' ? 'ऑर्डर आयडी:' : 'Order ID:'}</span>
                <code className="text-[#B45309] font-mono font-semibold">{orderId}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#786C60]">{language === 'mr' ? 'पेमेंट आयडी:' : 'Payment ID:'}</span>
                <code className="text-[#B45309] font-mono font-semibold">{paymentId}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#786C60]">{language === 'mr' ? 'स्थिती:' : 'Status:'}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'mr' ? 'स्वीकृत' : 'Captured'}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Link
                href="/dashboard/reports"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
              >
                <span>{language === 'mr' ? 'माझे अहवाल पहा' : 'Access My Reports'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full block py-2.5 bg-[#FAF7F2] text-[#2D1810] text-xs font-semibold rounded-xl hover:bg-[#F3EFEA] border border-[#EAE1D2] transition-colors"
              >
                {language === 'mr' ? 'डॅशबोर्डवर जा' : 'Go to Dashboard'}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-rose-700">
                {language === 'mr' ? 'पेमेंट अयशस्वी किंवा प्रलंबित' : 'Payment Failed or Pending'}
              </h1>
              <p className="text-xs text-[#786C60] mt-2">
                {language === 'mr'
                  ? 'आम्ही या ऑर्डरसाठी पेमेंट स्वाक्षरी सत्यापित करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.'
                  : 'We could not verify the payment signature for this order. Please try again or contact customer care.'}
              </p>
            </div>

            <Link
              href="/pricing"
              className="w-full inline-flex items-center justify-center py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              {language === 'mr' ? 'दरपत्रकावर परत जा' : 'Return to Pricing'}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#8C6D1F]">Loading status...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
