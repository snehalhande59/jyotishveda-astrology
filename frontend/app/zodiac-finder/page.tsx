'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ZodiacSign } from '@/lib/types';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import { Sparkles, Sun, Moon, ShieldCheck, Heart, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ZodiacFinderPage() {
  const { language } = useLanguage();
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
    traits: 'Dynamic, courageous, pioneering, and passionate energy.',
    strengths: ['Courageous', 'Determined', 'Confident', 'Enthusiastic'],
    weaknesses: ['Impatient', 'Moody', 'Short-tempered', 'Impulsive'],
    compatibleSigns: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'चंद्र राशी विरूद्ध सूर्य राशी' : 'Chandra Rashi vs. Surya Rashi'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'वैदिक राशी शोधक' : 'Vedic Zodiac Sign (Rashi) Finder'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'वैदिक ज्योतिषात आपली चंद्र राशी (Chandra Rashi) मन, भावना आणि जीवन प्रवासाचे नियमन करते. आपली खरी राशी शोधा.'
              : 'In Vedic astrology, your Moon sign (Chandra Rashi) governs the mind, instincts, and soul destiny. Find your exact sidereal sign.'}
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
              buttonText={language === 'mr' ? 'माझी वैदिक राशी शोधा' : 'Find My Vedic Zodiac Signs'}
            />
          </div>

          {/* Result Card or Introduction */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-white text-[#2D1810] p-6 sm:p-8 rounded-2xl border-2 border-[#D97706] shadow-md space-y-6">
                <span className="text-[10px] uppercase font-bold text-[#B45309] tracking-wider block">
                  {language === 'mr' ? 'निरयन खगोलीय गणना' : 'Sidereal Astrological Calculation'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2D1810]">
                  {language === 'mr' ? 'आपली वैदिक ग्रह रूपरेषा' : 'Your Vedic Cosmic Profile'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#EAE1D2] text-center">
                    <Moon className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
                    <span className="text-[10px] text-[#786C60] block">{language === 'mr' ? 'चंद्र राशी' : 'Moon Sign (Rashi)'}</span>
                    <strong className="text-base text-[#2D1810] block">{result.moonSign.signName}</strong>
                    <span className="text-[10px] text-[#D97706] font-mono">{result.moonSign.degreeFormatted}</span>
                  </div>

                  <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#EAE1D2] text-center">
                    <Sun className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
                    <span className="text-[10px] text-[#786C60] block">{language === 'mr' ? 'सूर्य राशी' : 'Sun Sign (Surya)'}</span>
                    <strong className="text-base text-[#2D1810] block">{result.sunSign.signName}</strong>
                    <span className="text-[10px] text-[#D97706] font-mono">{result.sunSign.degreeFormatted}</span>
                  </div>

                  <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#EAE1D2] text-center">
                    <Zap className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
                    <span className="text-[10px] text-[#786C60] block">{language === 'mr' ? 'लग्न राशी' : 'Ascendant (Lagna)'}</span>
                    <strong className="text-base text-[#2D1810] block">{result.ascendant.signName}</strong>
                    <span className="text-[10px] text-[#D97706] font-mono">{result.ascendant.degreeFormatted}</span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE1D2] text-xs text-[#5C4033] leading-relaxed space-y-2">
                  <p>
                    <strong>{language === 'mr' ? 'ज्योतिषात चंद्र राशीचे प्राधान्य का:' : 'Why Moon Sign Dominates in Jyotish:'}</strong>{' '}
                    {language === 'mr'
                      ? 'प्राचीन भारतात ऋषींनी ओळखले की चंद्र संपूर्ण राशीचक्र २७.३ दिवसांत पूर्ण करतो आणि प्रत्येक राशीत सुमारे सव्वादोन दिवस राहतो. चंद्र मनाचे (मानस), भावनांचे आणि आकलनाचे नियमन करतो.'
                      : 'In ancient India, sages recognized that the Moon moves through the entire zodiac in 27.3 days, staying in each sign for roughly 2.25 days. The Moon governs the subconscious mind (Manas), emotional temperament, and perceptual filters.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#2D1810]">
                  {language === 'mr' ? 'पाश्चात्त्य सूर्य राशी विरूद्ध वैदिक चंद्र राशी' : 'Western Sun Sign vs. Vedic Moon Sign'}
                </h3>
                <p className="text-xs text-[#786C60] leading-relaxed">
                  {language === 'mr'
                    ? 'पाश्चात्त्य कुंडलीत लोक सहसा फक्त सूर्य राशी ओळखतात. वैदिक ज्योतिष २४ अंशांच्या लाहिरी अयनांशाचा समावेश करत असल्याने, आपली वैदिक चंद्र राशी पाश्चात्त्य राशीपेक्षा सामान्यतः एक राशी मागे असते.'
                    : 'In Western horoscopes, people typically only know their Sun sign. Because Vedic astrology incorporates the 24-degree Lahiri Ayanamsa, your Vedic Moon sign is often one sign earlier than what Western astrology presents.'}
                </p>
                <div className="p-4 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] text-xs text-[#92400E]">
                  {language === 'mr'
                    ? 'आपली अचूक चंद्र राशी पडताळण्यासाठी डावीकडील फॉर्ममध्ये जन्म वेळ व शहर प्रविष्ट करा.'
                    : 'Enter your birth time and city on the left to verify your precise Chandra Rashi.'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 12 Signs Exploration Directory */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2D1810]">
              {language === 'mr' ? '१२ वैदिक राशींची माहिती' : 'Explore the 12 Vedic Rashis'}
            </h3>
            <p className="text-xs text-[#786C60] mt-1">
              {language === 'mr'
                ? 'खालीलपैकी कोणतीही राशी निवडून तिचे घटक, स्वामी ग्रह, सामर्थ्य आणि सुसंगतता तपासा.'
                : 'Select any sign below to inspect its governing element, ruling planet, strengths, and compatibility.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pb-4 border-b border-[#EAE1D2]">
            {signs.length > 0
              ? signs.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setActiveSignTab(s.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSignTab === s.name
                        ? 'bg-[#D97706] text-white shadow-sm border border-[#D97706]'
                        : 'bg-[#FAF7F2] text-[#5C4033] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    {s.name} ({s.sanskritName})
                  </button>
                ))
              : ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setActiveSignTab(name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSignTab === name
                        ? 'bg-[#D97706] text-white shadow-sm border border-[#D97706]'
                        : 'bg-[#FAF7F2] text-[#5C4033] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    {name}
                  </button>
                ))}
          </div>

          {/* Active Sign Detailed Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] space-y-3">
              <span className="text-[10px] text-[#786C60] uppercase font-bold tracking-wider">{language === 'mr' ? 'राशी सारांश' : 'Sign Overview'}</span>
              <h4 className="font-serif text-xl font-bold text-[#2D1810]">
                {selectedSignDetails.name} ({selectedSignDetails.sanskritName})
              </h4>
              <p className="text-xs text-[#786C60] leading-relaxed">{selectedSignDetails.traits}</p>
              <div className="pt-2 text-xs text-[#5C4033] space-y-1">
                <div><strong>Element:</strong> {selectedSignDetails.element}</div>
                <div><strong>Ruler:</strong> {selectedSignDetails.ruler}</div>
                <div><strong>Symbol:</strong> {selectedSignDetails.symbol}</div>
              </div>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] space-y-3">
              <span className="text-[10px] text-[#786C60] uppercase font-bold tracking-wider">{language === 'mr' ? 'प्रमुख सामर्थ्य' : 'Core Strengths'}</span>
              <ul className="space-y-1.5 text-xs text-[#5C4033]">
                {selectedSignDetails.strengths?.map((str, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
              <span className="text-[10px] text-[#786C60] uppercase font-bold tracking-wider block pt-3">{language === 'mr' ? 'सावधगिरी' : 'Challenges to Balance'}</span>
              <ul className="space-y-1 text-xs text-[#5C4033]">
                {selectedSignDetails.weaknesses?.map((w, i) => (
                  <li key={i} className="text-rose-600">• {w}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] space-y-3">
              <span className="text-[10px] text-[#786C60] uppercase font-bold tracking-wider">{language === 'mr' ? 'सुसंगतता' : 'Compatibility'}</span>
              <div className="flex items-center space-x-2 text-[#92400E] font-semibold text-xs">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{language === 'mr' ? 'सर्वात सुसंगत राशी:' : 'Most Harmonious With:'}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedSignDetails.compatibleSigns?.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-[#EAE1D2] rounded-lg text-xs font-bold text-[#2D1810]">
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