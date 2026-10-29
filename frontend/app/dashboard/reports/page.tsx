'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FileText, ArrowLeft, Download, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MyReportsPage() {
  const { language } = useLanguage();
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
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'डॅशबोर्डवर परत जा' : 'Back to Dashboard'}</span>
            </Link>
            <h1 className="font-serif text-3xl font-extrabold text-[#2D1810]">
              {language === 'mr' ? 'माझे खरेदी केलेले ज्योतिष अहवाल' : 'My Purchased Astrology Reports'}
            </h1>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs rounded-xl shadow-md transition-all"
          >
            {language === 'mr' ? '+ नवीन अहवाल मागवा' : '+ Order New Report'}
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#D97706] transition-all"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                      {language === 'mr' ? 'सक्रिय आणि उपलब्ध' : 'Purchased & Active'}
                    </span>
                    <span className="text-xs text-[#786C60]">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2D1810]">{report.title}</h3>
                  <p className="text-xs text-[#786C60] mt-2 line-clamp-3 leading-relaxed">
                    {report.reportContent?.summary || report.reportContent?.analysis || 'Vedic sidereal astrological analysis.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE1D2] flex items-center justify-between">
                  <span className="text-xs text-[#B45309] font-bold">
                    {language === 'mr' ? 'प्रकार:' : 'Type:'} {report.reportType?.toUpperCase()}
                  </span>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print();
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-xs font-semibold text-[#92400E] rounded-lg hover:bg-[#FEF3C7] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'mr' ? 'पीडीएफ पहा / प्रिंट करा' : 'View / Print PDF'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-[#EAE1D2] text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <FileText className="w-12 h-12 text-[#D97706]/50 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2D1810]">
              {language === 'mr' ? 'अद्याप कोणतेही अहवाल खरेदी केलेले नाहीत' : 'No Reports Purchased Yet'}
            </h3>
            <p className="text-xs text-[#786C60] leading-relaxed">
              {language === 'mr'
                ? 'वैयक्तिक वैदिक मार्गदर्शनासाठी आमचे करिअर, विवाह, वित्त किंवा संपूर्ण ५० पानी सविस्तर कुंडली अहवाल मिळवा.'
                : 'Explore our Career, Marriage, Finance, or 50-page Detailed Kundli reports to receive tailored Vedic guidance.'}
            </p>
            <Link
              href="/pricing"
              className="inline-block px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              {language === 'mr' ? 'अहवाल पर्याय पहा' : 'Explore Astrology Reports'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}