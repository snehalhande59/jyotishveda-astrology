'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface MediaOutlet {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
  styleClass: string;
}

const MEDIA_OUTLETS: MediaOutlet[] = [
  {
    id: 'economic-times',
    name: 'The Economic Times',
    styleClass: 'font-serif font-black tracking-tight text-[#1E293B]',
  },
  {
    id: 'mint',
    name: 'mint',
    subtitle: 'livemint.com',
    styleClass: 'font-sans font-extrabold tracking-tighter text-[#F97316] lowercase text-xl',
  },
  {
    id: 'forbes',
    name: 'Forbes',
    styleClass: 'font-serif font-bold tracking-widest text-[#0F172A] uppercase text-lg',
  },
  {
    id: 'business-standard',
    name: 'Business Standard',
    styleClass: 'font-serif font-bold tracking-normal text-[#991B1B]',
  },
  {
    id: 'ndtv',
    name: 'NDTV',
    badge: 'NEWS',
    styleClass: 'font-sans font-black tracking-tight text-[#DC2626]',
  },
  {
    id: 'yourstory',
    name: 'YOURSTORY',
    styleClass: 'font-sans font-black tracking-wider text-[#EA580C]',
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    subtitle: 'INDIA',
    styleClass: 'font-serif font-extrabold tracking-tight text-[#18181B]',
  },
  {
    id: 'et-now',
    name: 'ET NOW',
    styleClass: 'font-sans font-black tracking-tighter text-[#1D4ED8]',
  },
  {
    id: 'csr-universe',
    name: 'The CSR Universe',
    styleClass: 'font-sans font-bold tracking-tight text-[#047857]',
  },
];

export default function FeaturedMediaTicker() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  // Repeat the list 3 times to ensure seamless infinite looping on all screen widths
  const marqueeItems = [...MEDIA_OUTLETS, ...MEDIA_OUTLETS, ...MEDIA_OUTLETS];

  return (
    <section className="relative w-full bg-[#FFFDF9] border-y border-[#EAE1D2] py-4 sm:py-5 overflow-hidden">
      {/* Left & Right gradient fade masks for seamless edge fading */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#FFFDF9] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#FFFDF9] to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
        {/* Fixed Title Label */}
        <div className="flex items-center space-x-2 shrink-0 md:pr-4 md:border-r border-[#EAE1D2] z-20">
          <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#785D46] whitespace-nowrap">
            {isMr ? 'या माध्यमांमध्ये प्रसिद्ध:' : 'FEATURED ON:'}
          </span>
        </div>

        {/* Continuous Smooth Infinite Marquee */}
        <div className="w-full overflow-hidden flex-1 relative">
          <div className="flex items-center space-x-8 sm:space-x-12 animate-marquee whitespace-nowrap">
            {marqueeItems.map((outlet, index) => (
              <div
                key={`${outlet.id}-${index}`}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/70 border border-[#EAE1D2]/60 shadow-2xs hover:shadow-xs hover:border-[#D97706]/40 transition-all cursor-default group shrink-0"
              >
                <span
                  className={`${outlet.styleClass} text-sm sm:text-base group-hover:scale-105 transition-transform inline-flex items-center space-x-1.5`}
                >
                  <span>{outlet.name}</span>
                  {outlet.subtitle && (
                    <span className="text-[9px] font-sans font-semibold text-[#786C60] uppercase tracking-normal">
                      {outlet.subtitle}
                    </span>
                  )}
                  {outlet.badge && (
                    <span className="text-[8px] bg-red-600 text-white font-sans font-bold px-1 py-0.2 rounded-xs tracking-normal">
                      {outlet.badge}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
