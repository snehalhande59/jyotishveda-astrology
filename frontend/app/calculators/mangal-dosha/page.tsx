'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateMangalDosha, ZODIAC_SIGNS } from '@/lib/calculator-engine';
import { Shield, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MangalDoshaCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [lagnaId, setLagnaId] = useState(1); // Aries
  const [marsId, setMarsId] = useState(7); // Libra
  const [moonId, setMoonId] = useState(4); // Cancer
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateMangalDosha(Number(lagnaId), Number(marsId), Number(moonId));
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Mangal Dosha (Kuja Dosha) Calculator"
      marathiTitle="मंगळ दोष (भौम दोष) कॅल्क्युलेटर"
      subtitle="Evaluates Mars placement in 1st, 2nd, 4th, 7th, 8th, and 12th houses with authentic Parashari cancellation rules."
      marathiSubtitle="लग्न व चंद्रापासून १, २, ४, ७, ८, १२ व्या स्थानातील मंगळाची स्थिती आणि शास्त्रीय अपवाद व परिहार नियमांची तपासणी."
      shastraRule="Kuja Dosha arises when Mars occupies the Tanu (1st), Dhana (2nd), Sukha (4th), Kalatra (7th), Ayu (8th), or Vyaya (12th) houses from Lagna or Chandra. Brihat Parasara Hora Sastra details specific cancellations (e.g., Mars in Aries 1st, Mars in Capricorn, or aspected by Jupiter) which effectively dissolve or soften the affliction."
      marathiShastraRule="मंगळ लग्न किंवा चंद्रावरून १, २, ४, ७, ८ किंवा १२ व्या स्थानी असेल तर मंगळ दोष मानला जातो. परंतु स्वराशीत (मेष/वृश्चिक), उच्च राशीत (मकर) असल्यास दोषाचा परिहार होतो."
      icon={<Shield className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Status Header */}
            <div className="text-center pb-5 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'मंगळ दोष स्थिती' : 'Mangal Dosha Status'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold my-2 text-[#2D1810]">
                {result.status}
              </h2>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                <span>{isMr ? 'तीव्रता:' : 'Dosha Intensity:'} {result.percentage}%</span>
              </div>
            </div>

            {/* Placement Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'लग्नापासून स्थान' : 'House from Lagna'}</span>
                <strong className="text-sm text-[#2D1810]">House {result.houseFromLagna}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'चंद्रापासून स्थान' : 'House from Moon'}</span>
                <strong className="text-sm text-[#2D1810]">House {result.houseFromMoon}</strong>
              </div>
            </div>

            {/* Cancellation Exemptions */}
            {result.cancellations && result.cancellations.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isMr ? 'शास्त्रीय परिहार / अपवाद लागू' : 'Classical Cancellations Applied'}</span>
                </span>
                <ul className="text-xs text-emerald-900 space-y-1 list-disc pl-4">
                  {result.cancellations.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Remedies */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>{isMr ? 'प्रभावी वैदिक उपाय' : 'Vedic Remedies'}</span>
              </span>
              <ul className="text-xs text-[#785D46] space-y-1 list-disc pl-4">
                {result.remedies.map((rem: string, idx: number) => (
                  <li key={idx}>{rem}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'कुंडलीतील राशी निवडा' : 'Select Chart Positions'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'लग्न राशी (1st House)' : 'Ascendant / Lagna Sign'}
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

        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'मंगळ ज्या राशीत आहे (Mars Sign)' : 'Mars Sign Placement'}
          </label>
          <select
            value={marsId}
            onChange={(e) => setMarsId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          >
            {ZODIAC_SIGNS.map((s) => (
              <option key={s.id} value={s.id}>{s.id}. {s.name} ({s.sanskrit})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'चंद्र राशी (Moon Sign)' : 'Moon Sign (Chandra Rashi)'}
          </label>
          <select
            value={moonId}
            onChange={(e) => setMoonId(Number(e.target.value))}
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
          <Shield className="w-4 h-4" />
          <span>{isMr ? 'मंगळ दोष तपासा' : 'Check Mangal Dosha'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
