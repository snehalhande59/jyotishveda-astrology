'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateRashiAndNakshatra } from '@/lib/calculator-engine';
import { Moon, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function RashiCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [dob, setDob] = useState('1997-03-14');
  const [tob, setTob] = useState('14:15');
  const [result, setResult] = useState<any>(calculateRashiAndNakshatra('1997-03-14', '14:15'));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !tob) return;
    const res = calculateRashiAndNakshatra(dob, tob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Chandra Rashi (Moon Sign) Calculator"
      marathiTitle="चंद्र राशी कॅल्क्युलेटर"
      subtitle="Find your true Vedic Janma Rashi determined by the moon's sidereal coordinates at the time of your birth."
      marathiSubtitle="जन्म क्षणी चंद्र ज्या राशीत उपस्थित असतो ती तुमची खरी वैदिक जन्म राशी."
      shastraRule="In Sanatana Jyotish, the Moon represents the mind (Manas), emotional psychology, and karmic memory (Chitta). Your Janma Rashi is the sidereal zodiac constellation through which the Moon was traversing at the exact time and place of birth."
      marathiShastraRule="वेदांग ज्योतिषानुसार चंद्र हा मनाचा कारक आहे. जन्म क्षणी चंद्र ज्या राशीत असतो त्यावरून व्यक्तीचे विचार, स्वभाव आणि मानसिक प्रवृत्ती ठरते."
      icon={<Moon className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center pb-5 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'तुमची खरी वैदिक जन्म राशी' : 'Your Vedic Moon Sign (Janma Rashi)'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810] my-2">
                {result.rashi} ({result.rashiSanskrit})
              </h2>
              <span className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] rounded-full text-xs font-bold">
                {result.degreeInSign}° in {result.rashi}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'राशी स्वामी' : 'Rashi Lord'}</span>
                <strong className="text-sm text-[#2D1810]">{result.rashiLord}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'तत्व (Element)' : 'Element'}</span>
                <strong className="text-sm text-[#2D1810]">{result.element}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'जन्म नक्षत्र' : 'Janma Nakshatra'}</span>
                <strong className="text-sm text-[#2D1810]">{result.nakshatra} (Pada {result.pada})</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'नक्षत्र स्वामी' : 'Nakshatra Lord'}</span>
                <strong className="text-sm text-[#2D1810]">{result.nakshatraLord}</strong>
              </div>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'जन्म वेळ व तारीख प्रविष्ट करा' : 'Enter Birth Details'}
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
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'जन्म वेळ' : 'Time of Birth'}</label>
          <input
            type="time"
            required
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'चंद्र राशी शोधा' : 'Calculate Moon Sign'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
