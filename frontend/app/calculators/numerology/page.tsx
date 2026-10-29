'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateNumerology } from '@/lib/calculator-engine';
import { Calculator, Sparkles, Gem, Sun } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NumerologyCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [name, setName] = useState('Aarav Sharma');
  const [dob, setDob] = useState('1995-08-15');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;
    const res = calculateNumerology(name.trim(), dob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Numerology Calculator (Sankhya Shastra)"
      marathiTitle="संख्याशास्त्र (न्यूमरोलॉजी) कॅल्क्युलेटर"
      subtitle="Computes your core Life Path, Destiny, Soul Urge, Birthday number, and ruling cosmic planet."
      marathiSubtitle="मूलांक, भाग्यांक, नामांक, आत्मांक आणि अनुकूल रत्न व वाराची परिपूर्ण माहिती."
      shastraRule="Calculates core vibration matrices using classical Chaldean alphabet values and Pythagorean reduction, preserving master numbers (11, 22, 33) where spiritually applicable."
      marathiShastraRule="प्राचीन काल्डियन मूल्यांवर आधारित नावाचे कंपन आणि जन्म तारखेवरून मूलांक व भाग्यांक काढले जातात."
      icon={<Calculator className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Core Numbers 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D2]">
                <span className="text-[10px] uppercase font-bold text-[#786C60] block">
                  {isMr ? 'भाग्यांक (Life Path)' : 'Life Path Number'}
                </span>
                <span className="font-serif text-3xl font-extrabold text-[#D97706] block my-1">
                  {result.lifePath}
                </span>
                <span className="text-[10px] text-gray-500">{isMr ? 'जीवनाचा मुख्य मार्ग' : 'Core Life Trajectory'}</span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D2]">
                <span className="text-[10px] uppercase font-bold text-[#786C60] block">
                  {isMr ? 'नामांक (Destiny)' : 'Destiny / Expression'}
                </span>
                <span className="font-serif text-3xl font-extrabold text-[#92400E] block my-1">
                  {result.destinyNumber}
                </span>
                <span className="text-[10px] text-gray-500">{isMr ? 'नैसर्गिक क्षमता' : 'Natural Talents'}</span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D2]">
                <span className="text-[10px] uppercase font-bold text-[#786C60] block">
                  {isMr ? 'आत्मांक (Soul Urge)' : 'Soul Urge (Heart)'}
                </span>
                <span className="font-serif text-3xl font-extrabold text-[#B45309] block my-1">
                  {result.soulUrgeNumber}
                </span>
                <span className="text-[10px] text-gray-500">{isMr ? 'आंतरिक इच्छा' : 'Inner Desires'}</span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D2]">
                <span className="text-[10px] uppercase font-bold text-[#786C60] block">
                  {isMr ? 'मूलांक (Driver)' : 'Birth Day / Driver'}
                </span>
                <span className="font-serif text-3xl font-extrabold text-[#D97706] block my-1">
                  {result.birthDayNumber}
                </span>
                <span className="text-[10px] text-gray-500">{isMr ? 'व्यक्तिमत्व' : 'Day of Birth'}</span>
              </div>
            </div>

            {/* Planetary Alignments */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-[#92400E] uppercase tracking-wider flex items-center space-x-1.5">
                <Sun className="w-4 h-4 text-[#D97706]" />
                <span>{isMr ? 'अनुकूल ग्रह व रत्न' : 'Cosmic Ruler & Beneficial Alignments'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#FDE68A]">
                  <span className="text-[10px] text-gray-500 block">{isMr ? 'स्वामी ग्रह' : 'Ruling Graha'}</span>
                  <strong className="text-[#2D1810]">{result.rulingPlanet}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#FDE68A]">
                  <span className="text-[10px] text-gray-500 block">{isMr ? 'अनुकूल रत्न' : 'Auspicious Gem'}</span>
                  <strong className="text-[#2D1810]">{result.gemstone}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#FDE68A]">
                  <span className="text-[10px] text-gray-500 block">{isMr ? 'शुभ वार' : 'Lucky Day'}</span>
                  <strong className="text-[#2D1810]">{result.luckyDay}</strong>
                </div>
              </div>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'तुमची माहिती भरा' : 'Enter Details'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'पूर्ण नाव (शासकीय कागदपत्रांप्रमाणे)' : 'Full Name (as per documents)'}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'जन्म तारीख (Date of Birth)' : 'Date of Birth'}
          </label>
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
          <span>{isMr ? 'संख्याशास्त्र विश्लेषण करा' : 'Calculate Numbers'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
