'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateRashiAndNakshatra } from '@/lib/calculator-engine';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NakshatraCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [dob, setDob] = useState('1995-10-18');
  const [tob, setTob] = useState('09:45');
  const [result, setResult] = useState<any>(calculateRashiAndNakshatra('1995-10-18', '09:45'));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !tob) return;
    const res = calculateRashiAndNakshatra(dob, tob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Nakshatra & Pada Calculator"
      marathiTitle="जन्म नक्षत्र व चरण कॅल्क्युलेटर"
      subtitle="Discover your authentic Vedic birth star constellation (out of 27), pada (1 to 4), and ruling deity."
      marathiSubtitle="२७ नक्षत्रांपैकी तुमचे अचूक जन्म नक्षत्र, चरण (१ ते ४) आणि स्वामी ग्रह."
      shastraRule="The 360-degree zodiac belt is partitioned into 27 equal lunar mansions (Nakshatras), each spanning 13° 20'. Each Nakshatra is further subdivided into 4 Padas of 3° 20' each, which form the building blocks of the D-9 Navamsha chart."
      marathiShastraRule="संपूर्ण राशीचक्र २७ नक्षत्रांमध्ये विभागलेले आहे (प्रत्येकी १३° २०'). प्रत्येक नक्षत्राचे ४ चरण (प्रत्येकी ३° २०') असतात, जे नवमांश कुंडलीचा पाया मानले जातात."
      icon={<Sparkles className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center pb-5 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'तुमचे जन्म नक्षत्र' : 'Your Janma Nakshatra'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810] my-2">
                {result.nakshatra}
              </h2>
              <span className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] rounded-full text-xs font-bold">
                {isMr ? 'चरण (Pada)' : 'Quarter'}: Pada {result.pada}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'नक्षत्र स्वामी' : 'Nakshatra Lord'}</span>
                <strong className="text-sm text-[#2D1810]">{result.nakshatraLord}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'चंद्र राशी' : 'Chandra Rashi'}</span>
                <strong className="text-sm text-[#2D1810]">{result.rashi} ({result.rashiSanskrit})</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'राशी स्वामी' : 'Rashi Lord'}</span>
                <strong className="text-sm text-[#2D1810]">{result.rashiLord}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'चंद्र भोग अंश' : 'Moon Longitude'}</span>
                <strong className="text-sm text-[#2D1810]">{result.moonDegree}°</strong>
              </div>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'जन्म तपशील प्रविष्ट करा' : 'Enter Accurate Birth Details'}
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
          <span>{isMr ? 'नक्षत्र व चरण शोधा' : 'Calculate Nakshatra'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
