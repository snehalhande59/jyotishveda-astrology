'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Astrologer } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Clock, Star, Users, CheckCircle2, Video, ShieldCheck, ArrowRight, MessageCircle, Phone, Sparkles } from 'lucide-react';

export default function AstrologerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { language, t, formatNumber, formatCurrency } = useLanguage();
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!params?.id) return;
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = await api.getAstrologerById(id);
        if (data) {
          setAstrologer(data);
        } else {
          const all = await api.getAstrologers();
          setAstrologer(all[0] || null);
        }
      } catch (e) {
        console.warn('Error loading astrologer profile:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-8 h-8 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] p-4 text-center font-sans">
        <h2 className="font-serif text-2xl font-bold text-[#2D1810]">
          {language === 'mr' ? 'ज्योतिषी सापडले नाहीत' : 'Astrologer Not Found'}
        </h2>
        <Link href="/astrologers" className="mt-4 text-xs font-bold text-[#D97706] hover:underline">
          {language === 'mr' ? '← ज्योतिषी सूचीकडे परत जा' : 'Return to Astrologers Directory'}
        </Link>
      </div>
    );
  }

  const perMinute = Math.round(astrologer.consultationFee / 45) || 25;

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Header Profile Section */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative flex-shrink-0">
            <img
              src={
                astrologer.avatarUrl ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'
              }
              alt={astrologer.name}
              className="w-32 h-32 rounded-3xl object-cover ring-4 ring-emerald-500 ring-offset-4 ring-offset-white shadow-md"
            />
            <span className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white absolute bottom-1 right-1 shadow-xs" />
          </div>

          <div className="space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'mr' ? '१००% प्रमाणित वैदिक ज्योतिषी' : 'Certified Jyotish Scholar'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
              {astrologer.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#D97706] font-bold">{astrologer.title}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-[#786C60] pt-1">
              <span className="font-semibold text-amber-600">★ {formatNumber(astrologer.rating)} ({formatNumber(astrologer.reviewCount)} {language === 'mr' ? 'सत्रे' : 'sessions'})</span>
              <span>•</span>
              <span>{formatNumber(astrologer.experienceYears)}+ {language === 'mr' ? 'वर्षांचा सखोल अनुभव' : 'Years of Rigorous Practice'}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                {language === 'mr' ? 'परिचय आणि कार्यपद्धती' : 'About & Vedic Background'}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed">
                {astrologer.bio}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                {language === 'mr' ? 'विशेष कौशल्ये व अभ्यास' : 'Core Specializations & Traditions'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(astrologer.specialties) ? astrologer.specialties : []).map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-bold shadow-2xs"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                {language === 'mr' ? 'संभाषण भाषा' : 'Spoken Languages'}
              </h3>
              <p className="text-xs text-[#6B5A4E]">
                {Array.isArray(astrologer.languages) ? astrologer.languages.join(', ') : String(astrologer.languages || 'English, Hindi, Marathi')}
              </p>
            </div>
          </div>

          {/* Booking / Action Widget */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-[#FDE68A] shadow-sm space-y-5">
              <div className="pb-4 border-b border-[#F5EFE6]">
                <span className="text-[10px] text-[#786C60] uppercase tracking-wider block font-bold">
                  {language === 'mr' ? 'सल्ला शुल्क' : 'Consultation Fee'}
                </span>
                <span className="font-serif text-2xl font-extrabold text-[#2D1810]">
                  {formatCurrency(perMinute)}
                  <span className="text-xs font-normal text-[#786C60]"> /min</span>
                </span>
                <span className="text-[11px] text-emerald-700 block font-semibold mt-1">
                  ✓ {language === 'mr' ? 'पहिले ५ मिनिटे विनामूल्य' : 'First 5-Min Free Intro Available'}
                </span>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/chat"
                  className="w-full py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs rounded-xl shadow-xs hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'mr' ? 'थेट चॅट सुरू करा' : 'Start Live Chat'}</span>
                </Link>

                <Link
                  href={`/booking?astrologerId=${astrologer.id}`}
                  className="w-full py-3 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'mr' ? 'कॉल सत्र बुक करा' : 'Book 1-on-1 Call'}</span>
                </Link>
              </div>

              <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#EAE1D2] text-[11px] text-[#786C60] space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? '१००% खाजगी व गोपनीय' : '100% Confidential & Secure'}</span>
                </div>
                <p>{language === 'mr' ? 'आपले जन्मतपशील व संभाषण पूर्णपणे सुरक्षित राहते.' : 'All consultations are strictly private and encrypted.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
