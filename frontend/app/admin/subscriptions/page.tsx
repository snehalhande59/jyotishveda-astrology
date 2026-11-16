'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/admin/Modal';
import { adminApi } from '@/lib/admin-api';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  Tag,
  PlusCircle,
  RotateCw,
  CheckCircle,
  XCircle,
  Calendar,
  IndianRupee,
  Users,
  Percent,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

function SubscriptionsContent() {
  const { isDark } = useAdminTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // New Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 500,
    usageLimit: 200,
    applicableTo: 'All Consultations & Reports',
    validUntil: '2026-12-31',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSubscriptions();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.warn('Subscriptions load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createCoupon(couponForm);
      setIsCouponModalOpen(false);
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 500,
        usageLimit: 200,
        applicableTo: 'All Consultations & Reports',
        validUntil: '2026-12-31',
      });
      loadData();
    } catch (err: any) {
      alert('Failed to create coupon: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const plans = data?.plans || [];
  const activeSubs = data?.activeSubscriptions || [];
  const coupons = data?.coupons || [];
  const metrics = data?.metrics || {
    totalActiveSubscribers: 3,
    monthlyRecurringRevenue: 5496,
    activeCouponsCount: 3,
    totalCouponRedemptions: 435,
  };

  return (
    <AdminLayout
      title="Subscriptions & Coupon Discounts"
      subtitle="Manage membership plans, recurring subscriptions, and platform promotional vouchers"
    >
      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-amber-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Active Subscribers
          </span>
          <div className="text-3xl font-extrabold font-mono text-amber-500 mt-2">
            {metrics.totalActiveSubscribers}
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Verified recurring members</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-emerald-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Monthly Recurring Revenue
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-500 mt-2">
            ₹{metrics.monthlyRecurringRevenue?.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Estimated monthly subscription run-rate</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-blue-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Active Coupon Codes
          </span>
          <div className={`text-3xl font-extrabold font-mono mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {metrics.activeCouponsCount}
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Active promotional campaign codes</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-purple-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Coupon Redemptions
          </span>
          <div className={`text-3xl font-extrabold font-mono mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {metrics.totalCouponRedemptions}
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Total discounts claimed by devotees</span>
        </div>
      </div>

      {/* Subscription Plans Roster */}
      <div className="space-y-3">
        <h3 className={`font-bold text-sm tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Configured Subscription Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((p: any) => (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#141021] border-[#251D36]' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {p.name}
                  </h4>
                  <span className="text-xs text-amber-500 font-bold font-mono uppercase">
                    ₹{p.price} / {p.billingCycle}
                  </span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2.5 py-1 rounded-full font-bold">
                  {p.activeMembers} Members
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-opacity-30">
                {p.features?.map((f: string, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-gray-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Coupons Management */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#141021] border-[#251D36]' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-opacity-30">
          <div>
            <h3 className={`font-bold text-sm tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Promotional Coupons &amp; Discount Vouchers
            </h3>
            <p className="text-[11px] text-gray-400">Manage campaign codes redeemable at consultation and store checkout</p>
          </div>

          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Coupon Code</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`uppercase tracking-wider font-semibold border-b ${
                isDark ? 'bg-[#0E0B17] text-gray-400 border-[#251D36]' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Applicable Service</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#221B33]' : 'divide-slate-100'}`}>
              {coupons.map((c: any) => (
                <tr
                  key={c.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-amber-500/5' : 'hover:bg-amber-50/50'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-500 text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-500">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">₹{c.minOrderAmount}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-white">{c.usedCount}</span>
                    <span className="text-gray-400"> / {c.usageLimit} max</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">{c.applicableTo}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {new Date(c.validUntil).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        title="Create New Promotional Coupon"
        subtitle="Configure discount rate, minimum order, and validity"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Coupon Code (e.g. DIWALI25)</label>
            <input
              type="text"
              required
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
              placeholder="e.g. VEDA50"
              className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-amber-400 uppercase font-mono ${
                isDark ? 'bg-[#0E0B17] border-[#251D36] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Discount Type</label>
              <select
                value={couponForm.discountType}
                onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-amber-400 ${
                  isDark ? 'bg-[#0E0B17] border-[#251D36] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Discount Value</label>
              <input
                type="number"
                required
                min={1}
                value={couponForm.discountValue}
                onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-amber-400 font-mono ${
                  isDark ? 'bg-[#0E0B17] border-[#251D36] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={couponForm.minOrderAmount}
                onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-amber-400 font-mono ${
                  isDark ? 'bg-[#0E0B17] border-[#251D36] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Usage Limit Count</label>
              <input
                type="number"
                required
                min={1}
                value={couponForm.usageLimit}
                onChange={(e) => setCouponForm({ ...couponForm, usageLimit: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-amber-400 font-mono ${
                  isDark ? 'bg-[#0E0B17] border-[#251D36] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-opacity-30">
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-gray-500/10 text-gray-400 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold"
            >
              {creating ? 'Saving...' : 'Save & Activate Coupon'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0812] flex items-center justify-center text-amber-400">
          <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
        </div>
      }
    >
      <SubscriptionsContent />
    </Suspense>
  );
}
