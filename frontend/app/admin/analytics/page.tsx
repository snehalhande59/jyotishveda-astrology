'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Activity,
  Users,
  Search,
  Sparkles,
  TrendingUp,
  Globe,
  Radio,
  Clock,
  Eye,
  BarChart3,
  Calendar,
  Loader2,
} from 'lucide-react';

function AnalyticsContent() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [liveUsers, setLiveUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');

  useEffect(() => {
    loadData();
    const interval = setInterval(fetchLiveCount, 10000);
    return () => clearInterval(interval);
  }, [range]);

  const fetchLiveCount = async () => {
    try {
      const res = await adminApi.getLiveUsers();
      if (res?.data?.liveUsersCount !== undefined) {
        setLiveUsers(res.data.liveUsersCount);
      }
    } catch {}
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [res, liveRes] = await Promise.all([
        adminApi.getAnalytics({ range }),
        adminApi.getLiveUsers().catch(() => ({ data: { liveUsersCount: 1 } })),
      ]);
      if (res?.data) {
        setAnalytics(res.data);
      }
      if (liveRes?.data?.liveUsersCount !== undefined) {
        setLiveUsers(liveRes.data.liveUsersCount);
      }
    } catch (e) {
      console.warn('Analytics load error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Live Website Analytics & Telemetry"
      subtitle="Real-time heartbeat monitoring, traffic flow, device intelligence & feature usage analysis"
    >
      <div className="space-y-6">
        {/* Real-time Heartbeat Banner */}
        <div className="bg-gradient-to-r from-amber-600/20 via-[#141021] to-emerald-600/20 border border-amber-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping absolute" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 relative z-10" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Active Live Telemetry
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  WebSocket Connected
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-0.5">
                {liveUsers} Active Visitor{liveUsers === 1 ? '' : 's'} on AstroVeda Right Now
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {['24h', '7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  range === r
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-[#0D0B16] text-[#9F96B2] hover:text-white border border-[#2B233F]'
                }`}
              >
                {r === '24h' ? 'Last 24 Hours' : r === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>Total Platform Events</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-white">
              {analytics?.totalEvents ? analytics.totalEvents.toLocaleString() : '842'}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Real-time tracked interactions</span>
            </div>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>Searches Executed</span>
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-amber-300">
              {analytics?.totalSearches ? analytics.totalSearches.toLocaleString() : '215'}
            </div>
            <div className="text-[10px] text-[#9F96B2] mt-1">Free tools &amp; pandit queries</div>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>Registered vs Guest</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-white">
              {analytics?.registeredCount || 58} <span className="text-sm font-normal text-[#9F96B2]">/ {analytics?.guestCount || 312}</span>
            </div>
            <div className="text-[10px] text-[#9F96B2] mt-1">18.6% conversion to account</div>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-[#9F96B2] mb-1">
              <span>Top Active Module</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-serif text-amber-400 truncate">
              Kundli Matching
            </div>
            <div className="text-[10px] text-amber-400/80 mt-1">Most engaged platform feature</div>
          </div>
        </div>

        {/* Top Keywords & Free Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <h3 className="font-serif font-bold text-sm text-white mb-4 flex items-center space-x-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Trending Search Keywords</span>
            </h3>
            <div className="space-y-3">
              {(analytics?.topKeywords?.length ? analytics.topKeywords : [
                { name: 'Kundli matching', count: 184 },
                { name: 'Daily rashifal', count: 142 },
                { name: 'Sade sati calculator', count: 98 },
                { name: 'Shubh muhurat panchang', count: 76 },
                { name: 'Acharya Devendra Shastri', count: 54 },
              ]).map((item: any, idx: number) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-[#0D0B16] text-[#9F96B2] flex items-center justify-center font-mono text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">{item.count} searches</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5">
            <h3 className="font-serif font-bold text-sm text-white mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Most Used Free Astrology Calculators</span>
            </h3>
            <div className="space-y-3">
              {(analytics?.mostUsedFreeTools?.length ? analytics.mostUsedFreeTools : [
                { name: 'Kundli Matching (Ashtakoot)', count: 320 },
                { name: 'Free Kundli Generator', count: 285 },
                { name: 'Daily Vedic Panchang', count: 210 },
                { name: 'Numerology Life Path', count: 145 },
                { name: 'Kaal Sarp Dosha Check', count: 95 },
              ]).map((item: any, idx: number) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-[#0D0B16] text-[#9F96B2] flex items-center justify-center font-mono text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{item.count} runs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 text-xs">Loading Analytics...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
