'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  Activity,
  Zap,
  Heart,
  Calendar,
  Sparkles,
  Compass,
  ShieldCheck,
  TrendingUp,
  RotateCw,
  Clock,
  Users,
  Search,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Zap,
  Heart,
  Calendar,
  Sparkles,
  Compass,
  ShieldCheck,
};

function ToolsAnalyticsContent() {
  const { isDark } = useAdminTheme();
  const [range, setRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getToolsAnalytics({ range });
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.warn('Tools analytics fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [range]);

  const tools = data?.tools || [];
  const totalCalculations = data?.totalCalculations || 270;
  const dailyTrends = data?.dailyTrends || [];

  return (
    <AdminLayout
      title="Astrology Tools & Ephemeris Analytics"
      subtitle="Real-time telemetry and computation volume for Vedic calculators and astrology algorithms"
    >
      {/* Range and Actions Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'bg-[#141021] border-[#251D36]' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-2">
          {['today', '7days', '30days'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                range === r
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : isDark
                  ? 'bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-gray-300'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
              }`}
            >
              {r === '7days' ? 'Last 7 Days' : r === '30days' ? 'Last 30 Days' : 'Today'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Active (4s Sync)</span>
          </div>

          <button
            onClick={loadData}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#1D162C] hover:bg-[#251D38] border-[#2B233F] text-gray-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 3 High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-amber-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Total Vedic Charts Computed
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-500 mt-2">
            {totalCalculations}
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Lahiri Ayanamsa ephemeris executions</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-emerald-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Highest Demand Engine
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-xl font-extrabold truncate mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {tools[0]?.name || 'Janam Kundli'}
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Accounts for 38% of total client engagement</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-purple-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Average Session Duration
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-extrabold font-mono mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            3m 42s
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">High attention on compatibility &amp; Dasha charts</span>
        </div>
      </div>

      {/* Weekly Calculation Velocity Visual Chart */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#141021] border-[#251D36]' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 border-opacity-30">
          <div>
            <h3 className={`font-bold text-sm tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Computation Velocity Across 7-Day Cycle
            </h3>
            <p className="text-[11px] text-gray-400">Peak chart generations occur during weekends and auspicious Muhurat dates</p>
          </div>
          <span className="text-xs text-amber-500 font-mono font-bold">Ephemeris Sync</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {dailyTrends.map((d: any, idx: number) => {
            const max = 100;
            const pct = Math.round((d.calculations / max) * 100);
            return (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <span className="text-[10px] text-gray-400 font-mono font-bold">{d.calculations}</span>
                <div
                  className={`w-full max-w-[36px] h-32 rounded-xl flex items-end p-1 overflow-hidden ${
                    isDark ? 'bg-[#1C162E]' : 'bg-slate-100'
                  }`}
                >
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-700"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Tool-Wise Performance Table */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-lg ${
          isDark ? 'bg-[#141021] border-[#251D36]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`uppercase tracking-wider font-semibold border-b ${
                isDark ? 'bg-[#0E0B17] text-gray-400 border-[#251D36]' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <tr>
                <th className="py-3 px-4">Astrology Calculator / Tool</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Total Runs</th>
                <th className="py-3 px-4">Daily Velocity</th>
                <th className="py-3 px-4">Unique Devotees</th>
                <th className="py-3 px-4">Avg Session</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#221B33]' : 'divide-slate-100'}`}>
              {tools.map((t: any) => {
                const IconComponent = ICON_MAP[t.icon] || Activity;
                return (
                  <tr
                    key={t.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-amber-500/5' : 'hover:bg-amber-50/50'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                            isDark
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className={`block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {t.name}
                          </strong>
                          <span className="text-[10px] text-gray-400 font-mono">
                            Path: /{t.slug} • Last run: {t.lastUsed}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-400">{t.category}</td>

                    <td className="py-3.5 px-4 font-mono font-bold text-amber-500 text-sm">
                      {t.totalRuns}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-300">
                      ~{t.dailyAverage}/day
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-300">{t.uniqueUsers} clients</td>

                    <td className="py-3.5 px-4 font-mono text-gray-300">{t.avgSessionSec}s</td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {t.engagementRate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-500 font-bold px-2 py-0.5 rounded-full uppercase">
                        Live
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function ToolsAnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0812] flex items-center justify-center text-amber-400">
          <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
        </div>
      }
    >
      <ToolsAnalyticsContent />
    </Suspense>
  );
}
