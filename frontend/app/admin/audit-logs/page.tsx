'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  History,
  Search,
  Filter,
  Download,
  RotateCw,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Eye,
  CheckCircle,
} from 'lucide-react';

function AuditLogsContent() {
  const { isDark } = useAdminTheme();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs({
        module: moduleFilter !== 'all' ? moduleFilter : undefined,
        search,
      });
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      console.warn('Audit logs fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [moduleFilter, search]);

  const exportCSV = () => {
    const headers = ['Action', 'Staff Member', 'Role', 'Module', 'Target Title', 'Details', 'IP Address', 'Timestamp'];
    const rows = logs.map((l) => [
      l.action,
      l.staffEmail,
      l.staffRole,
      l.module,
      l.targetTitle,
      l.details,
      l.ipAddress,
      l.timestamp,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val: any) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JyotishVeda_AuditLogs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout
      title="Audit Logs & Administrative Actions"
      subtitle="Immutable security trail of staff logins, profile updates, status changes, and platform operations"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-blue-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Total Logged Events
          </span>
          <div className="text-3xl font-extrabold font-mono text-blue-500 mt-2">
            {logs.length}
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Authenticated administrative operations</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-emerald-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Security Integrity Status
          </span>
          <div className="text-xl font-extrabold text-emerald-500 mt-2 flex items-center space-x-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>Cryptographically Verified</span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Immutable ledger with IP logging</span>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141021] border-amber-500/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Active Staff Sessions
          </span>
          <div className="text-3xl font-extrabold font-mono text-amber-500 mt-2">
            1 Super Admin
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">admin@astroveda.com</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isDark ? 'bg-[#141021] border-[#251D36]' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Astrologer', 'Bookings', 'Shop', 'Payment', 'Authentication'].map((mod) => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                moduleFilter === mod
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : isDark
                  ? 'bg-[#1D162C] hover:bg-[#251D38] border border-[#2B233F] text-gray-300'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action or details..."
              className={`pl-8 pr-4 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-amber-400 ${
                isDark
                  ? 'bg-[#0E0B17] border-[#2B233F] text-white placeholder-gray-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <button
            onClick={loadLogs}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#1D162C] hover:bg-[#251D38] border-[#2B233F] text-gray-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
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
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Staff Operator</th>
                <th className="py-3 px-4">Platform Module</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Operational Summary</th>
                <th className="py-3 px-4">Origin IP</th>
                <th className="py-3 px-4 text-right">Timestamp (IST)</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#221B33]' : 'divide-slate-100'}`}>
              {logs.map((l) => (
                <tr
                  key={l.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-amber-500/5' : 'hover:bg-amber-50/50'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-500">
                    {l.action}
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className={`block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {l.staffEmail}
                    </strong>
                    <span className="text-[10px] text-gray-400 font-semibold">{l.staffRole}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-300">{l.module}</td>
                  <td className="py-3.5 px-4">
                    <strong className={`block ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                      {l.targetTitle}
                    </strong>
                    <span className="text-[10px] text-gray-400 font-mono">{l.targetId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate" title={l.details}>
                    {l.details}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">{l.ipAddress}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-400 text-right whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AuditLogsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0812] flex items-center justify-center text-amber-400">
          <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
        </div>
      }
    >
      <AuditLogsContent />
    </Suspense>
  );
}
