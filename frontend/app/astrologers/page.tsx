'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Astrologer } from '@/lib/types';
import {
  Users,
  Filter,
  CheckCircle2,
  MessageCircle,
  Phone,
  Sparkles,
  Search,
  Star,
  GraduationCap,
  Languages,
  Calendar,
  X,
  Clock,
  RotateCw,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AstrologersPage() {
  const { t, language, formatNumber, formatCurrency } = useLanguage();
  const isMr = language === 'mr';

  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  // Profile Modal State
  const [activeProfile, setActiveProfile] = useState<Astrologer | null>(null);

  const fetchAstrologers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAstrologers();
      setAstrologers(data || []);
    } catch (e: any) {
      console.warn('Error loading astrologers:', e);
      setError(
        e.message ||
          (isMr
            ? 'ज्योतिषांची यादी लोड करता आली नाही. कृपया पुन्हा प्रयत्न करा.'
            : 'Unable to load astrologers directory.')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologers();
  }, []);

  // Dynamically extract unique specialties from actual database records
  const dynamicSpecialties = useMemo(() => {
    const set = new Set<string>();
    astrologers.forEach((a) => {
      if (Array.isArray(a.specialties)) {
        a.specialties.forEach((s) => set.add(s));
      }
    });
    return ['All', ...Array.from(set)];
  }, [astrologers]);

  // Dynamically extract unique languages from actual database records
  const dynamicLanguages = useMemo(() => {
    const set = new Set<string>();
    astrologers.forEach((a) => {
      if (Array.isArray(a.languages)) {
        a.languages.forEach((l) => set.add(l));
      }
    });
    return ['All', ...Array.from(set)];
  }, [astrologers]);

  // Filtered List based on search, specialty, and language
  const filteredAstrologers = useMemo(() => {
    return astrologers.filter((astro) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = astro.name?.toLowerCase().includes(q);
        const matchBio = astro.bio?.toLowerCase().includes(q);
        const matchTitle = astro.title?.toLowerCase().includes(q);
        const matchSpec = astro.specialties?.some((s) => s.toLowerCase().includes(q));
        const matchLang = astro.languages?.some((l) => l.toLowerCase().includes(q));
        if (!matchName && !matchBio && !matchTitle && !matchSpec && !matchLang) {
          return false;
        }
      }

      // 2. Specialty Filter
      if (selectedSpecialty !== 'All') {
        const hasSpec = Array.isArray(astro.specialties)
          ? astro.specialties.includes(selectedSpecialty)
          : String(astro.specialties || '').includes(selectedSpecialty);
        if (!hasSpec) return false;
      }

      // 3. Language Filter
      if (selectedLanguage !== 'All') {
        const hasLang = Array.isArray(astro.languages)
          ? astro.languages.includes(selectedLanguage)
          : String(astro.languages || '').includes(selectedLanguage);
        if (!hasLang) return false;
      }

      return true;
    });
  }, [astrologers, searchQuery, selectedSpecialty, selectedLanguage]);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#EAE1D2] rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#786C60] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  isMr
                    ? 'नावाने, विषयांनुसार किंवा भाषेद्वारे ज्योतिषी शोधा...'
                    : 'Search scholars by name, expertise, or language...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-2xl text-xs sm:text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Language Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-2xl text-xs sm:text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors"
              >
                <option value="All">{isMr ? 'सर्व भाषा (All Languages)' : 'All Languages'}</option>
                {dynamicLanguages
                  .filter((l) => l !== 'All')
                  .map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
              </select>
            </div>

            {/* Results Counter / Clear */}
            <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3 text-xs text-[#786C60]">
              <span>
                {isMr ? 'एकूण:' : 'Showing:'}{' '}
                <strong className="text-[#2D1810]">{filteredAstrologers.length}</strong>{' '}
                {isMr ? 'विद्वान' : 'Scholars'}
              </span>
              {(searchQuery || selectedSpecialty !== 'All' || selectedLanguage !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialty('All');
                    setSelectedLanguage('All');
                  }}
                  className="text-xs text-[#D97706] font-bold hover:underline"
                >
                  {isMr ? 'रीसेट' : 'Clear All'}
                </button>
              )}
            </div>
          </div>

          {/* Specialty Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#F5EFE6]">
            <Filter className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
            <span className="text-[11px] font-bold text-[#4A2E18] mr-1 flex-shrink-0">
              {t('astrologers.filterSpecialty')}
            </span>
            {dynamicSpecialties.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFBEB] text-[#92400E] border-2 border-[#F59E0B] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#4A2E18] border border-[#EAE1D2] hover:border-[#F59E0B]'
                  }`}
                >
                  {spec === 'All' ? (isMr ? 'सर्व विषय' : 'All Topics') : spec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAstrologers}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center space-x-1"
            >
              <RotateCw className="w-3 h-3" />
              <span>{isMr ? 'पुन्हा प्रयत्न करा' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Astrologers Grid / Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#EAE1D2] rounded-3xl p-6 shadow-sm space-y-4 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-full bg-gray-200" />
                  <div className="w-20 h-5 rounded-full bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-5 bg-gray-200 rounded" />
                  <div className="w-1/2 h-3 bg-gray-200 rounded" />
                </div>
                <div className="w-full h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredAstrologers.length === 0 ? (
          <div className="bg-white border border-[#EAE1D2] rounded-3xl p-12 text-center text-[#786C60] space-y-3">
            <Users className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#2D1810]">
              {isMr ? 'कोणतेही ज्योतिषी सापडले नाहीत' : 'No Astrologers Match Your Search'}
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              {isMr
                ? 'कृपया तुमचे शोध शब्द बदला किंवा फिल्टर रीसेट करा.'
                : 'Try adjusting your search criteria or resetting the active filters.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
                setSelectedLanguage('All');
              }}
              className="px-5 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309]"
            >
              {isMr ? 'सर्व ज्योतिषी पहा' : 'View All Astrologers'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAstrologers.map((astrologer) => {
              const perMinute =
                astrologer.perMinuteRate || Math.round(astrologer.consultationFee / 45) || 25;
              const isOnline = astrologer.isOnline !== false;

              return (
                <div
                  key={astrologer.id}
                  className="bg-white border border-[#EAE1D2] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-[#F59E0B] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Photo + Badges */}
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
                        {isOnline && (
                          <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0 shadow-xs" />
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isMr ? 'प्रमाणित' : 'Verified'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                          <span>{isMr ? 'ऑनलाइन' : 'Online'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D1810] line-clamp-1">
                        {astrologer.name}
                      </h3>
                      <p className="text-xs text-[#D97706] font-medium line-clamp-1">
                        {astrologer.title || (isMr ? 'वैदिक ज्योतिषी आणि विद्वान' : 'Vedic Scholar')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-[#786C60]">
                        <span className="flex items-center text-amber-500 font-bold">
                          ★ {formatNumber(astrologer.rating || 4.9)}
                        </span>
                        <span>
                          ({formatNumber(astrologer.reviewCount || 450)}{' '}
                          {t('astrologers.reviews')})
                        </span>
                        <span>•</span>
                        <span>
                          {formatNumber(astrologer.experienceYears || 10)}+ {t('common.years')}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#6B5A4E] line-clamp-2 leading-relaxed my-3">
                      {astrologer.bio}
                    </p>

                    {/* Specialties & Languages Details */}
                    <div className="text-[11px] space-y-1.5 py-3 border-t border-[#F5EFE6] text-[#6B5A4E]">
                      <div>
                        <strong className="text-[#2D1810]">
                          {t('astrologers.specialties')}:
                        </strong>{' '}
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

                    {/* View Details Profile Link */}
                    <button
                      type="button"
                      onClick={() => setActiveProfile(astrologer)}
                      className="text-[11px] text-[#D97706] font-bold hover:underline mb-2 block text-left"
                    >
                      {isMr ? 'पूर्ण परिचय आणि पात्रता पहा →' : 'View Profile & Qualifications →'}
                    </button>
                  </div>

                  {/* Pricing and CTAs */}
                  <div className="mt-2 pt-3 border-t border-[#F5EFE6]">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-[11px] text-[#786C60] block">
                        {t('astrologers.consultationFee')}
                      </span>
                      <span className="font-serif text-base font-bold text-[#2D1810]">
                        {formatCurrency(perMinute)}
                        <span className="text-xs font-normal text-[#786C60]">/min</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/chat?astrologerId=${astrologer.id}`}
                        className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{t('astrologers.chatLive')}</span>
                      </Link>
                      <Link
                        href={`/booking?astrologerId=${astrologer.id}`}
                        className="border border-[#D97706] text-[#92400E] hover:bg-[#FFFBEB] font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>{t('astrologers.bookCall')}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Astrologer Profile Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border-2 border-[#FDE68A] w-full max-w-lg rounded-3xl p-6 text-[#2D1810] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-5 right-5 text-[#786C60] hover:text-[#2D1810] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <img
                src={
                  activeProfile.avatarUrl ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                }
                alt={activeProfile.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#D97706]"
              />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                  {activeProfile.name}
                </h3>
                <span className="text-xs text-[#D97706] font-medium block">
                  {activeProfile.title}
                </span>
                <span className="text-xs text-amber-500 font-bold">
                  ★ {formatNumber(activeProfile.rating || 4.9)} ({formatNumber(activeProfile.reviewCount || 450)} {t('astrologers.reviews')})
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE1D2] space-y-2 text-xs text-[#5C4535]">
              <div>
                <strong>{t('astrologers.experience')}:</strong> {formatNumber(activeProfile.experienceYears)}+ {t('common.years')}
              </div>
              <div>
                <strong>{t('astrologers.specialties')}:</strong>{' '}
                {Array.isArray(activeProfile.specialties) ? activeProfile.specialties.join(', ') : String(activeProfile.specialties)}
              </div>
              <div>
                <strong>{t('astrologers.languages')}:</strong>{' '}
                {Array.isArray(activeProfile.languages) ? activeProfile.languages.join(', ') : String(activeProfile.languages)}
              </div>
              <div>
                <strong>{isMr ? '३०-मिनिटे खाजगी सत्र शुल्क:' : 'Standard Consultation Fee:'}</strong>{' '}
                {formatCurrency(activeProfile.consultationFee)}
              </div>
            </div>

            <div className="text-xs text-[#6B5A4E] leading-relaxed">
              <strong className="block text-[#2D1810] mb-1">{isMr ? 'परिचय आणि कार्यपद्धती:' : 'About & Vedic Background:'}</strong>
              <p>{activeProfile.bio}</p>
            </div>

            <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-end space-x-3">
              <Link
                href={`/chat?astrologerId=${activeProfile.id}`}
                onClick={() => setActiveProfile(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {t('astrologers.chatLive')}
              </Link>
              <Link
                href={`/booking?astrologerId=${activeProfile.id}`}
                onClick={() => setActiveProfile(null)}
                className="px-5 py-2.5 border border-[#D97706] text-[#92400E] font-bold text-xs rounded-xl hover:bg-[#FFFBEB]"
              >
                {t('astrologers.bookCall')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
