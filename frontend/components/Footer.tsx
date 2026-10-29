'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, ShieldCheck, Heart, Lock, CheckCircle, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, formatNumber } = useLanguage();
  const currentYear = formatNumber(new Date().getFullYear());

  return (
    <footer className="relative bg-[#FAF7F2] text-[#4A2E18] border-t border-[#EAE1D2] pt-16 pb-12 font-sans overflow-hidden">
      {/* Subtle Celestial Wheel Background Watermark */}
      <div className="absolute right-0 top-0 w-96 h-96 opacity-5 pointer-events-none translate-x-24 -translate-y-24">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="w-full h-full text-[#92400E]">
          <circle cx="100" cy="100" r="90" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="65" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" strokeWidth="0.8" />
          <line x1="10" y1="100" x2="190" y2="100" strokeWidth="0.8" />
          <line x1="100" y1="10" x2="100" y2="190" strokeWidth="0.8" />
          <line x1="36.36" y1="36.36" x2="163.64" y2="163.64" strokeWidth="0.8" />
          <line x1="36.36" y1="163.64" x2="163.64" y2="36.36" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Brand Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-10 border-b border-[#EAE1D2] gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#F59E0B] flex items-center justify-center shadow-sm border border-[#FCD34D]">
              <Sparkles className="w-6 h-6 text-[#92400E]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-[#2D1810]">
                Jyotish<span className="text-[#D97706]">Veda</span>
              </span>
              <p className="text-xs text-[#785D46] mt-0.5">
                Authentic Indian Vedic Astrology, True Sidereal Ephemeris &amp; Verified Acharya Consultations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 bg-white border border-[#EAE1D2] px-3.5 py-1.5 rounded-full text-[#16A34A] shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white border border-[#EAE1D2] px-3.5 py-1.5 rounded-full text-[#92400E] shadow-xs">
              <Award className="w-4 h-4 text-[#D97706]" />
              <span>Verified Acharyas</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white border border-[#EAE1D2] px-3.5 py-1.5 rounded-full text-[#2D1810] shadow-xs">
              <Lock className="w-4 h-4 text-[#D97706]" />
              <span>Razorpay Secured</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            FOUR COLUMN FOOTER GRID (AstroTalk Reference Layout)
           ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-[#EAE1D2]">
          
          {/* Column 1 — Corporate Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#2D1810] uppercase tracking-wider border-l-2 border-[#D97706] pl-2.5">
              {t('footer.corpInfo')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C4535]">
              <li>
                <Link href="/about" className="hover:text-[#D97706] transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D97706] transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#D97706] transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D97706] transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#D97706] font-medium transition-colors">
                  {t('footer.refund')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D97706] transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 — Astrologer */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#2D1810] uppercase tracking-wider border-l-2 border-[#D97706] pl-2.5">
              {t('footer.astrologerCol')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C4535]">
              <li>
                <Link href="/astrologers" className="hover:text-[#D97706] font-semibold text-[#B45309] transition-colors">
                  {t('footer.findAstrologers')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#D97706] transition-colors">
                  {t('footer.consultationServices')}
                </Link>
              </li>
              <li>
                <Link href="/kundli" className="hover:text-[#D97706] transition-colors">
                  {t('footer.freeKundli')}
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-[#D97706] text-[#16A34A] font-bold transition-colors">
                  {t('footer.freeFirstChat')} (5 Mins Free)
                </Link>
              </li>
              <li>
                <Link href="/contact?topic=astrologer-onboarding" className="hover:text-[#D97706] transition-colors">
                  Astrologer Registration
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-[#D97706] transition-colors">
                  Schedule Video Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Secure */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#2D1810] uppercase tracking-wider border-l-2 border-[#D97706] pl-2.5">
              {t('footer.secureCol')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C4535]">
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
                <span className="font-medium text-[#2D1810]">{t('footer.privacyConfidentiality')}</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
                <span className="font-medium text-[#2D1810]">{t('footer.verifiedAstrologers')}</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
                <span className="font-medium text-[#2D1810]">{t('footer.securePayments')}</span>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-[#785D46] space-y-2 border-t border-[#EAE1D2]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
                <span>contact@jyotishveda.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
                <span>+91 (0) 11 4987 6543</span>
              </div>
            </div>
          </div>

          {/* Column 4 — Explore */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#2D1810] uppercase tracking-wider border-l-2 border-[#D97706] pl-2.5">
              {t('footer.exploreCol')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C4535]">
              <li>
                <Link href="/horoscope" className="hover:text-[#D97706] transition-colors">
                  {t('footer.horoscope')}
                </Link>
              </li>
              <li>
                <Link href="/panchang" className="hover:text-[#D97706] transition-colors">
                  {t('footer.panchang')}
                </Link>
              </li>
              <li>
                <Link href="/compatibility" className="hover:text-[#D97706] transition-colors">
                  {t('footer.kundliMatch')}
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="hover:text-[#D97706] transition-colors">
                  2026 Festival Calendar
                </Link>
              </li>
              <li>
                <Link href="/healing" className="hover:text-[#D97706] transition-colors">
                  Gemstones &amp; Vedic Remedies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#D97706] transition-colors">
                  Astrological Research &amp; Wisdom
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Astrology Guidance Notice */}
        <div className="py-6 border-b border-[#EAE1D2] text-[11px] text-[#785D46] leading-relaxed">
          <div className="flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
            <p>{t('footer.disclaimer')}</p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#785D46]">
          <p>© {currentYear} JyotishVeda Platform. Built with Next.js &amp; Strapi 5. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>{t('footer.reverence')}</span>
            <Heart className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
