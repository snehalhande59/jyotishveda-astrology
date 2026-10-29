'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateMoonPhase } from '@/lib/calculator-engine';
import { Moon, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MoonPhaseCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(calculateMoonPhase());

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    const res = calculateMoonPhase(date);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Moon Phase & Tithi Calculator"
      marathiTitle="चंद्र कला व तिथी कॅल्क्युलेटर"
      subtitle="Calculates lunar illumination percentage, Shukla/Krishna Paksha, and authentic Vedic Tithi."
      marathiSubtitle="चंद्राची प्रकाशमानता टक्केवारी, शुक्ल/कृष्ण पक्ष आणि तिथी गणना."
      shastraRule="Vedic Lunar months are divided into 30 Tithis across two Pakshas (Shukla and Krishna). The synodic lunar period is 29.530588 days. Each Tithi represents a 12-degree longitudinal separation between the Sun and Moon."
      marathiShastraRule="सूर्य आणि चंद्राच्या दरम्यान १२ अंशांच्या अंतराने एक तिथी बनते. एका चांद्रमासात शुक्ल व कृष्ण पक्षाच्या मिळून ३० तिथी असतात."
      icon={<Moon className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Visual Moon Illumination Card */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-6 rounded-2xl text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-tr from-[#2D1810] via-[#5C4535] to-[#FEF3C7] flex items-center justify-center shadow-inner border-2 border-[#D97706]/40">
                <Moon className="w-10 h-10 text-[#FEF3C7]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-[#92400E] tracking-wider block mb-1">
                {result.phaseName}
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-[#D97706]">
                {result.illumination}% {isMr ? 'प्रकाशित' : 'Illuminated'}
              </h2>
            </div>

            {/* Paksha & Tithi Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'पक्ष (Paksha)' : 'Lunar Fortnight'}</span>
                <strong className="text-sm text-[#2D1810]">{result.paksha}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'तिथी नाव' : 'Vedic Tithi'}</span>
                <strong className="text-sm text-[#2D1810]">{result.tithiName}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'चांद्र चक्र दिवस' : 'Cycle Progress'}</span>
                <strong className="text-sm text-[#2D1810]">{result.phaseDays} / 29.5 Days</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'शुभ कार्य मुहूर्त' : 'Auspicious Timing'}</span>
                <strong className="text-sm text-[#16A34A] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{result.isAuspiciousForNewBeginnings ? (isMr ? 'शुभ मुहूर्त' : 'Favorable') : (isMr ? 'सावधगिरी' : 'Neutral')}</span>
                </strong>
              </div>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'तारीख निवडा' : 'Select Target Date'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'तारीख' : 'Date'}</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'चंद्र कला काढा' : 'Calculate Moon Phase'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
