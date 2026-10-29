'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateKaalSarpDosh } from '@/lib/calculator-engine';
import { Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function KaalSarpDoshCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [rahuHouse, setRahuHouse] = useState(1);
  const samplePlanets = [
    { name: 'Sun', house: 2 },
    { name: 'Moon', house: 3 },
    { name: 'Mars', house: 4 },
    { name: 'Mercury', house: 2 },
    { name: 'Jupiter', house: 5 },
    { name: 'Venus', house: 6 },
    { name: 'Saturn', house: 5 },
  ];

  const [result, setResult] = useState<any>(calculateKaalSarpDosh(1, samplePlanets));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateKaalSarpDosh(Number(rahuHouse), samplePlanets);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Kaal Sarp Dosh Calculator"
      marathiTitle="कालसर्प दोष कॅल्क्युलेटर"
      subtitle="Evaluates whether 7 classical planets are hemmed between Rahu and Ketu across 12 distinct Kaal Sarp varieties."
      marathiSubtitle="राहु-केतू अक्षावर आधारित १२ प्रकारच्या कालसर्प दोषांचे सखोल विश्लेषण व प्रभावी उपाय."
      shastraRule="Kaal Sarp Dosh occurs when all 7 physical planets (Sun through Saturn) are trapped on one side of the celestial Rahu-Ketu nodal axis. The specific house placement of Rahu defines which of the 12 varieties is active (e.g., Anant in 1st, Kulik in 2nd, Vasuki in 3rd)."
      marathiShastraRule="जेव्हा कुंडलीतील सातही ग्रह राहु आणि केतूच्या मध्ये एकाच बाजूला येतात, तेव्हा कालसर्प योग निर्माण होतो. राहुच्या स्थानावरून १२ विविध प्रकार ठरतात."
      icon={<Shield className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Status Card */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-[#92400E] tracking-wider block mb-1">
                {isMr ? 'दोष स्थिती' : 'Dosha Assessment'}
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-[#D97706]">
                {result.status}
              </h2>
              <p className="text-xs text-[#785D46] mt-1 font-semibold">
                {result.varietyName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'राहु स्थान' : 'Rahu House'}</span>
                <strong className="text-sm text-[#2D1810]">House {result.rahuHouse}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'केतू स्थान' : 'Ketu House'}</span>
                <strong className="text-sm text-[#2D1810]">House {result.ketuHouse}</strong>
              </div>
            </div>

            <div className="bg-white border border-[#EAE1D2] p-4 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-[#92400E] block">{isMr ? 'प्रभावाचे क्षेत्र:' : 'Sphere of Influence:'}</span>
              <p className="text-[#786C60] leading-relaxed">{result.impact}</p>
            </div>

            {/* Remedies */}
            <div className="bg-[#FFFDF9] border border-[#EAE1D2] p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>{isMr ? 'प्रभावी शांती उपाय' : 'Vedic Remedies'}</span>
              </span>
              <ul className="text-xs text-[#785D46] space-y-1 list-disc pl-4">
                {result.remedies.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'राहुचे भाव स्थान निवडा' : 'Select Rahu Placement'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'कुंडलीत राहु कितव्या स्थानात (भावात) आहे?' : 'Rahu House in Chart (1 to 12)'}
          </label>
          <select
            value={rahuHouse}
            onChange={(e) => setRahuHouse(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
              <option key={h} value={h}>House {h} (1st house to 12th house)</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>{isMr ? 'कालसर्प दोष तपासा' : 'Check Kaal Sarp Dosh'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
