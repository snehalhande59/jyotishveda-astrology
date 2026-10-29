'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Astrologer } from '@/lib/types';
import { Users, Filter, CheckCircle2, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AstrologersPage() {
  const { t, language, formatNumber, formatCurrency } = useLanguage();
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAstrologers();
        setAstrologers(data);
      } catch (e) {
        console.warn('Error loading astrologers:', e);
      }
    }
    load();
  }, []);

  const specialtiesList = ['All', 'Kundli Deep-Dive', 'Marriage Compatibility', 'Nadi Astrology', 'Career Transitions', 'Vastu Shastra'];
  const specialtiesLabels: Record<string, { en: string; mr: string }> = {
    'All': { en: 'All', mr: 'सर्व' },
    'Kundli Deep-Dive': { en: 'Kundli Deep-Dive', mr: 'जन्मकुंडली सखोल विश्लेषण' },
    'Marriage Compatibility': { en: 'Marriage Compatibility', mr: 'विवाह गुणमेलन' },
    'Nadi Astrology': { en: 'Nadi Astrology', mr: 'नाडी ज्योतिष' },
    'Career Transitions': { en: 'Career Transitions', mr: 'करिअर व व्यवसाय' },
    'Vastu Shastra': { en: 'Vastu Shastra', mr: 'वास्तु शास्त्र' },
  };

  const filtered = selectedSpecialty === 'All'
    ? astrologers
    : astrologers.filter((a) =>
        Array.isArray(a.specialties)
          ? a.specialties.includes(selectedSpecialty)
          : String(a.specialties || '').includes(selectedSpecialty)
      );

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t('astrologers.verifiedTitle')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {t('astrologers.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {t('astrologers.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Specialty Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Filter className="w-4 h-4 text-[#D97706] flex-shrink-0" />
          <span className="text-xs font-bold text-[#4A2E18] mr-2 flex-shrink-0">{t('astrologers.filterSpecialty')}</span>
          {specialtiesList.map((spec) => {
            const label = specialtiesLabels[spec] ? (language === 'mr' ? specialtiesLabels[spec].mr : specialtiesLabels[spec].en) : spec;
            const isSelected = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFFBEB] text-[#92400E] border-2 border-[#F59E0B] shadow-xs'
                    : 'bg-white text-[#4A2E18] border border-[#EAE1D2] hover:border-[#F59E0B]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Astrologers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((astrologer) => {
            const perMinute = Math.round(astrologer.consultationFee / 45) || 25;
            return (
              <div
                key={astrologer.id}
                className="bg-white border border-[#EAE1D2] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <img
                        src={
                          astrologer.avatarUrl ||
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                        }
                        alt={astrologer.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500 ring-offset-2 ring-offset-white shadow-xs"
                      />
                      <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0 shadow-xs" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'mr' ? 'प्रमाणित' : 'Verified'}</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <span>{language === 'mr' ? 'ऑनलाइन' : 'Online'}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2D1810] line-clamp-1">
                      {astrologer.name}
                    </h3>
                    <p className="text-xs text-[#D97706] font-medium line-clamp-1">{astrologer.title}</p>
                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-[#786C60]">
                      <span className="flex items-center text-amber-500 font-bold">
                        ★ {formatNumber(astrologer.rating)}
                      </span>
                      <span>({formatNumber(astrologer.reviewCount)} {t('astrologers.reviews')})</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B5A4E] line-clamp-2 leading-relaxed my-3">{astrologer.bio}</p>

                  <div className="text-[11px] space-y-1.5 py-3 border-t border-[#F5EFE6] text-[#6B5A4E]">
                    <div>
                      <strong className="text-[#2D1810]">{t('astrologers.experience')}:</strong> {formatNumber(astrologer.experienceYears)}+ {t('common.years')}
                    </div>
                    <div>
                      <strong className="text-[#2D1810]">{t('astrologers.specialties')}:</strong>{' '}
                      {Array.isArray(astrologer.specialties)
                        ? astrologer.specialties.join(', ')
                        : String(astrologer.specialties || '')}
                    </div>
                    <div>
                      <strong className="text-[#2D1810]">{t('astrologers.languages')}:</strong>{' '}
                      {Array.isArray(astrologer.languages)
                        ? astrologer.languages.join(', ')
                        : String(astrologer.languages || '')}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F5EFE6]">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] text-[#786C60] block">{t('astrologers.consultationFee')}</span>
                    <span className="font-serif text-base font-bold text-[#2D1810]">
                      {formatCurrency(perMinute)}
                      <span className="text-xs font-normal text-[#786C60]">/min</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/chat`}
                      className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('astrologers.chatLive')}</span>
                    </Link>
                    <Link
                      href={`/booking?astrologerId=${astrologer.id}`}
                      className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('astrologers.bookCall')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
