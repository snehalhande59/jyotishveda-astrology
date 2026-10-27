'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FileText, ArrowLeft, Download, CheckCircle } from 'lucide-react';

export default function MyReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getMyReports();
        setReports(data || []);
      } catch (e) {
        console.warn('Error fetching reports:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-[#D8C7A5] hover:text-[#FDFBF7] flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#FDFBF7]">My Purchased Astrology Reports</h1>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 bg-[#D4AF37] text-[#0F0B1E] font-semibold text-xs rounded-xl shadow-gold hover:opacity-95"
          >
            + Order New Report
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      Purchased &amp; Active
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#150D2A]">{report.title}</h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                    {report.reportContent?.summary || report.reportContent?.analysis || 'Vedic sidereal astrological analysis.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-[#8C6D1F] font-semibold">
                    Type: {report.reportType?.toUpperCase()}
                  </span>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print();
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF6F0] border border-[#D4AF37]/30 text-xs font-semibold text-[#8C6D1F] rounded-lg hover:bg-gray-100"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View / Print PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-[#D4AF37]/20 text-center max-w-lg mx-auto space-y-4">
            <FileText className="w-12 h-12 text-[#8C6D1F]/50 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#150D2A]">No Reports Purchased Yet</h3>
            <p className="text-xs text-gray-600">
              Explore our Career, Marriage, Finance, or 50-page Detailed Kundli reports to receive tailored Vedic guidance.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-5 py-2.5 bg-[#150D2A] text-[#FDFBF7] font-semibold text-xs rounded-xl shadow-md hover:bg-[#8C6D1F]"
            >
              Explore Astrology Reports
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
