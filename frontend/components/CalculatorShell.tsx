'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, Sparkles, BookOpen, Share2, HelpCircle } from 'lucide-react';

interface CalculatorShellProps {
  title: string;
  marathiTitle: string;
  subtitle: string;
  marathiSubtitle: string;
  shastraRule: string;
  marathiShastraRule: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  result?: React.ReactNode;
}

export default function CalculatorShell({
  title,
  marathiTitle,
  subtitle,
  marathiSubtitle,
  shastraRule,
  marathiShastraRule,
  icon,
  children,
  result,
}: CalculatorShellProps) {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center space-x-2 text-xs text-[#786C60] mb-3">
            <Link href="/" className="hover:text-[#D97706]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <Link href="/calculators" className="hover:text-[#D97706]">
              {isMr ? 'कॅल्क्युलेटर' : 'Calculators'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D8C7A5]" />
            <span className="text-[#D97706] font-semibold">{isMr ? marathiTitle : title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{isMr ? 'अचूक वैदिक गणितीय पद्धत' : 'Authentic Mathematical Calculation'}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
                {isMr ? marathiTitle : title}
              </h1>
              <p className="text-sm text-[#786C60] mt-1 max-w-2xl">
                {isMr ? marathiSubtitle : subtitle}
              </p>
            </div>
            {icon && (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#FCD34D] flex items-center justify-center text-[#92400E] shadow-sm flex-shrink-0">
                {icon}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* Shastra Rule Context Banner */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5">
          <BookOpen className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#785D46] leading-relaxed">
            <strong className="block text-[#92400E] font-semibold text-xs mb-1">
              {isMr ? 'शास्त्रीय संदर्भ व गणना पद्धत:' : 'Classical Shastra & Calculation Methodology:'}
            </strong>
            {isMr ? marathiShastraRule : shastraRule}
          </div>
        </div>

        {/* Form and Result Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className={result ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'}>
            <div className="bg-white rounded-3xl border border-[#EAE1D2] shadow-sm p-6 sm:p-8">
              {children}
            </div>
          </div>

          {/* Result Column */}
          {result && (
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-[#EAE1D2] shadow-md p-6 sm:p-8 sticky top-24">
                {result}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links Footer Bar */}
        <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-[#786C60]">
            <HelpCircle className="w-4 h-4 text-[#D97706]" />
            <span>{isMr ? 'अधिक सखोल वैयक्तिक मार्गदर्शनासाठी:' : 'Need deeper personalized chart guidance?'}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <Link
              href="/free-chat"
              className="text-[#16A34A] hover:underline"
            >
              🎁 {isMr ? 'मोफत ५-मि संप्रेषण' : 'Free 5-Min First Chat'}
            </Link>
            <span className="text-[#D8C7A5]">|</span>
            <Link
              href="/calculators"
              className="text-[#D97706] hover:underline"
            >
              {isMr ? 'सर्व कॅल्क्युलेटर &rarr;' : 'All Calculators &rarr;'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
