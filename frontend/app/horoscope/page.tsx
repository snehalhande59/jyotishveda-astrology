'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Horoscope } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Calendar, Heart, Briefcase, DollarSign, Activity, ChevronRight, Clock, Star } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', sanskrit: 'Mesha', dates: 'Mar 21 - Apr 19', symbol: '♈' },
  { name: 'Taurus', sanskrit: 'Vrishabha', dates: 'Apr 20 - May 20', symbol: '♉' },
  { name: 'Gemini', sanskrit: 'Mithuna', dates: 'May 21 - Jun 20', symbol: '♊' },
  { name: 'Cancer', sanskrit: 'Karka', dates: 'Jun 21 - Jul 22', symbol: '♋' },
  { name: 'Leo', sanskrit: 'Simha', dates: 'Jul 23 - Aug 22', symbol: '♌' },
  { name: 'Virgo', sanskrit: 'Kanya', dates: 'Aug 23 - Sep 22', symbol: '♍' },
  { name: 'Libra', sanskrit: 'Tula', dates: 'Sep 23 - Oct 22', symbol: '♎' },
  { name: 'Scorpio', sanskrit: 'Vrishchika', dates: 'Oct 23 - Nov 21', symbol: '♏' },
  { name: 'Sagittarius', sanskrit: 'Dhanu', dates: 'Nov 22 - Dec 21', symbol: '♐' },
  { name: 'Capricorn', sanskrit: 'Makara', dates: 'Dec 22 - Jan 19', symbol: '♑' },
  { name: 'Aquarius', sanskrit: 'Kumbha', dates: 'Jan 20 - Feb 18', symbol: '♒' },
  { name: 'Pisces', sanskrit: 'Meena', dates: 'Feb 19 - Mar 20', symbol: '♓' },
];

