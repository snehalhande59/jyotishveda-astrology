'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Astrologer } from '@/lib/types';
import { Users, Filter } from 'lucide-react';
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
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs text-[#F7DF94]">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('astrologers.verifiedTitle')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            {t('astrologers.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto leading-relaxed">
            {t('astrologers.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Specialty Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-[#8C6D1F] flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-700 mr-2">{t('astrologers.filterSpecialty')}</span>
          {specialtiesList.map((spec) => {
            const label = specialtiesLabels[spec] ? (language === 'mr' ? specialtiesLabels[spec].mr : specialtiesLabels[spec].en) : spec;
            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-[#150D2A] text-[#F7DF94] border border-[#D4AF37]'
                    : 'bg-white text-gray-700 border border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Astrologers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((astrologer) => (
            <div
              key={astrologer.id}
              className="bg-white border border-[#D4AF37]/25 rounded-2xl p-6 shadow-sm hover:shadow-gold hover:border-[#D4AF37] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={astrologer.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
                    alt={astrologer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
                  />
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#150D2A]">{astrologer.name}</h3>
                    <p className="text-xs text-[#8C6D1F] font-medium">{astrologer.title}</p>
                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-gray-500">
                      <span className="flex items-center text-amber-500 font-semibold">
                        ★ {formatNumber(astrologer.rating)}
                      </span>
                      <span>({formatNumber(astrologer.reviewCount)} {t('astrologers.reviews')})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">{astrologer.bio}</p>

                <div className="text-[11px] space-y-1.5 py-3 border-t border-gray-100 text-gray-600">
                  <div>
                    <strong className="text-gray-900">{t('astrologers.experience')}:</strong> {formatNumber(astrologer.experienceYears)}+ {t('common.years')}
                  </div>
                  <div>
                    <strong className="text-gray-900">{t('astrologers.specialties')}:</strong>{' '}
                    {Array.isArray(astrologer.specialties)
                      ? astrologer.specialties.join(', ')
                      : String(astrologer.specialties || '')}
                  </div>
                  <div>
                    <strong className="text-gray-900">{t('astrologers.languages')}:</strong>{' '}
                    {Array.isArray(astrologer.languages)
                      ? astrologer.languages.join(', ')
                      : String(astrologer.languages || '')}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 block">{t('astrologers.consultationFee')}</span>
                  <span className="font-serif text-lg font-bold text-[#150D2A]">{formatCurrency(astrologer.consultationFee)}</span>
                </div>
                <div className="flex space-x-1.5">
                  <Link
                    href={`/chat`}
                    className="px-3 py-2 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-bold text-xs rounded-lg shadow-sm hover:opacity-95"
                  >
                    {t('astrologers.chatLive')}
                  </Link>
                  <Link
                    href={`/booking?astrologerId=${astrologer.id}`}
                    className="px-3 py-2 bg-[#150D2A] hover:bg-[#8C6D1F] text-[#FDFBF7] text-xs font-medium rounded-lg transition-colors"
                  >
                    {t('astrologers.bookCall')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
