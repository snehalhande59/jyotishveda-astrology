'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateLoShuGrid } from '@/lib/calculator-engine';
import { Grid, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoShuGridCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [dob, setDob] = useState('1994-07-28');
  const [result, setResult] = useState<any>(calculateLoShuGrid('1994-07-28'));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    const res = calculateLoShuGrid(dob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Lo Shu Grid Calculator (3x3 Magic Square)"
      marathiTitle="लो शू ग्रिड कॅल्क्युलेटर (३x३ जादुई चौकोन)"
      subtitle="Maps your birth date digits into the sacred 3x3 Magic Square to analyze Mental, Emotional, and Practical planes."
      marathiSubtitle="जन्म तारखेच्या अंकांची ३x३ च्या जादुई चौकोनात मांडणी करून मानसिक, भावनिक व कृती योगांचे विश्लेषण."
      shastraRule="The ancient Lo Shu Grid sums to 15 along all rows, columns, and diagonals. By plotting your birth date along with your Driver (Mulank) and Conductor (Bhagyank) numbers, it identifies complete planes (Arrows of Strength) and missing energy frequencies."
      marathiShastraRule="लो शू ग्रिडमधील प्रत्येक ओळ व स्तंभाची बेरीज १५ येते. या ग्रिडमधील पूर्ण झालेले बाण (Arrows) तुमच्या बलस्थानांना दर्शवतात."
      icon={<Grid className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* 3x3 Grid Visual */}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider block text-center mb-2">
                {isMr ? 'तुमचा लो शू ३x३ ग्रिड आलेख' : 'Your 3x3 Lo Shu Energy Matrix'}
              </span>
              <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto p-3 bg-[#FAF7F2] rounded-2xl border-2 border-[#D97706]/40 shadow-inner">
                {result.grid.map((row: string[], rIdx: number) =>
                  row.map((cell: string, cIdx: number) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`h-16 rounded-xl flex items-center justify-center font-serif text-lg font-bold border transition-all ${
                        cell !== '-'
                          ? 'bg-white text-[#D97706] border-[#F59E0B] shadow-sm'
                          : 'bg-[#FAF7F2] text-gray-300 border-[#EAE1D2]'
                      }`}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Driver & Conductor */}
            <div className="grid grid-cols-2 gap-3 text-xs text-center">
              <div className="bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A]">
                <span className="text-gray-500 block">{isMr ? 'मूलांक (Driver)' : 'Driver (Mulank)'}</span>
                <strong className="text-lg text-[#D97706]">{result.driver}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'भाग्यांक (Conductor)' : 'Conductor (Bhagyank)'}</span>
                <strong className="text-lg text-[#92400E]">{result.conductor}</strong>
              </div>
            </div>

            {/* Complete / Partial Planes */}
            <div>
              <h4 className="text-xs font-bold text-[#5C4535] uppercase tracking-wider mb-2">
                {isMr ? 'ग्रिडमधील योग (Planes of Strength)' : 'Planes & Arrows Analysis'}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {result.planes.map((p: any) => (
                  <div key={p.name} className="p-2 bg-white rounded-xl border border-[#EAE1D2] flex justify-between items-center">
                    <span className="text-[#2D1810] font-medium truncate pr-1">{p.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'Strong' || p.status === 'Complete'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Numbers */}
            {result.missingNumbers.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#EAE1D2] p-3 rounded-xl text-xs">
                <span className="text-gray-500 block mb-1">
                  {isMr ? 'अनुपस्थित अंक (कमतरता):' : 'Missing Numbers (Growth Areas):'}
                </span>
                <div className="flex items-center space-x-1.5">
                  {result.missingNumbers.map((num: number) => (
                    <span key={num} className="w-6 h-6 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold flex items-center justify-center text-xs">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'जन्म तारीख निवडा' : 'Enter Date of Birth'}
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
          <span>{isMr ? 'लो शू ग्रिड काढा' : 'Generate Lo Shu Grid'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