export default function HoroscopePage() {
  const { language, t, translateSign, formatNumber } = useLanguage();
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0].name);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadHoroscope() {
      setLoading(true);
      try {
        const data = await api.getHoroscope(selectedSign, period);
        if (data) {
          setHoroscope(data);
        } else {
          // Standard Sidereal advisory fallback
          setHoroscope({
            id: 0,
            sign: selectedSign,
            date: new Date().toISOString().split('T')[0],
            period,
            generalGuidance:
              language === 'mr'
                ? 'आज चंद्र गोचर आपल्या राशीच्या अनुकूल स्थितीत असल्याने मानसिक शांतता आणि सकारात्मक विचार लाभतील. महत्त्वाच्या निर्णयांसाठी दुपारचा काळ फलदायी ठरेल.'
                : 'Today, the Moon activates your natural solar alignment, bringing renewed mental clarity and emotional composure. Favorable cosmic transits support diplomatic discussions and focused study.',
            love:
              language === 'mr'
                ? 'शुक्राची अनुकूल दृष्टी नातेसंबंधात गोडवा आणेल. जोडीदारासोबत सखोल व अर्थपूर्ण संभाषण होईल.'
                : 'Venus creates harmonious aspects, fostering deep and affectionate conversations with your partner. Singles may find engaging rapport through creative pursuits.',
            career:
              language === 'mr'
                ? 'बुधाचे सहकार्य कार्यक्षेत्रात अचूक नियोजन व उद्दिष्टपूर्तीसाठी साहाय्यक ठरेल. सहकाऱ्यांकडून उत्तम सहकार्य लाभेल.'
                : 'Mercury sharpens analytical execution. Your strategic input will be appreciated in collaborative team endeavors. Complete pending documentation.',
            finance:
              language === 'mr'
                ? 'आर्थिक स्थिती स्थिर राहील. दीर्घकालीन बचतीचे नियोजन करण्यासाठी चांगला दिवस. अनपेक्षित खर्च टाळा.'
                : 'Steady financial influences prevail. Favorable day for budgeting and consolidating long-term savings, while exercising caution with speculative trades.',
            health:
              language === 'mr'
                ? 'आरोग्य उत्तम राहील. भरपूर पाणी प्यावे आणि संध्याकाळी हलका व्यायाम किंवा ध्यानधारणा करावी.'
                : 'Vitality remains strong. Support your physical well-being through adequate hydration and a grounding 10-minute evening walk or meditation.',
            luckyNumber: 7,
            luckyColor: language === 'mr' ? 'भगवा आणि सोनेरी' : 'Royal Saffron & Gold',
            luckyTime: '10:30 AM - 12:00 PM',
          });
        }
      } catch (e) {
        console.warn('Horoscope load notice:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHoroscope();
  }, [selectedSign, period, language]);

  const activeSignInfo = ZODIAC_SIGNS.find((z) => z.name === selectedSign) || ZODIAC_SIGNS[0];

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{language === 'mr' ? 'ग्रह गोचर आणि राशीभविष्य' : 'Celestial Transits (Gochara)'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'दैनिक वैदिक राशीभविष्य (राशीफळ)' : 'Daily Vedic Horoscope (Rashifal)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? '१२ राशींसाठी वैदिक ग्रहांच्या स्थितीवर आधारित अचूक मार्गदर्शन व दिवसभराचे नियोजन.'
              : 'Advisory planetary perspectives for all 12 rashis to harmonize your daily activities.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Sign Selection Carousel / Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selectedSign === sign.name;
            const signLabel = translateSign(sign.name);
            return (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name)}
                className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFFBEB] border-2 border-[#F59E0B] text-[#92400E] shadow-sm font-bold scale-105'
                    : 'bg-white border-[#EAE1D2] text-[#4A2E18] hover:border-[#F59E0B] shadow-2xs'
                }`}
              >
                <span className="text-xl mb-0.5">{sign.symbol}</span>
                <span className="text-xs font-bold leading-tight line-clamp-1">{signLabel}</span>
                <span className="text-[10px] text-[#786C60]/70 mt-0.5">{sign.sanskrit}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Sign View & Frequency Toggles */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#F5EFE6] gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-3xl text-[#D97706] shadow-xs">
                {activeSignInfo.symbol}
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#2D1810]">
                  {translateSign(activeSignInfo.name)} ({activeSignInfo.sanskrit})
                </h2>
                <p className="text-xs text-[#786C60] mt-0.5">{activeSignInfo.dates}</p>
              </div>
            </div>

            {/* Daily / Weekly / Monthly Switcher */}
            <div className="flex bg-[#FAF7F2] p-1 rounded-xl text-xs border border-[#EAE1D2]">
              {(['daily', 'weekly', 'monthly'] as const).map((p) => {
                const isSelected = period === p;
                const label =
                  p === 'daily'
                    ? language === 'mr' ? 'दैनिक' : 'Daily'
                    : p === 'weekly'
                    ? language === 'mr' ? 'साप्ताहिक' : 'Weekly'
                    : language === 'mr' ? 'मासिक' : 'Monthly';
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all capitalize cursor-pointer ${
                      isSelected
                        ? 'bg-[#F59E0B] text-white shadow-xs'
                        : 'text-[#786C60] hover:text-[#2D1810]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#D97706] flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span className="text-sm font-semibold">
                {language === 'mr' ? 'गोचर विश्लेषण लोड करत आहे...' : 'Loading planetary transit reading...'}
              </span>
            </div>
          ) : horoscope ? (
            <div className="space-y-8">
              {/* General Guidance Quote Card */}
              <div className="bg-[#FFFDF9] border border-[#EAE1D2] rounded-2xl p-6 relative">
                <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider block mb-2">
                  {language === 'mr' ? 'आजचा प्रमुख संदेश' : 'Core Planetary Guidance'}
                </span>
                <p className="text-sm text-[#4A2E18] leading-relaxed italic">
                  &ldquo;{horoscope.generalGuidance}&rdquo;
                </p>
              </div>

              {/* 4 Pillars of Life (Love, Career, Finance, Health) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Love */}
                <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#EAE1D2] space-y-2.5 shadow-2xs">
                  <div className="flex items-center space-x-2 text-[#D97706]">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <h3 className="font-serif text-sm font-bold text-[#2D1810]">
                      {language === 'mr' ? 'प्रेम आणि वैवाहिक जीवन' : 'Love & Relationships'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B5A4E] leading-relaxed">
                    {horoscope.love}
                  </p>
                </div>

                {/* Career */}
                <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#EAE1D2] space-y-2.5 shadow-2xs">
                  <div className="flex items-center space-x-2 text-[#D97706]">
                    <Briefcase className="w-4 h-4 text-[#D97706]" />
                    <h3 className="font-serif text-sm font-bold text-[#2D1810]">
                      {language === 'mr' ? 'करिअर आणि व्यवसाय' : 'Career & Profession'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B5A4E] leading-relaxed">
                    {horoscope.career}
                  </p>
                </div>

                {/* Finance */}
                <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#EAE1D2] space-y-2.5 shadow-2xs">
                  <div className="flex items-center space-x-2 text-[#D97706]">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-serif text-sm font-bold text-[#2D1810]">
                      {language === 'mr' ? 'धन आणि आर्थिक स्थिती' : 'Finance & Prosperity'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B5A4E] leading-relaxed">
                    {horoscope.finance}
                  </p>
                </div>

                {/* Health */}
                <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#EAE1D2] space-y-2.5 shadow-2xs">
                  <div className="flex items-center space-x-2 text-[#D97706]">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <h3 className="font-serif text-sm font-bold text-[#2D1810]">
                      {language === 'mr' ? 'आरोग्य आणि जीवनशक्ती' : 'Health & Vitality'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B5A4E] leading-relaxed">
                    {horoscope.health}
                  </p>
                </div>
              </div>

              {/* Lucky Elements Footer */}
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between text-xs text-[#78350F] gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{language === 'mr' ? 'भाग्यवान क्रमांक:' : 'Lucky Number:'}</span>
                  <strong className="text-base text-[#B45309] font-bold">{formatNumber(horoscope.luckyNumber || 7)}</strong>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{language === 'mr' ? 'भाग्यवान रंग:' : 'Lucky Color:'}</span>
                  <strong className="text-xs text-[#B45309] font-bold">{horoscope.luckyColor || 'Gold'}</strong>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{language === 'mr' ? 'शुभ वेळ:' : 'Auspicious Window:'}</span>
                  <strong className="text-xs text-[#B45309] font-bold">{horoscope.luckyTime || '10:30 AM'}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
