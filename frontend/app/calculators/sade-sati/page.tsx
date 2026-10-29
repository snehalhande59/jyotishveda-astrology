'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateSadeSati, ZODIAC_SIGNS } from '@/lib/calculator-engine';
import { Shield, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SadeSatiCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [moonSignId, setMoonSignId] = useState(12); // Pisces (currently under Peak Sade Sati)
  const [result, setResult] = useState<any>(calculateSadeSati(12));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateSadeSati(Number(moonSignId));
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Shani Sade Sati Calculator"
      marathiTitle="शनि साडेसाती व ढिय्या कॅल्क्युलेटर"
      subtitle="Evaluates current Saturn Gochara transits to determine active Sade Sati phases (Rising, Peak, Setting) or Small Panoti (Kantaka Shani)."
      marathiSubtitle="सध्याच्या शनीच्या भ्रमणावरून साडेसातीचे चालू चरण (प्रथम, द्वितीय, तृतीय) आणि २.५ वर्षांची ढिय्या तपासणी."
      shastraRule="Sade Sati is the 7.5-year transit of Saturn across the 12th, 1st, and 2nd houses from your natal Moon sign. Each transit lasts approximately 2.5 years (Dhaiya). Additionally, Saturn traversing the 4th or 8th house from Moon generates Kantaka / Ashtama Shani."
      marathiShastraRule="जन्म चंद्रावरून शनीचे १२ वे, १ ले आणि २ रे स्थान म्हणजे साडेसाती (प्रत्येकी अडीच वर्षे = साडेसात वर्षे). तसेच ४ थे व ८ वे स्थान म्हणजे अडीच वर्षांची ढिय्या."
      icon={<Shield className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Phase Status Banner */}
            <div className={`p-5 rounded-2xl border text-center ${
              result.isUnderSadeSati ? 'bg-[#FFFBEB] border-[#F59E0B]' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-[#92400E] tracking-wider block mb-1">
                {isMr ? 'साडेसाती स्थिती' : 'Current Sade Sati Status'}
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-[#2D1810]">
                {result.currentPhase}
              </h2>
              <p className="text-xs text-[#785D46] mt-2 font-medium">
                {result.severity}
              </p>
            </div>

            {/* Current Saturn Transit Sign */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE1D2] flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 block">{isMr ? 'सध्या शनीचे गोचर स्थान' : 'Saturn\'s Current Transit'}</span>
                <strong className="text-sm text-[#2D1810]">{result.currentSaturnSign} (Meena)</strong>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block">{isMr ? 'तुमची चंद्र राशी' : 'Your Moon Sign'}</span>
                <strong className="text-sm text-[#D97706]">{result.moonSign}</strong>
              </div>
            </div>

            {/* 3 Phases Roadmap */}
            <div>
              <h4 className="text-xs font-bold text-[#5C4535] uppercase tracking-wider mb-2">
                {isMr ? 'साडेसातीचे ३ मुख्य चरण' : '3 Phases Summary'}
              </h4>
              <div className="space-y-2 text-xs">
                {result.phasesSummary.map((p: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-[#EAE1D2] flex items-center justify-between">
                    <div>
                      <strong className="text-[#2D1810] block">{p.phase} in {p.sign}</strong>
                      <span className="text-[11px] text-gray-500">{p.focus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vedic Remedies */}
            <div className="bg-[#FFFDF9] border border-[#EAE1D2] p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>{isMr ? 'शनि शांतीसाठी वैदिक उपाय' : 'Shani Shanti Remedies'}</span>
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
          {isMr ? 'तुमची चंद्र राशी निवडा' : 'Select Moon Sign (Chandra Rashi)'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'चंद्र राशी' : 'Moon Sign'}
          </label>
          <select
            value={moonSignId}
            onChange={(e) => setMoonSignId(Number(e.target.value))}
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
          <span>{isMr ? 'साडेसाती तपासा' : 'Check Sade Sati'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
