'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Activity,
  Search,
  Users,
  Sparkles,
  Calendar,
  Filter,
  Download,
  RotateCw,
  Clock,
  UserCheck,
  UserX,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

const RANGE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7days', label: 'Last 7 Days' },
  { id: '30days', label: 'Last 30 Days' },
  { id: 'custom', label: 'Custom Range' },
];

function UserActivityContent() {
  const searchParams = useSearchParams();
  const [range, setRange] = useState('7days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  // Activity events stream list
  const [activities, setActivities] = useState<any[]>([]);
  const [streamLoading, setStreamLoading] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');

  useEffect(() => {
    const q = searchParams?.get('search');
    if (q) setKeywordSearch(q);
    const evt = searchParams?.get('eventType');
    if (evt) setEventTypeFilter(evt);
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    setStreamLoading(true);
    try {
      const [resAnalytics, resStream] = await Promise.all([
        adminApi.getAnalytics({ range, startDate: range === 'custom' ? startDate : undefined, endDate: range === 'custom' ? endDate : undefined }),
        adminApi.getUserActivities({ page: 1, pageSize: 50, eventType: eventTypeFilter || undefined }),
      ]);

      if (resAnalytics && resAnalytics.data) {
        setAnalytics(resAnalytics.data);
      }
      if (resStream && resStream.data) {
        setActivities(resStream.data);
      }
    } catch (err: any) {
      console.warn('Analytics loading fallback:', err);
    } finally {
      setLoading(false);
      setStreamLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, [range, eventTypeFilter]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      loadData();
    }
  };

  const a = analytics || {
    totalEvents: 0,
    totalSearches: 0,
    guestCount: 0,
    registeredCount: 0,
    topKeywords: [],
    mostUsedFreeTools: [],
    mostViewedAstrologers: [],
    dailyTimeline: [],
    recentEvents: [],
  };

  const totalUsersActive = (a.guestCount || 0) + (a.registeredCount || 0);
  const registeredPct = totalUsersActive > 0 ? Math.round((a.registeredCount / totalUsersActive) * 100) : 0;
  const guestPct = 100 - registeredPct;

  return (
    <AdminLayout
      title="User Activity &amp; Live Tracking Intelligence"
      subtitle="Examine real user interactions, search keywords, free tool sessions, and astrologer profile views"
    >
      {/* Time Range Selector & Controls */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRange(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                range === opt.id
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-[#A69CBE] hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom Range Inputs */}
        {range === 'custom' && (
          <form onSubmit={handleApplyCustom} className="flex flex-wrap items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold"
            >
              Filter
            </button>
          </form>
        )}

        {/* Refresh & CSV Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-[#9F96B2] hover:text-white transition-colors"
            title="Refresh Intelligence"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <a
            href={adminApi.getExportUrl('user-activity')}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#201830] hover:bg-[#2A2040] border border-[#2E2445] text-amber-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Events (CSV)</span>
          </a>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs font-semibold text-[#8E84A6] uppercase tracking-wider block">
            Total Logged Events
          </span>
          <div className="text-3xl font-extrabold text-white font-mono">{a.totalEvents}</div>
          <span className="text-[11px] text-[#8E84A6] block">In selected time range</span>
        </div>

        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs font-semibold text-[#8E84A6] uppercase tracking-wider block">
            Search Queries
          </span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{a.totalSearches}</div>
          <span className="text-[11px] text-[#8E84A6] block">Platform search terms</span>
        </div>

        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs font-semibold text-[#8E84A6] uppercase tracking-wider block">
            Registered Visitors
          </span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {a.registeredCount} <span className="text-xs text-[#8E84A6]">({registeredPct}%)</span>
          </div>
          <span className="text-[11px] text-[#8E84A6] block">Logged-in client accounts</span>
        </div>

        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-2">
          <span className="text-xs font-semibold text-[#8E84A6] uppercase tracking-wider block">
            Guest Visitors
          </span>
          <div className="text-3xl font-extrabold text-blue-400 font-mono">
            {a.guestCount} <span className="text-xs text-[#8E84A6]">({guestPct}%)</span>
          </div>
          <span className="text-[11px] text-[#8E84A6] block">Unauthenticated sessions</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Used Free Tools Leaderboard */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="border-b border-[#251D36] pb-3">
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Most Used Free Tools</span>
            </h3>
            <p className="text-[11px] text-[#8E84A6]">Ranking of free Vedic utilities</p>
          </div>

          <div className="space-y-3">
            {(!a.mostUsedFreeTools || a.mostUsedFreeTools.length === 0) ? (
              <p className="text-xs text-gray-500 py-6 text-center">No tool visits logged yet.</p>
            ) : (
              a.mostUsedFreeTools.map((tool: any, idx: number) => {
                const max = a.mostUsedFreeTools[0]?.count || 1;
                const pct = Math.round((tool.count / max) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[200px]">{tool.name}</span>
                      <span className="text-emerald-400 font-mono font-bold">{tool.count}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#201830]">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Most Viewed Astrologers */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="border-b border-[#251D36] pb-3">
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Most Viewed Astrologers</span>
            </h3>
            <p className="text-[11px] text-[#8E84A6]">Profiles explored by visitors</p>
          </div>

          <div className="space-y-3">
            {(!a.mostViewedAstrologers || a.mostViewedAstrologers.length === 0) ? (
              <p className="text-xs text-gray-500 py-6 text-center">No astrologer views logged yet.</p>
            ) : (
              a.mostViewedAstrologers.map((astro: any, idx: number) => {
                const max = a.mostViewedAstrologers[0]?.count || 1;
                const pct = Math.round((astro.count / max) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[200px]">{astro.name}</span>
                      <span className="text-amber-400 font-mono font-bold">{astro.count} views</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#201830]">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Keywords */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="border-b border-[#251D36] pb-3">
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center space-x-2">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Search Keywords Entered</span>
            </h3>
            <p className="text-[11px] text-[#8E84A6]">Top queries in AstroVeda search modal</p>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(!a.topKeywords || a.topKeywords.length === 0) ? (
              <p className="text-xs text-gray-500 py-6 text-center">No search keywords recorded yet.</p>
            ) : (
              a.topKeywords.map((kw: any, idx: number) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-[#0F0C18] border border-[#241C34] flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-gray-200 capitalize">&ldquo;{kw.name}&rdquo;</span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono font-bold text-[10px]">
                    {kw.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Live Activity Stream Table */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl shadow-xl overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#251D36]">
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Live Database Event Stream</span>
            </h3>
            <p className="text-[11px] text-[#8E84A6]">Chronological log of actual visitor interactions</p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              placeholder="Search activity..."
              className="px-3 py-1.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#0C0A14] border border-[#2B233F] rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="">All Event Types</option>
              <option value="search">Searches Only</option>
              <option value="tool_view">Tool Views</option>
              <option value="service_view">Service Views</option>
              <option value="astrologer_view">Astrologer Views</option>
              <option value="booking_activity">Booking Events</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F0C1A] text-[#8E84A6] uppercase tracking-wider font-semibold border-b border-[#261E38]">
              <tr>
                <th className="py-3 px-3">Date &amp; Time</th>
                <th className="py-3 px-3">Event Type</th>
                <th className="py-3 px-3">Service / Keyword</th>
                <th className="py-3 px-3">User Profile</th>
                <th className="py-3 px-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211A31] text-[#D6CEE5]">
              {streamLoading && activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#8E84A6]">
                    Loading recent activity stream...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#8E84A6]">
                    No activity logs recorded yet. Tracked events will appear here in real time as users interact with the platform.
                  </td>
                </tr>
              ) : (
                activities
                  .filter((act) =>
                    !keywordSearch ||
                    (act.serviceName || act.keyword || act.targetSlug || act.userEmail || '')
                      .toLowerCase()
                      .includes(keywordSearch.toLowerCase())
                  )
                  .map((act) => (
                  <tr key={act.id} className="hover:bg-[#1A1428] transition-colors">
                    <td className="py-3 px-3 text-[#8E84A6] font-mono whitespace-nowrap">
                      {act.createdAt ? new Date(act.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          act.eventType === 'search'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : act.eventType === 'tool_view'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : act.eventType === 'astrologer_view'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}
                      >
                        {act.eventType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-white">
                        {act.keyword ? `"${act.keyword}"` : act.serviceName || act.targetSlug || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {act.isGuest ? (
                        <span className="inline-flex items-center space-x-1 text-gray-400 text-[11px]">
                          <UserX className="w-3.5 h-3.5 text-gray-500" />
                          <span>Guest Visitor</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-emerald-400 font-mono text-[11px]">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{act.userEmail}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#8E84A6] uppercase text-[10px]">
                      {act.serviceCategory || 'General'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function UserActivityAnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0812] flex items-center justify-center text-amber-400">
          <div className="flex items-center space-x-3">
            <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
            <span className="font-serif">Loading Live Activity Stream...</span>
          </div>
        </div>
      }
    >
      <UserActivityContent />
    </Suspense>
  );
}
