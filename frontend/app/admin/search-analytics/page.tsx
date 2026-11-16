'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Search,
  Download,
  RotateCw,
  TrendingUp,
  Sparkles,
  Compass,
  ArrowRight,
  Filter,
  X,
} from 'lucide-react';

function SearchAnalyticsContent() {
  const searchParams = useSearchParams();
  const [range, setRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [keywordFilter, setKeywordFilter] = useState('');

  useEffect(() => {
    const q = searchParams?.get('search');
    if (q) setKeywordFilter(q);
  }, [searchParams]);

  const loadSearchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAnalytics({ range });
      if (res && res.data) {
        setAnalytics(res.data);
      }
    } catch (err: any) {
      console.warn('Search analytics fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSearchData();
  }, [range]);

  const topKeywords = analytics?.topKeywords || [];
  const totalSearches = analytics?.totalSearches || 0;

  const filteredKeywords = keywordFilter
    ? topKeywords.filter((k: any) =>
        k.name?.toLowerCase().includes(keywordFilter.toLowerCase())
      )
    : topKeywords;

  return (
    <AdminLayout
      title="Search Analytics Intelligence"
      subtitle="Analyze what questions, keywords, and astrological services users search for on AstroVeda"
    >
      {/* Range & Filter Bar */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['today', '7days', '30days'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                range === r
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-[#A69CBE]'
              }`}
            >
              {r === '7days' ? 'Last 7 Days' : r === '30days' ? 'Last 30 Days' : 'Today'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder="Filter keyword..."
              className="pl-8 pr-7 py-1.5 bg-[#171224] border border-[#2D2344] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
            {keywordFilter && (
              <button
                onClick={() => setKeywordFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={loadSearchData}
            className="p-2 rounded-xl bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-[#9F96B2] hover:text-white transition-colors"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <a
            href={adminApi.getExportUrl('searches')}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#201830] hover:bg-[#2A2040] border border-[#2E2445] text-amber-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </a>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold text-[#8E84A6] uppercase tracking-wider block">
            Total Searches Logged
          </span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{totalSearches}</div>
          <span className="text-[11px] text-[#8E84A6] block">Platform queries executed</span>
        </div>

        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold text-[#8E84A6] uppercase tracking-wider block">
            Unique Search Terms
          </span>
          <div className="text-3xl font-extrabold text-white font-mono">{topKeywords.length}</div>
          <span className="text-[11px] text-[#8E84A6] block">Distinct topics searched</span>
        </div>

        <div className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold text-[#8E84A6] uppercase tracking-wider block">
            Primary Interest Focus
          </span>
          <div className="text-xl font-extrabold text-emerald-400 capitalize truncate">
            {topKeywords[0]?.name || 'Kundli Matching'}
          </div>
          <span className="text-[11px] text-[#8E84A6] block">#1 Search category</span>
        </div>
      </div>

      {/* Top Keywords Table */}
      <div className="bg-[#141021] border border-[#2B233F] rounded-2xl shadow-xl overflow-hidden p-5 space-y-4">
        <div className="border-b border-[#251D36] pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">
              Ranked Keyword Intelligence
            </h3>
            <p className="text-[11px] text-[#8E84A6]">
              Every search keyword submitted in the global search modal is recorded with timestamp and user status.
            </p>
          </div>
          {keywordFilter && (
            <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
              Filtering for: &ldquo;{keywordFilter}&rdquo;
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F0C1A] text-[#8E84A6] uppercase tracking-wider font-semibold border-b border-[#261E38]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Keyword</th>
                <th className="py-3 px-4">Query Count</th>
                <th className="py-3 px-4">Share of Total</th>
                <th className="py-3 px-4">Visual Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#211A31] text-[#D6CEE5]">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8E84A6]">
                    No search terms match your filter &ldquo;{keywordFilter}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((kw: any, idx: number) => {
                  const share = totalSearches > 0 ? Math.round((kw.count / totalSearches) * 100) : 0;
                  return (
                    <tr key={idx} className="hover:bg-[#1A1428] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">#{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <strong className="text-white capitalize font-mono text-xs">&ldquo;{kw.name}&rdquo;</strong>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{kw.count}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-300">{share}%</td>
                      <td className="py-3.5 px-4">
                        <div className="w-36 h-2 rounded-full bg-[#201830] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, share * 3))}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function SearchAnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0812] flex items-center justify-center text-amber-400">
          <div className="flex items-center space-x-3">
            <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
            <span className="font-serif">Loading Search Analytics...</span>
          </div>
        </div>
      }
    >
      <SearchAnalyticsContent />
    </Suspense>
  );
}
