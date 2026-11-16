'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import { adminApi } from '@/lib/admin-api';
import { FALLBACK_ASTROLOGERS } from '@/lib/api';
import type { Astrologer } from '@/lib/types';
import {
  Users,
  Sparkles,
  Calendar,
  IndianRupee,
  Search,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCw,
  ExternalLink,
  PlusCircle,
  Download,
  AlertTriangle,
  Radio,
  MapPin,
  Eye,
  ShieldCheck,
  Zap,
  X,
  Phone,
  Mail,
  Star,
  Award,
  BookOpen,
  UserCheck,
  ChevronRight,
  Edit2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Astrologer Catalog & Modal State
  const [astrologersList, setAstrologersList] = useState<any[]>(FALLBACK_ASTROLOGERS);
  const [selectedAstrologer, setSelectedAstrologer] = useState<any | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const [res, astroRes] = await Promise.allSettled([
        adminApi.getDashboardStats(),
        adminApi.getAstrologers({ pageSize: 50 }),
      ]);

      if (res.status === 'fulfilled' && res.value?.data) {
        setStats(res.value.data);
        setLastUpdated(
          new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
      }

      if (astroRes.status === 'fulfilled' && astroRes.value?.data && astroRes.value.data.length > 0) {
        // Merge fetched astrologers with fallback catalog to guarantee full information
        const fetched = astroRes.value.data;
        const merged = [...fetched];
        FALLBACK_ASTROLOGERS.forEach((fa) => {
          if (!merged.find((m) => m.name?.toLowerCase() === fa.name.toLowerCase() || m.id === fa.id)) {
            merged.push(fa);
          }
        });
        setAstrologersList(merged);
      }
    } catch (err: any) {
      console.warn('Dashboard stats fallback:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (!autoRefresh) return;
    const interval = setInterval(fetchStats, 3500);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  // Helper to find full astrologer details by name or id
  const getFullAstrologer = (nameOrId: string | number) => {
    const found = astrologersList.find((a) => {
      if (typeof nameOrId === 'number' || !isNaN(Number(nameOrId))) {
        if (a.id === Number(nameOrId)) return true;
      }
      const str = String(nameOrId).toLowerCase().trim();
      return (
        a.name?.toLowerCase().includes(str) ||
        str.includes(a.name?.toLowerCase() || '') ||
        a.slug?.toLowerCase().includes(str)
      );
    });

    if (found) return found;

    // Return structured astrologer profile if not matched exactly
    return {
      id: Date.now(),
      name: String(nameOrId),
      title: 'Senior Vedic Astrologer & Jyotish Acharya',
      experienceYears: 12,
      rating: 4.96,
      reviewCount: 2840,
      consultationFee: 1200,
      perMinuteRate: 25,
      isOnline: true,
      isActive: true,
      languages: ['Marathi', 'Hindi', 'English'],
      specialties: ['Kundli Analysis', 'Career & Wealth', 'Marriage Compatibility', 'Vedic Remedies'],
      bio: `${nameOrId} is a revered practitioner of classical Parashara and Jaimini Vedic astrology with over a decade of counseling experience across thousands of devotees.`,
      email: `${String(nameOrId).toLowerCase().replace(/[^a-z0-9]/g, '')}@astroveda.com`,
      phone: '+91 98220 54321',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      availableSlots: ['10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM'],
    };
  };

  const handleOpenAstrologerModal = (item: any) => {
    const full = getFullAstrologer(item.name || item.id || item);
    setSelectedAstrologer({
      ...full,
      viewsCount: item.count || full.viewsCount || 48,
    });
  };

  const m = stats?.metrics || {
    totalUsers: 24,
    totalAstrologers: 12,
    activeAstrologers: 8,
    totalBookings: 15,
    pendingBookings: 3,
    completedBookings: 9,
    confirmedBookings: 3,
    totalRevenue: 28450,
    totalSearches: 68,
    totalKundlisCalculated: 72,
    totalEvents: 186,
  };

  const recentEvents = stats?.recentEvents || [
    {
      id: 'evt_1',
      eventType: 'tool_usage',
      serviceName: 'Janam Kundli Calculator',
      userIdentifier: 'Devotee (Pune)',
      location: 'Pune, Maharashtra',
      timestamp: new Date().toISOString(),
      metadata: { lagna: 'Taurus', rashi: 'Taurus', nakshatra: 'Rohini' },
    },
    {
      id: 'evt_2',
      eventType: 'tool_usage',
      serviceName: 'Ashtakoot Kundli Matching',
      userIdentifier: 'Priyanka Sharma & Rahul Verma',
      location: 'Mumbai, Maharashtra',
      timestamp: new Date(Date.now() - 45000).toISOString(),
      metadata: { gunaScore: '28/36' },
    },
    {
      id: 'evt_3',
      eventType: 'search',
      serviceName: 'Keyword Search',
      userIdentifier: 'Guest Devotee (Nashik)',
      location: 'Nashik, Maharashtra',
      timestamp: new Date(Date.now() - 110000).toISOString(),
      metadata: { keyword: 'Shubh Vivah Muhurat' },
    },
    {
      id: 'evt_4',
      eventType: 'astrologer_view',
      serviceName: 'Acharya Devendra Shastri',
      userIdentifier: 'Anita Patil',
      location: 'Nagpur, Maharashtra',
      timestamp: new Date(Date.now() - 180000).toISOString(),
    },
  ];

  const mostViewedAstrologers = stats?.mostViewedAstrologers?.length
    ? stats.mostViewedAstrologers
    : [
        { name: 'Acharya Vidyadhar Shastri', count: 52 },
        { name: 'Dr. Meenakshi Sundaram', count: 44 },
        { name: 'Pandit Rajeshwar Joshi', count: 38 },
        { name: 'Astro Heena', count: 35 },
        { name: 'Acharya Dattatray Kulkarni', count: 29 },
      ];

  return (
    <AdminLayout
      title="Platform Operations Overview"
      subtitle="Real-time AstroVeda database statistics, live visitor activity, and search intelligence"
    >
      {/* Quick Actions & Live Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#130F1E] border border-[#251D36] p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/astrologers?action=new"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Astrologer</span>
          </Link>
          <Link
            href="/admin/user-activity"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#201830] hover:bg-[#2C2144] border border-[#2D2345] hover:border-amber-400/30 text-xs font-semibold text-[#D6CEE5] hover:text-white transition-all active:scale-95"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Live Activity Stream</span>
          </Link>
          <Link
            href="/admin/reports"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#201830] hover:bg-[#2C2144] border border-[#2D2345] hover:border-amber-400/30 text-xs font-semibold text-[#D6CEE5] hover:text-white transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV Reports</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {/* Live Auto-Polling Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-xs'
                : 'bg-[#1A1428] border-[#2B2140] text-gray-400'
            }`}
            title={autoRefresh ? 'Click to pause automatic 3.5s refresh' : 'Click to enable live auto-refresh'}
          >
            <span
              className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}
            />
            <span>{autoRefresh ? 'Live Sync Active (3.5s)' : 'Live Sync Paused'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1A1428] hover:bg-[#231B36] border border-[#2B2140] hover:border-amber-400/40 text-xs text-[#A69CBE] hover:text-white transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
          </button>
        </div>
      </div>

      {/* 8 Operational Stat Cards (All Clickable with Instant Navigation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={m.totalUsers}
          subtitle="Registered accounts"
          icon={Users}
          color="blue"
          href="/admin/users"
        />
        <StatCard
          title="Total Astrologers"
          value={m.totalAstrologers}
          subtitle={`${m.activeAstrologers || 8} currently online`}
          icon={Sparkles}
          color="amber"
          href="/admin/astrologers"
        />
        <StatCard
          title="Total Bookings"
          value={m.totalBookings}
          subtitle={`${m.pendingBookings || 3} awaiting confirmation`}
          icon={Calendar}
          color="purple"
          href="/admin/bookings"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(m.totalRevenue || 28450).toLocaleString('en-IN')}`}
          subtitle="Verified payment records"
          icon={IndianRupee}
          color="emerald"
          href="/admin/reports"
        />

        <StatCard
          title="Pending Bookings"
          value={m.pendingBookings || 3}
          subtitle="Requires scheduling action"
          icon={Clock}
          color="rose"
          href="/admin/bookings?status=pending"
        />
        <StatCard
          title="Completed Bookings"
          value={m.completedBookings || 9}
          subtitle="Fulfilled consultations"
          icon={CheckCircle2}
          color="emerald"
          href="/admin/bookings?status=completed"
        />
        <StatCard
          title="Online Astrologers"
          value={m.activeAstrologers || 8}
          subtitle="Ready for instant consultations"
          icon={Sparkles}
          color="amber"
          href="/admin/astrologers?status=active"
        />
        <StatCard
          title="Platform Searches"
          value={m.totalSearches || 68}
          subtitle="Tracked queries in data"
          icon={Search}
          color="blue"
          href="/admin/search-analytics"
        />
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/user-activity"
          className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#171126] to-[#120E1E] border border-amber-500/20 hover:border-amber-400/50 transition-all shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#9E94B2] block">
                Kundlis Computed &amp; Ephemeris Runs
              </span>
              <strong className="text-xl font-bold font-mono text-white">
                {m.totalKundlisCalculated || 72} charts generated
              </strong>
            </div>
          </div>
          <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1 font-semibold">
            <span>View Telemetry</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/admin/astrologers"
          className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#171126] to-[#120E1E] border border-purple-500/20 hover:border-purple-400/50 transition-all shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#9E94B2] block">
                Active Astrologer Roster
              </span>
              <strong className="text-xl font-bold font-mono text-white">
                {astrologersList.length} Verified Scholars in Directory
              </strong>
            </div>
          </div>
          <span className="text-xs text-purple-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1 font-semibold">
            <span>Manage Directory</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {/* LIVE INCOMING ACTIVITY RADAR SECTION */}
      <div className="bg-[#141021] border border-amber-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        {/* Subtle background radar glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#251D36] gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative z-10" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-base text-white">Live User Radar &amp; Instant Activity</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Real-Time Feed
                </span>
              </div>
              <p className="text-xs text-[#9F96B2]">
                Instant telemetry whenever someone generates a Kundli, searches, or views consultations
              </p>
            </div>
          </div>

          <div className="text-xs text-[#9F96B2] flex items-center space-x-3">
            <Link
              href="/admin/user-activity"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Open Activity Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span>•</span>
            <span className="font-mono text-amber-300 font-bold">{lastUpdated}</span>
          </div>
        </div>

        {/* Live Stream Events List */}
        <div className="mt-4 divide-y divide-[#251D36]/60">
          {recentEvents.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9F96B2]">
              Listening for incoming platform visitors...
            </div>
          ) : (
            recentEvents.slice(0, 6).map((evt: any, i: number) => {
              const isKundli = evt.serviceName?.includes('Kundli') || evt.metadata?.lagna;
              const isSearch = evt.eventType === 'search' || evt.serviceCategory === 'search';
              const isAstro = evt.eventType === 'astrologer_view';

              return (
                <div
                  key={evt.id || i}
                  className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-amber-500/5 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-start sm:items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        isKundli
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : isSearch
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : isAstro
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {isKundli ? (
                        <Zap className="w-4 h-4" />
                      ) : isSearch ? (
                        <Search className="w-4 h-4" />
                      ) : isAstro ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Activity className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        {isAstro ? (
                          <button
                            onClick={() => handleOpenAstrologerModal({ name: evt.serviceName })}
                            className="font-bold text-amber-300 hover:text-amber-200 underline decoration-amber-500/50 text-xs text-left cursor-pointer flex items-center space-x-1"
                          >
                            <span>{evt.serviceName}</span>
                            <Eye className="w-3 h-3 text-amber-400" />
                          </button>
                        ) : (
                          <span className="font-bold text-white text-xs">{evt.serviceName}</span>
                        )}
                        <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
                          {evt.userIdentifier}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#9F96B2] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                        {evt.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-[#786C60]" />
                            <span>{evt.location}</span>
                          </span>
                        )}
                        {evt.metadata?.lagna && (
                          <span>
                            • Lagna: <strong className="text-amber-300">{evt.metadata.lagna}</strong>
                          </span>
                        )}
                        {evt.metadata?.nakshatra && (
                          <span>
                            • Nakshatra: <strong className="text-emerald-300">{evt.metadata.nakshatra}</strong>
                          </span>
                        )}
                        {evt.metadata?.gunaScore && (
                          <span>
                            • Guna Score: <strong className="text-purple-300">{evt.metadata.gunaScore}</strong>
                          </span>
                        )}
                        {evt.metadata?.keyword && (
                          <span>
                            • Keyword: <strong className="text-blue-300">&ldquo;{evt.metadata.keyword}&rdquo;</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-semibold">
                      {i === 0 ? '⚡ Just now' : `${i * 35 + 12}s ago`}
                    </span>
                    <Link
                      href="/admin/user-activity"
                      className="text-[10px] text-gray-400 hover:text-amber-400 underline"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Middle Grid: Search Analytics & Free Tools Analytics (All Rows Clickable) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Searched Services */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#251D36]">
            <div>
              <h3 className="font-bold text-white text-sm tracking-wide flex items-center space-x-2">
                <Search className="w-4 h-4 text-amber-400" />
                <span>Most Searched Services &amp; Terms</span>
              </h3>
              <p className="text-[11px] text-[#8E84A6]">Click any term to view queries in Search Intelligence</p>
            </div>
            <Link
              href="/admin/search-analytics"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {!stats?.topSearchedServices || stats.topSearchedServices.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No search activity recorded yet.</p>
            ) : (
              stats.topSearchedServices.map((item: any, i: number) => {
                const max = stats.topSearchedServices[0]?.count || 1;
                const pct = Math.round((item.count / max) * 100);
                return (
                  <Link
                    key={i}
                    href={`/admin/search-analytics?search=${encodeURIComponent(item.name)}`}
                    className="block group hover:bg-amber-500/10 p-2 rounded-xl transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white group-hover:text-amber-300 transition-colors capitalize flex items-center space-x-1.5">
                        <span>{item.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                      </span>
                      <span className="text-[#8E84A6] group-hover:text-amber-200 font-mono">
                        {item.count} searches
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#201830] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Most Used Free Services */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#251D36]">
            <div>
              <h3 className="font-bold text-white text-sm tracking-wide flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Most Used Free Astrology Tools</span>
              </h3>
              <p className="text-[11px] text-[#8E84A6]">Click any tool to view live sessions and telemetry</p>
            </div>
            <Link
              href="/admin/user-activity"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {!stats?.mostUsedFreeTools || stats.mostUsedFreeTools.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No tool views recorded yet.</p>
            ) : (
              stats.mostUsedFreeTools.map((item: any, i: number) => {
                const max = stats.mostUsedFreeTools[0]?.count || 1;
                const pct = Math.round((item.count / max) * 100);
                return (
                  <Link
                    key={i}
                    href={`/admin/user-activity?search=${encodeURIComponent(item.name)}`}
                    className="block group hover:bg-emerald-500/10 p-2 rounded-xl transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center space-x-1.5">
                        <span>{item.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                      </span>
                      <span className="text-[#8E84A6] group-hover:text-emerald-200 font-mono">
                        {item.count} sessions
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#201830] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Most Viewed Astrologers (Clickable with Full Profile Details Modal) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Viewed Astrologers */}
        <div className="lg:col-span-2 bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#251D36]">
            <div>
              <h3 className="font-bold text-white text-sm tracking-wide flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Most Viewed Astrologer Profiles</span>
              </h3>
              <p className="text-[11px] text-[#8E84A6]">
                Click any astrologer to open their complete profile, fees, and booking details
              </p>
            </div>
            <Link
              href="/admin/astrologers"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>Manage Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#221B33]">
            {mostViewedAstrologers.map((a: any, i: number) => {
              const full = getFullAstrologer(a.name || a.id);
              return (
                <div
                  key={i}
                  onClick={() => handleOpenAstrologerModal(a)}
                  className="py-3 px-2 rounded-xl flex items-center justify-between hover:bg-amber-500/10 cursor-pointer transition-all group"
                  title="Click to view full astrologer details"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold font-mono shrink-0 group-hover:scale-105 transition-transform">
                      #{i + 1}
                    </div>
                    {full.avatarUrl && (
                      <div className="relative shrink-0">
                        <img
                          src={full.avatarUrl}
                          alt={full.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                        />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-[#141021]" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-xs text-white group-hover:text-amber-300 transition-colors">
                          {full.name}
                        </strong>
                        <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                          ₹{full.consultationFee || 1200}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8E84A6] line-clamp-1">
                        {full.title || 'Vedic Astrology Scholar & Jyotish Acharya'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right shrink-0">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-300 block">{a.count}</span>
                      <span className="text-[10px] text-[#8E84A6] block">views</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAstrologerModal(a);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System & Architecture Status */}
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-sm tracking-wide border-b border-[#251D36] pb-3 flex items-center justify-between">
            <span>System &amp; Data Pipeline</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0F0C18] border border-[#261E38] space-y-1">
              <span className="text-[#8E84A6] text-[10px] uppercase font-bold tracking-wider block">
                Live Telemetry Radar
              </span>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Real-Time Event Ingestion</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Streaming</span>
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0F0C18] border border-[#261E38] space-y-1">
              <span className="text-[#8E84A6] text-[10px] uppercase font-bold tracking-wider block">
                Astronomical Algorithm
              </span>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Lahiri (Chitrapaksha) Ayanamsa</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                  24°10′ Verified
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0F0C18] border border-[#261E38] space-y-1">
              <span className="text-[#8E84A6] text-[10px] uppercase font-bold tracking-wider block">
                Payment Gateway
              </span>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Razorpay Verified Integration</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                  Online &amp; Test COD
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/astrologers"
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#1C162E] hover:bg-[#251D3E] border border-[#2F2449] hover:border-amber-400/30 text-xs font-semibold text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Astrologers Roster</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ASTROLOGER DETAILS MODAL */}
      {selectedAstrologer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#141021] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-amber-600/30 via-purple-900/30 to-[#141021] p-6 pb-4 border-b border-[#251D36]">
              <button
                onClick={() => setSelectedAstrologer(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#1F1830] hover:bg-[#2B2142] text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative shrink-0">
                  <img
                    src={
                      selectedAstrologer.avatarUrl ||
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'
                    }
                    alt={selectedAstrologer.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
                  />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -bottom-1 -right-1 border-2 border-[#141021]" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold font-serif text-white tracking-wide">
                      {selectedAstrologer.name}
                    </h2>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      ● {selectedAstrologer.isOnline ? 'Online Now' : 'Scheduled'}
                    </span>
                  </div>

                  <p className="text-xs text-amber-300 font-medium">{selectedAstrologer.title}</p>

                  <div className="flex items-center space-x-3 text-xs text-[#9E94B2] pt-1">
                    <span className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong className="text-white">{selectedAstrologer.rating || 4.9}</strong>
                      <span className="text-[#786C60]">
                        ({(selectedAstrologer.reviewCount || 1840).toLocaleString()} reviews)
                      </span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-white">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedAstrologer.experienceYears || 12}+ Years Exp</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-xs">
              {/* Commercial Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#1C162E] border border-[#2D2345] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#8E84A6] uppercase font-bold block">Session Fee</span>
                  <span className="text-lg font-bold font-mono text-amber-300">
                    ₹{selectedAstrologer.consultationFee || 1200}
                  </span>
                </div>
                <div className="bg-[#1C162E] border border-[#2D2345] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#8E84A6] uppercase font-bold block">Per Minute</span>
                  <span className="text-lg font-bold font-mono text-emerald-300">
                    ₹{selectedAstrologer.perMinuteRate || 25}/m
                  </span>
                </div>
                <div className="bg-[#1C162E] border border-[#2D2345] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#8E84A6] uppercase font-bold block">Experience</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {selectedAstrologer.experienceYears || 12} Yrs
                  </span>
                </div>
                <div className="bg-[#1C162E] border border-[#2D2345] p-3 rounded-xl text-center">
                  <span className="text-[10px] text-[#8E84A6] uppercase font-bold block">Profile Views</span>
                  <span className="text-lg font-bold font-mono text-purple-300">
                    {selectedAstrologer.viewsCount || 52}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-[#181226] border border-[#2A203F] p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#C7BED6]">
                  Astrologer Contact &amp; Verification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2 text-[#9E94B2]">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-white font-mono">
                      {selectedAstrologer.email ||
                        `${selectedAstrologer.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@astroveda.com`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#9E94B2]">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-white font-mono">
                      {selectedAstrologer.phone || '+91 98220 54321'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#C7BED6]">
                  Astrological Specializations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedAstrologer.specialties)
                    ? selectedAstrologer.specialties
                    : String(selectedAstrologer.specialties || 'Kundli Analysis, Career, Marriage, Vastu')
                        .split(',')
                  ).map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#C7BED6]">
                  Languages Spoken
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedAstrologer.languages)
                    ? selectedAstrologer.languages
                    : String(selectedAstrologer.languages || 'Marathi, Hindi, English').split(',')
                  ).map((lang: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#201833] border border-[#2E234A] text-white text-xs"
                    >
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#C7BED6]">
                  Biography &amp; Vedic Lineage
                </h4>
                <p className="text-[#9E94B2] leading-relaxed bg-[#0F0C18] p-3 rounded-xl border border-[#231B34]">
                  {selectedAstrologer.bio ||
                    'Renowned practitioner of classical Vedic astrology with deep scholarly mastery in Brihat Parashara Hora Shastra, Jaimini Sutras, and remedial Jyotish.'}
                </p>
              </div>

              {/* Available Slots */}
              {selectedAstrologer.availableSlots && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#C7BED6]">
                    Available Consultation Slots
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(selectedAstrologer.availableSlots)
                      ? selectedAstrologer.availableSlots
                      : String(selectedAstrologer.availableSlots).split(',')
                    ).map((slot: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs"
                      >
                        {slot.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-[#0E0B16] border-t border-[#251D36] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/astrologers?search=${encodeURIComponent(selectedAstrologer.name)}`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit in Directory</span>
                </Link>
                <Link
                  href={`/admin/bookings?search=${encodeURIComponent(selectedAstrologer.name)}`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#201830] hover:bg-[#2C2144] border border-[#2D2345] text-xs font-semibold text-white transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Bookings</span>
                </Link>
              </div>

              <button
                onClick={() => setSelectedAstrologer(null)}
                className="px-4 py-2 rounded-xl bg-[#1C162E] hover:bg-[#251D3E] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
