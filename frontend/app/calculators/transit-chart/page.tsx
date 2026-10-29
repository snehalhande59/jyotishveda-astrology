'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateTransits, ZODIAC_SIGNS } from '@/lib/calculator-engine';
import { Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TransitChartCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [lagnaId, setLagnaId] = useState(1); // Aries
  const [result, setResult] = useState<any>(calculateTransits(1));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateTransits(Number(lagnaId));
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Transit Chart (Gochara) Calculator"
      marathiTitle="गोचर कुंडली (ग्रह भ्रमण) कॅल्क्युलेटर"
      subtitle="Examines real-time celestial planetary transits across 12 houses relative to your natal Lagna."
      marathiSubtitle="सध्याचे ग्रहांचे गोचर भ्रमण आणि तुमच्या जन्म लग्नावरील भाव प्रभाव."
      shastraRule="Gochara (planetary transits) represents the dynamic cosmic weather affecting your natal potential. Benefic Jupiter transiting Kendras/Trikonas confers expansion, while Saturn and Rahu transits stimulate karmic discipline and structural realignment."
      marathiShastraRule="गोचर म्हणजे आकाशात सध्या भ्रमण करत असलेल्या ग्रहांची स्थिती. जन्म लग्नावरून हे ग्रह कोणत्या भावात भ्रमण करत आहेत त्यानुसार शुभ-अशुभ फळे मिळतात."
      icon={<Compass className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center pb-4 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'लग्न संदर्भ' : 'Lagna Reference'}
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-[#2D1810]">
                {result.natalLagna} Lagna Gochara
              </h2>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {result.transitPlanets.map((tp: any) => (
                <div
                  key={tp.name}
                  className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE1D2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#2D1810] text-sm w-20">{tp.name}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#EAE1D2] text-[11px] text-[#785D46]">
                      {tp.signName} ({tp.deg}°)
                    </span>
                    {tp.isRetrograde && (
                      <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                        [R]
                      </span>
                    )}
                  </div>
                  <div className="text-right sm:text-left">
                    <span className="font-bold text-[#92400E] block">House {tp.houseFromLagna}</span>
                    <span className="text-[11px] text-gray-500">{tp.effect}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'तुमची लग्न राशी निवडा' : 'Select Your Natal Lagna'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'जन्म लग्न राशी' : 'Natal Ascendant (Lagna)'}
          </label>
          <select
            value={lagnaId}
            onChange={(e) => setLagnaId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          >
            {ZODIAC_SIGNS.map((s) => (
              <option key={s.id} value={s.id}>{s.id}. {s.name} ({s.sanskrit})</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'गोचर विश्लेषण पहा' : 'Compute Transits'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
