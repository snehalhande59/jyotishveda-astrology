'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Horoscope } from '@/lib/types';
import { Sparkles, Calendar, Heart, Briefcase, DollarSign, Activity, ShieldAlert } from 'lucide-react';

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
          // Comprehensive fallback content if not yet entered in Strapi
          setHoroscope({
            id: 0,
            sign: selectedSign,
            date: new Date().toISOString().split('T')[0],
            period,
            generalGuidance: `Today, the Moon activates your natural solar alignment, bringing renewed mental clarity and emotional composure. Favorable cosmic winds support diplomatic discussions and focused study. Avoid hasty reactions during evening twilight hours.`,
            love: `Venus creates harmonious aspects, fostering deep and affectionate conversations with your partner. Singles may find engaging rapport through creative or philosophical communities.`,
            career: `Mercury sharpens analytical execution. Your strategic input will be appreciated in collaborative team endeavors. Focus on wrapping up pending documentation.`,
            finance: `Steady financial influences prevail. Favorable day for budgeting and consolidating long-term savings, while exercising caution with speculative intraday bets.`,
            health: `Vitality remains strong. Support your physical well-being through adequate hydration and a grounding 10-minute evening walk or meditation.`,
            luckyNumber: 7,
            luckyColor: 'Royal Saffron & Gold',
            luckyTime: '10:30 AM - 12:00 PM',
          });
        }
      } catch (e) {
        console.warn('Horoscope load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHoroscope();
  }, [selectedSign, period]);

  const activeSignInfo = ZODIAC_SIGNS.find((z) => z.name === selectedSign) || ZODIAC_SIGNS[0];

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Celestial Transits (Gochara)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Daily Vedic Horoscope (Rashifal)
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5]">
            Advisory planetary perspectives for all 12 rashis to harmonize your daily activities.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Sign Selection Carousel / Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = sign.name === selectedSign;
            return (
              <button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#150D2A] border-[#D4AF37] text-[#FDFBF7] shadow-gold scale-105'
                    : 'bg-white border-[#D4AF37]/20 hover:border-[#D4AF37] text-gray-700'
                }`}
              >
                <span className="text-2xl block mb-1">{sign.symbol}</span>
                <span className="text-xs font-bold block">{sign.name}</span>
                <span className="text-[9px] text-[#8C6D1F] block">{sign.sanskrit}</span>
              </button>
            );
          })}
        </div>

        {/* Period Selector Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-[#150D2A] p-1.5 rounded-2xl border border-[#D4AF37]/30 text-xs">
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2 rounded-xl font-serif font-bold capitalize transition-all ${
                  period === p
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] shadow-sm'
                    : 'text-[#D8C7A5] hover:text-[#FDFBF7]'
                }`}
              >
                {p} Horoscope
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sign Horoscope Detail Card */}
        {horoscope && (
          <div className="bg-white rounded-3xl border border-[#D4AF37]/25 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-[#150D2A] border border-[#D4AF37] flex items-center justify-center text-3xl text-[#F7DF94]">
                  {activeSignInfo.symbol}
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#150D2A]">
                    {activeSignInfo.name} ({activeSignInfo.sanskrit})
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeSignInfo.dates} • Guidance for {horoscope.date}
                  </p>
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="bg-[#FAF6F0] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/30">
                  <span className="text-gray-500">Lucky No:</span>{' '}
                  <strong className="text-[#8C6D1F] font-bold">{horoscope.luckyNumber || 7}</strong>
                </div>
                <div className="bg-[#FAF6F0] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/30">
                  <span className="text-gray-500">Lucky Color:</span>{' '}
                  <strong className="text-[#8C6D1F] font-bold">{horoscope.luckyColor || 'Gold'}</strong>
                </div>
                <div className="bg-[#FAF6F0] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/30">
                  <span className="text-gray-500">Auspicious Time:</span>{' '}
                  <strong className="text-[#8C6D1F] font-bold">{horoscope.luckyTime || 'Morning'}</strong>
                </div>
              </div>
            </div>

            {/* General Guidance Section */}
            <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/20 space-y-2">
              <h3 className="font-serif text-base font-bold text-[#150D2A] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#8C6D1F]" />
                <span>Overall Cosmic Guidance</span>
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">{horoscope.generalGuidance}</p>
            </div>

            {/* Life Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#150D2A] flex items-center space-x-2 text-rose-600">
                  <Heart className="w-4 h-4" />
                  <span>Love &amp; Relationships</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{horoscope.love}</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#150D2A] flex items-center space-x-2 text-blue-600">
                  <Briefcase className="w-4 h-4" />
                  <span>Career &amp; Professional Karma</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{horoscope.career}</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#150D2A] flex items-center space-x-2 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Wealth &amp; Financial Prudence</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{horoscope.finance}</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#150D2A] flex items-center space-x-2 text-purple-600">
                  <Activity className="w-4 h-4" />
                  <span>Health &amp; Inner Equilibrium</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{horoscope.health}</p>
              </div>
            </div>

            {/* Ethical Disclaimer */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Advisory Notice:</strong> General horoscopes indicate collective transit tendencies (Gochara) for the zodiac sign. For precise personal forecasting, generate a complete personalized Kundli using your exact birth time, latitude, and longitude.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
