'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { CreditCard, Sparkles, CheckCircle2, Clock, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MyOrdersPage() {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login?redirect=/dashboard/orders');
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await api.getMyOrders();
        setOrders(data || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE1D2] pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#92400E] uppercase tracking-wider font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{language === 'mr' ? 'वापरकर्ता डॅशबोर्ड' : 'User Dashboard'}</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-[#2D1810]">
              {language === 'mr' ? 'माझ्या ऑर्डर्स आणि पेमेंट्स' : 'My Orders & Payments'}
            </h1>
            <p className="text-xs text-[#786C60] mt-1">
              {language === 'mr'
                ? 'व्यवहार इतिहास तपासा, पावती पहा आणि सशुल्क अहवाल व भेटींमध्ये प्रवेश करा.'
                : 'Track transactions, verify Razorpay receipts, and access paid reports and appointments.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE1D2] text-[#2D1810] text-xs font-semibold hover:border-[#D97706] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'मागे जा' : 'Back'}</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all"
            >
              <span>{language === 'mr' ? 'प्रीमियम सेवा पहा' : 'View Services'}</span>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-[#D97706] flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">
              {language === 'mr' ? 'व्यवहार लोड होत आहेत...' : 'Loading your transactions...'}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-white border border-[#EAE1D2] rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <CreditCard className="w-12 h-12 text-[#D97706]/40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#2D1810]">
              {language === 'mr' ? 'अद्याप कोणतीही ऑर्डर नाही' : 'No Orders Placed Yet'}
            </h3>
            <p className="text-xs text-[#786C60] max-w-md mx-auto leading-relaxed">
              {language === 'mr'
                ? 'आपण अद्याप कोणताही प्रीमियम वैदिक ज्योतिष अहवाल किंवा सल्लामसलत मागवलेली नाही. अचूक मार्गदर्शनासाठी आमच्या सेवा तपासा.'
                : 'You haven’t ordered any premium Vedic astrology reports or consultations yet. Explore our verified catalog to unlock comprehensive life guidance.'}
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all"
            >
              <span>{language === 'mr' ? 'प्रीमियम सेवा पहा' : 'Explore Premium Services'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Orders Table */}
        {orders.length > 0 && (
          <div className="bg-white border border-[#EAE1D2] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFDF9] text-[#786C60] uppercase tracking-wider font-semibold border-b border-[#EAE1D2]">
                  <tr>
                    <th className="py-3 px-4">{language === 'mr' ? 'ऑर्डर आयडी' : 'Order ID'}</th>
                    <th className="py-3 px-4">{language === 'mr' ? 'सेवा' : 'Service'}</th>
                    <th className="py-3 px-4">{language === 'mr' ? 'रक्कम' : 'Amount'}</th>
                    <th className="py-3 px-4">{language === 'mr' ? 'पेमेंट आयडी' : 'Payment ID'}</th>
                    <th className="py-3 px-4">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                    <th className="py-3 px-4">{language === 'mr' ? 'तारीख' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE1D2] text-[#2D1810]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2D1810] font-semibold">
                        {o.orderId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#2D1810]">
                        {o.serviceType || 'Astrology Report'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#B45309]">
                        ₹{o.amount} {o.currency}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#786C60]">
                        {o.paymentId || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.status === 'captured'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : o.status === 'created'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {o.status === 'captured' && <CheckCircle2 className="w-3 h-3" />}
                          {o.status === 'created' && <Clock className="w-3 h-3" />}
                          {o.status === 'failed' && <XCircle className="w-3 h-3" />}
                          <span>{o.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[#786C60]">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
