'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ZodiacSign } from '@/lib/types';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import { Sparkles, Sun, Moon, ShieldCheck, Heart, Zap } from 'lucide-react';

export default function ZodiacFinderPage() {
  const [signs, setSigns] = useState<ZodiacSign[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeSignTab, setActiveSignTab] = useState<string>('Aries');

  useEffect(() => {
    async function loadSigns() {
      try {
        const data = await api.getZodiacSigns();
        if (data && data.length > 0) {
          setSigns(data);
        }
      } catch (e) {
        console.warn('Error loading zodiac signs:', e);
      }
    }
    loadSigns();
  }, []);

  const handleCalculateZodiac = async (formData: BirthFormData) => {
    setLoading(true);
    try {
      const res = await api.generateKundli(formData);
      setResult({
        moonSign: res.chartData.moonSign,
        sunSign: res.chartData.sunSign,
        ascendant: res.chartData.ascendant,
      });
      setActiveSignTab(res.chartData.moonSign.signName);
    } catch (err: any) {
      alert(err.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  const selectedSignDetails = signs.find((s) => s.name === activeSignTab) || {
    name: activeSignTab,
    sanskritName: 'Mesha',
    element: 'Fire' as const,
    ruler: 'Mars',
    symbol: 'Ram',
    dateRange: 'Apr 14 - May 14',
    traits: 'Dynamic, pioneering, courageous, leadership-oriented.',
    strengths: ['Courage', 'Decisiveness', 'Optimism', 'Passion'],
    weaknesses: ['Impatience', 'Short-tempered', 'Impulsive'],
    compatibleSigns: ['Leo', 'Sagittarius', 'Gemini'],
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Chandra Rashi vs. Surya Rashi</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Vedic Zodiac Sign (Rashi) Finder
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto">
            In Vedic astrology, your Moon sign (Chandra Rashi) governs the mind, instincts, and soul destiny. Find your exact sidereal sign.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-5">
            <BirthDetailsForm
              onSubmit={handleCalculateZodiac}
              isLoading={loading}
              buttonText="Find My Vedic Zodiac Signs"
            />
          </div>

          {/* Result Card or Introduction */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-[#150D2A] text-[#FDFBF7] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic space-y-6">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                  Sidereal Astrological Calculation
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#F7DF94]">
                  Your Vedic Cosmic Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#191233] p-4 rounded-xl border border-[#D4AF37]/30 text-center">
                    <Moon className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                    <span className="text-[10px] text-[#D8C7A5] block">Moon Sign (Rashi)</span>
                    <strong className="text-base text-[#FDFBF7] block">{result.moonSign.signName}</strong>
                    <span className="text-[10px] text-[#D4AF37]">{result.moonSign.degreeFormatted}</span>
                  </div>

                  <div className="bg-[#191233] p-4 rounded-xl border border-[#D4AF37]/30 text-center">
                    <Sun className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                    <span className="text-[10px] text-[#D8C7A5] block">Sun Sign (Surya)</span>
                    <strong className="text-base text-[#FDFBF7] block">{result.sunSign.signName}</strong>
                    <span className="text-[10px] text-[#D4AF37]">{result.sunSign.degreeFormatted}</span>
                  </div>

                  <div className="bg-[#191233] p-4 rounded-xl border border-[#D4AF37]/30 text-center">
                    <Zap className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                    <span className="text-[10px] text-[#D8C7A5] block">Ascendant (Lagna)</span>
                    <strong className="text-base text-[#FDFBF7] block">{result.ascendant.signName}</strong>
                    <span className="text-[10px] text-[#D4AF37]">{result.ascendant.degreeFormatted}</span>
                  </div>
                </div>

                <div className="bg-[#0F0B1E] p-5 rounded-2xl border border-[#D4AF37]/20 text-xs text-[#D8C7A5] leading-relaxed space-y-2">
                  <p>
                    <strong>Why Moon Sign Dominates in Jyotish:</strong> In ancient India, sages recognized that the Moon moves through the entire zodiac in 27.3 days, staying in each sign for roughly 2.25 days. The Moon governs the subconscious mind (Manas), emotional temperament, and perceptual filters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 shadow-sm space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#150D2A]">
                  Western Sun Sign vs. Vedic Moon Sign
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  In Western horoscopes, people typically only know their Sun sign. Because Vedic astrology incorporates the 24-degree Lahiri Ayanamsa, your Vedic Moon sign is often <strong>one sign earlier</strong> than what Western astrology presents.
                </p>
                <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20 text-xs text-[#8C6D1F]">
                  Enter your birth time and city on the left to verify your precise Chandra Rashi.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 12 Signs Exploration Directory */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#150D2A]">
              Explore the 12 Vedic Rashis
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select any sign below to inspect its governing element, ruling planet, strengths, and compatibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
            {signs.length > 0
              ? signs.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setActiveSignTab(s.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeSignTab === s.name
                        ? 'bg-[#150D2A] text-[#F7DF94] border border-[#D4AF37]'
                        : 'bg-[#FAF6F0] text-gray-700 hover:bg-[#FAF6F0]/80'
                    }`}
                  >
                    {s.name} ({s.sanskritName})
                  </button>
                ))
              : ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setActiveSignTab(name)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeSignTab === name
                        ? 'bg-[#150D2A] text-[#F7DF94] border border-[#D4AF37]'
                        : 'bg-[#FAF6F0] text-gray-700 hover:bg-[#FAF6F0]/80'
                    }`}
                  >
                    {name}
                  </button>
                ))}
          </div>

          {/* Active Sign Detailed Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/20 space-y-3">
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Sign Overview</span>
              <h4 className="font-serif text-xl font-bold text-[#150D2A]">
                {selectedSignDetails.name} ({selectedSignDetails.sanskritName})
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">{selectedSignDetails.traits}</p>
              <div className="pt-2 text-xs text-gray-600 space-y-1">
                <div><strong>Element:</strong> {selectedSignDetails.element}</div>
                <div><strong>Ruler:</strong> {selectedSignDetails.ruler}</div>
                <div><strong>Symbol:</strong> {selectedSignDetails.symbol}</div>
              </div>
            </div>

            <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/20 space-y-3">
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Core Strengths</span>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {selectedSignDetails.strengths?.map((str, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block pt-3">Challenges to Balance</span>
              <ul className="space-y-1 text-xs text-gray-700">
                {selectedSignDetails.weaknesses?.map((w, i) => (
                  <li key={i} className="text-rose-600">• {w}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/20 space-y-3">
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Compatibility</span>
              <div className="flex items-center space-x-2 text-[#8C6D1F] font-semibold text-xs">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Most Harmonious With:</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedSignDetails.compatibleSigns?.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-[#D4AF37]/30 rounded-lg text-xs font-medium text-[#150D2A]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
