'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateSunSign } from '@/lib/calculator-engine';
import { Sun, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SunSignCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [dob, setDob] = useState('1996-07-25');
  const [result, setResult] = useState<any>(calculateSunSign('1996-07-25'));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    const res = calculateSunSign(dob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Sun Sign Calculator (Vedic Nirayana vs Western Sayana)"
      marathiTitle="सूर्य राशी कॅल्क्युलेटर (निरयन विरूद्ध सायन)"
      subtitle="Discover your true Vedic Surya Rashi calculated with pure Chitrapaksha Lahiri Ayanamsa versus Western tropical solar signs."
      marathiSubtitle="लाहिरी अयनांशानुसार तुमची खरी वैदिक सूर्य राशी आणि पाश्चात्य सायन राशीतील फरक."
      shastraRule="Vedic astrology uses the fixed-star Nirayana system (Chitrapaksha Lahiri), accounting for the 24° axial precession (Ayanamsa) of equinoxes. This causes Western tropical sun signs to differ from authentic Vedic solar signs by nearly one whole constellation."
      marathiShastraRule="पाश्चात्य ज्योतिष सायन पद्धतीवर आधारित आहे, तर वैदिक ज्योतिष स्थिर ताऱ्यांवर (निरयन) आधारित आहे. यात २४ अंशांचा अयनांश फरक असतो."
      icon={<Sun className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Dual System Comparison Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-[#92400E] block mb-1">
                  {isMr ? 'वैदिक निरयन सूर्य राशी' : 'Vedic Nirayana Surya Rashi'}
                </span>
                <span className="font-serif text-2xl font-extrabold text-[#D97706] block">
                  {result.siderealSign}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {isMr ? 'खरा खगोलीय तारा संच' : 'Fixed Star Constellation'}
                </span>
              </div>

              <div className="bg-[#FAF7F2] border border-[#EAE1D2] p-5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-[#786C60] block mb-1">
                  {isMr ? 'पाश्चात्य सायन सूर्य राशी' : 'Western Tropical Sun Sign'}
                </span>
                <span className="font-serif text-2xl font-extrabold text-[#5C4535] block">
                  {result.tropicalSign}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {isMr ? 'ऋतु चक्रावर आधारित' : 'Seasonal Solstice System'}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#EAE1D2] p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#92400E]">
                <span>{isMr ? 'अयनांश फरक:' : 'Precession Shift (Ayanamsa):'}</span>
                <span className="font-mono text-[#D97706]">{result.ayanamsaDifference}</span>
              </div>
              <p className="text-[#786C60] leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'जन्म तारीख प्रविष्ट करा' : 'Enter Date of Birth'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'जन्म तारीख' : 'Date of Birth'}</label>
          <input
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'सूर्य राशी काढा' : 'Calculate Sun Sign'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
