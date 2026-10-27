'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, formatNumber } = useLanguage();

  return (
    <footer className="bg-[#0B0819] text-[#D8C7A5] border-t border-[#D4AF37]/20 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#D4AF37]/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-gold">
                <Sparkles className="w-5 h-5 text-[#0F0B1E]" />
              </div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-[#F7DF94] to-[#D4AF37] bg-clip-text text-transparent">
                JyotishVeda
              </span>
            </Link>
            <p className="text-xs text-[#D8C7A5]/80 leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="pt-2 text-xs space-y-2 text-[#D8C7A5]/70">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>contact@jyotishveda.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+91 (0) 11 4987 6543</span>
              </div>
            </div>
          </div>

          {/* Col 1: Free Tools */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-[#FDFBF7] uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
              {t('footer.freeTools')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools" className="hover:text-[#D4AF37] font-semibold text-[#F7DF94] transition-colors">
                  {t('footer.allTools')}
                </Link>
              </li>
              <li>
                <Link href="/kundli" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.kundliGen')}
                </Link>
              </li>
              <li>
                <Link href="/compatibility" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.kundliMatch')}
                </Link>
              </li>
              <li>
                <Link href="/panchang" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.panchang')}
                </Link>
              </li>
              <li>
                <Link href="/horoscope" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.horoscope')}
                </Link>
              </li>
              <li>
                <Link href="/zodiac-signs" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.zodiacSigns')}
                </Link>
              </li>
              <li>
                <Link href="/nakshatras" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.nakshatras')}
                </Link>
              </li>
              <li>
                <Link href="/numerology" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.numerology')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Premium Reports & Consult */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-[#FDFBF7] uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
              {t('footer.reportsServices')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-[#D4AF37] font-semibold text-[#F7DF94] transition-colors">
                  {t('footer.allServices')}
                </Link>
              </li>
              <li>
                <Link href="/reports/premium-kundli" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.detailedKundli')}
                </Link>
              </li>
              <li>
                <Link href="/reports/career" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.careerReport')}
                </Link>
              </li>
              <li>
                <Link href="/reports/marriage" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.marriageReport')}
                </Link>
              </li>
              <li>
                <Link href="/reports/finance" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.financeReport')}
                </Link>
              </li>
              <li>
                <Link href="/astrologers" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.astrologers')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Legal */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-[#FDFBF7] uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2">
              {t('footer.platformLegal')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.aboutVedic')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.articles')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.dashboard')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/birth-profiles" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.birthProfiles')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/orders" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.orders')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#D4AF37] text-[#F7DF94] transition-colors">
                  {t('footer.refund')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Astrology Guidance & Astronomical Disclaimer */}
        <div className="py-6 border-b border-[#D4AF37]/10 text-[11px] text-[#D8C7A5]/60 leading-relaxed">
          <div className="flex items-start space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <p>{t('footer.disclaimer')}</p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8C7A5]/60">
          <p>{t('footer.copyrightText', { year: formatNumber(new Date().getFullYear()) })}</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>{t('footer.reverence')}</span>
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
