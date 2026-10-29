'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateVimshottariDasha } from '@/lib/calculator-engine';
import { Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DashaCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [dob, setDob] = useState('1994-11-22');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    const res = calculateVimshottariDasha(dob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Vimshottari Dasha Calculator"
      marathiTitle="विंशोत्तरी महादशा कॅल्क्युलेटर"
      subtitle="Complete 120-year chronological sequence of planetary Mahadashas and your active governing period."
      marathiSubtitle="जन्म नक्षत्रावर आधारित १२० वर्षांचे महादशा चक्र आणि सध्या कार्यरत असणारा महादशा कालखंड."
      shastraRule="Vimshottari Dasha (120 years) is the paramount timing system taught in Brihat Parasara Hora Sastra. The cycle starts based on the exact balance of the birth Nakshatra Lord at the time of birth and follows a strict planetary sequence: Ketu (7y), Venus (20y), Sun (6y), Moon (10y), Mars (7y), Rahu (18y), Jupiter (16y), Saturn (19y), Mercury (17y)."
      marathiShastraRule="विंशोत्तरी दशा ही पराशरोक्त १२० वर्षांची महादशा पद्धत आहे. जन्म नक्षत्राच्या उरलेल्या दशा भोगावरून आयुष्यातील ग्रह महादशांचा क्रम ठरतो."
      icon={<Layers className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Active Period Card */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-[#92400E] tracking-wider block mb-1">
                {isMr ? 'सध्या कार्यरत महादशा (Current Active Period)' : 'Currently Active Mahadasha'}
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-[#D97706]">
                {result.activePeriod.planet} Mahadasha
              </h2>
              <p className="text-xs text-[#785D46] mt-1 font-semibold">
                {result.activePeriod.startYear} — {result.activePeriod.endYear} ({result.activePeriod.durationYears} Years)
              </p>
            </div>

            {/* Birth Balance Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'जन्म नक्षत्र' : 'Birth Nakshatra'}</span>
                <strong className="text-sm text-[#2D1810]">{result.nakshatra}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'जन्मवेळची शिल्लक दशा' : 'Balance at Birth'}</span>
                <strong className="text-sm text-[#2D1810]">{result.balanceLord} ({result.balanceYears}y)</strong>
              </div>
            </div>

            {/* 9 Mahadasha Chronological Table */}
            <div>
              <h4 className="text-xs font-bold text-[#5C4535] uppercase tracking-wider mb-2">
                {isMr ? '१२० वर्षांचा महादशा कालक्रम' : '120-Year Timeline Sequence'}
              </h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {result.periods.map((p: any, idx: number) => {
                  const isActive = p.status.includes('Active');
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                        isActive
                          ? 'bg-[#FFFBEB] border-[#F59E0B] font-bold text-[#92400E] shadow-sm'
                          : 'bg-white border-[#EAE1D2] text-[#4A2E18]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[10px] text-gray-500 font-mono">
                          {idx + 1}
                        </span>
                        <span>{p.planet}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[11px] text-gray-500">{p.startYear} - {p.endYear}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isActive
                              ? 'bg-[#F59E0B] text-white'
                              : p.status === 'Past'
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
          <span>{isMr ? 'दशा कालक्रम काढा' : 'Calculate Vimshottari Dasha'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
