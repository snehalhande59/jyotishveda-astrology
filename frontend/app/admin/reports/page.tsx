'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import {
  Download,
  Users,
  Sparkles,
  Calendar,
  IndianRupee,
  Activity,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const REPORT_DEFINITIONS = [
  {
    id: 'users',
    title: 'User Registrations Report',
    description: 'Complete directory of registered AstroVeda clients with email, registration timestamps, verification state, and booking tallies.',
    icon: Users,
    fields: ['User ID', 'Username', 'Email', 'Confirmed Status', 'Blocked Status', 'Registered Date'],
    filename: 'astroveda_users_export.csv',
    color: 'blue',
  },
  {
    id: 'astrologers',
    title: 'Astrologers Directory & Performance',
    description: 'Active scholar directory with experience, consultation fee, per-minute rate, rating, review count, online status, and active visibility.',
    icon: Sparkles,
    fields: ['ID', 'Scholar Name', 'Title', 'Experience Years', 'Session Fee (₹)', 'Rating', 'Reviews', 'Online Status', 'Published'],
    filename: 'astroveda_astrologers_export.csv',
    color: 'amber',
  },
  {
    id: 'bookings',
    title: 'Consultations & Bookings Report',
    description: 'Comprehensive appointment log including booking numbers, astrologers, client emails, appointment dates, slots, fee, and status.',
    icon: Calendar,
    fields: ['Booking Number', 'Appointment Date', 'Time Slot', 'Status', 'Consultation Fee', 'Topic', 'Astrologer', 'Client Email'],
    filename: 'astroveda_bookings_export.csv',
    color: 'purple',
  },
  {
    id: 'revenue',
    title: 'Revenue & Payment Transactions',
    description: 'Reconciled transaction ledger with Razorpay order IDs, payment IDs, captured amounts, currencies, and service types.',
    icon: IndianRupee,
    fields: ['Order ID', 'Payment ID', 'Amount (INR)', 'Currency', 'Payment Status', 'Service Type', 'Client Email', 'Transaction Date'],
    filename: 'astroveda_revenue_export.csv',
    color: 'emerald',
  },
  {
    id: 'user-activity',
    title: 'Service Usage & Interactions',
    description: 'Granular interaction events showing which free tools and services users open, date/time, and guest vs registered breakdown.',
    icon: Activity,
    fields: ['Event Type', 'Service Name', 'Category', 'Keyword', 'Target URL', 'Client Email', 'Is Guest', 'Date & Time'],
    filename: 'astroveda_service_usage_export.csv',
    color: 'rose',
  },
  {
    id: 'searches',
    title: 'Search Queries & Keywords',
    description: 'Audit of every keyword searched in the AstroVeda search modal with timestamps and client identification.',
    icon: Search,
    fields: ['Keyword Query', 'Search Category', 'User Status', 'Frequency Count', 'Timestamp'],
    filename: 'astroveda_search_queries_export.csv',
    color: 'amber',
  },
];

export default function ReportsExportPage() {
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const handleDownload = async (reportId: string, filename: string) => {
    setDownloading((prev) => ({ ...prev, [reportId]: true }));
    try {
      const url = adminApi.getExportUrl(reportId as any);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Export download failed');
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert('Failed to export report: ' + err.message);
    } finally {
      setDownloading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  return (
    <AdminLayout
      title="Data Reports &amp; Export Center"
      subtitle="Generate and download CSV data spreadsheets directly from the production database"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORT_DEFINITIONS.map((rep) => {
          const Icon = rep.icon;
          const isBusy = downloading[rep.id];
          return (
            <div
              key={rep.id}
              className="bg-[#141021] border border-[#2B233F] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-[#211933] border border-[#2F2447] text-[#A69CBE] px-2 py-0.5 rounded-full font-mono">
                    CSV Format
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm tracking-wide group-hover:text-amber-300 transition-colors">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-[#8E84A6] mt-1 leading-relaxed">
                    {rep.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#231B34]">
                  <span className="text-[10px] text-[#7A7091] uppercase font-bold tracking-wider block mb-1">
                    Export Schema
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rep.fields.map((f, i) => (
                      <span key={i} className="text-[10px] bg-[#0E0C16] text-[#A69CBE] px-1.5 py-0.5 rounded border border-[#1E172C]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(rep.id, rep.filename)}
                disabled={isBusy}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-extrabold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Preparing CSV...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export CSV Dataset</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
