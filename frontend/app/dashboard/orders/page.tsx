'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { CreditCard, Sparkles, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

export default function MyOrdersPage() {
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
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#D4AF37]/20 pb-6">
          <div className="inline-flex items-center space-x-1.5 text-xs text-[#D4AF37] uppercase tracking-wider font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>User Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl font-bold bg-gradient-to-r from-[#F7DF94] to-[#D4AF37] bg-clip-text text-transparent">
            My Orders & Payments
          </h1>
          <p className="text-xs text-[#D8C7A5]/80 mt-1">
            Track transactions, verify Razorpay receipts, and access paid reports and appointments.
          </p>
        </div>

        {loading && (
          <div className="py-12 text-center text-[#D4AF37] flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading your transactions...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-xs text-red-200">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-[#191233]/60 border border-[#D4AF37]/20 rounded-2xl p-12 text-center space-y-4">
            <CreditCard className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#FDFBF7]">
              No Orders Placed Yet
            </h3>
            <p className="text-xs text-[#D8C7A5]/70 max-w-md mx-auto">
              You haven’t ordered any premium Vedic astrology reports or consultations yet. Explore our verified catalog to unlock comprehensive life guidance.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#0F0B1E] text-xs font-bold hover:shadow-gold transition-all"
            >
              <span>Explore Premium Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Orders Table */}
        {orders.length > 0 && (
          <div className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-cosmic">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#150D2A] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-[#D4AF37]/20">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10 text-[#D8C7A5]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#25184B]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#FDFBF7]">
                        {o.orderId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#F7DF94]">
                        {o.serviceType || 'Astrology Report'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#FDFBF7]">
                        ₹{o.amount} {o.currency}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#D8C7A5]/70">
                        {o.paymentId || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.status === 'captured'
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                              : o.status === 'created'
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {o.status === 'captured' && <CheckCircle2 className="w-3 h-3" />}
                          {o.status === 'created' && <Clock className="w-3 h-3" />}
                          {o.status === 'failed' && <XCircle className="w-3 h-3" />}
                          <span>{o.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[#D8C7A5]/60">
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
