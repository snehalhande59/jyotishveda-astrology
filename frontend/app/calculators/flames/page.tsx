'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateFlames } from '@/lib/calculator-engine';
import { Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FlamesCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [name1, setName1] = useState('Rohan');
  const [name2, setName2] = useState('Ananya');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;
    const res = calculateFlames(name1.trim(), name2.trim());
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Flames Relationship Calculator"
      marathiTitle="फ्लेम्स (FLAMES) संबंध कॅल्क्युलेटर"
      subtitle="Classic algorithmic relationship meter: Friends, Lovers, Affectionate, Marriage, Enemies, or Siblings."
      marathiSubtitle="नावांमधील अक्षरांच्या आधारे मैत्री, प्रेम, आपुलकी, विवाह, वैर किंवा बंधुभाव संबंधांची तपासणी."
      shastraRule="FLAMES is a deterministic relationship algorithm that removes common letters between two partners' names and counts the remaining non-matching characters in an iterative cyclic elimination modulo 6 (Friends, Lovers, Affectionate, Marriage, Enemies, Siblings)."
      marathiShastraRule="दोन्ही नावातील समान अक्षरे वगळून उरलेल्या अक्षरांच्या संख्येवरून ६ अवस्थांमधून (F-L-A-M-E-S) अचूक संबंध स्वरूप निर्धारित केले जाते."
      icon={<Flame className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center pb-5 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'फ्लेम्स निकाल' : 'FLAMES Final Verdict'}
              </span>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border-2 border-[#D97706] flex items-center justify-center font-serif text-3xl font-extrabold text-[#D97706] mx-auto my-3 shadow-sm">
                {result.letter}
              </div>
              <h2 className="font-serif text-3xl font-extrabold text-[#2D1810]">
                {result.result}
              </h2>
              <p className="text-xs text-[#786C60] mt-1">
                {isMr ? `उरलेली अक्षरे संख्या: ${result.count}` : `Elimination Strike Count: ${result.count}`}
              </p>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl text-xs text-[#785D46] leading-relaxed">
              <strong className="block text-[#92400E] font-semibold mb-1">
                {isMr ? 'संबंधाचे वैशिष्ट्य:' : 'Relational Dynamic:'}
              </strong>
              {result.description}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-[11px]">
              {[
                { k: 'F', v: 'Friends' },
                { k: 'L', v: 'Lovers' },
                { k: 'A', v: 'Affection' },
                { k: 'M', v: 'Marriage' },
                { k: 'E', v: 'Enemies' },
                { k: 'S', v: 'Siblings' },
              ].map((item) => (
                <div
                  key={item.k}
                  className={`p-2 rounded-xl border ${
                    result.letter === item.k
                      ? 'bg-[#D97706] text-white border-[#D97706] font-bold'
                      : 'bg-[#FAF7F2] border-[#EAE1D2] text-[#5C4535]'
                  }`}
                >
                  <span className="block font-serif font-extrabold">{item.k}</span>
                  <span>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'दोन्ही नावे प्रविष्ट करा' : 'Enter Both Names'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पहिले नाव' : 'First Person Name'}</label>
          <input
            type="text"
            required
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'दुसरे नाव' : 'Second Person Name'}</label>
          <input
            type="text"
            required
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'फ्लेम्स निकाल पहा' : 'Compute FLAMES'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
