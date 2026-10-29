'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateFriendship, ZODIAC_SIGNS } from '@/lib/calculator-engine';
import { Users, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FriendshipCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [n1, setN1] = useState('Vikram');
  const [s1, setS1] = useState(1); // Aries (Mars)
  const [n2, setN2] = useState('Aditya');
  const [s2, setS2] = useState(5); // Leo (Sun)
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!n1.trim() || !n2.trim()) return;
    const res = calculateFriendship(n1.trim(), n2.trim(), Number(s1), Number(s2));
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Friendship Compatibility Calculator"
      marathiTitle="मैत्री सुसंगतता कॅल्क्युलेटर"
      subtitle="Evaluates planetary Graha Maitri (Friendship matrix) between ruling lords blended with name vibrations."
      marathiSubtitle="राशी स्वामींच्या नैसर्गिक ग्रह मैत्री आणि नावांच्या सुसंवादावर आधारित खरी मैत्री टक्केवारी."
      shastraRule="Calculates planetary natural friendship (Naisargika Maitri) from Parashara's classical table (Mitra, Sama, Shatru) combined with Chaldean phonetic resonance."
      marathiShastraRule="पराशरोक्त नैसर्गिका ग्रह मैत्री (मित्र, सम, शत्रू) आणि संख्याशास्त्राच्या नामांक कंपनांवरून मैत्रीची दृढता तपासली जाते."
      icon={<Users className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center pb-5 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'मैत्री सुसंगतता टक्केवारी' : 'Friendship Harmony Score'}
              </span>
              <div className="font-serif text-5xl font-extrabold text-[#D97706] my-2">
                {result.score}%
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                {result.verdict}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'ग्रह स्वामी मैत्री' : 'Ruling Lords'}</span>
                <strong className="text-sm text-[#2D1810]">{result.rulingLords}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'ज्योतिषीय गुण' : 'Astro Points'}</span>
                <strong className="text-sm text-[#2D1810]">{result.astroPoints} / 45</strong>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl text-xs text-[#785D46] leading-relaxed">
              <strong className="block text-[#92400E] font-semibold mb-1">
                {isMr ? 'मार्गदर्शन:' : 'Astrological Friendship Advice:'}
              </strong>
              {result.advice}
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'दोन्ही मित्रांचे तपशील' : 'Enter Friends\' Details'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पहिले नाव' : 'First Friend Name'}</label>
          <input
            type="text"
            required
            value={n1}
            onChange={(e) => setN1(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पहिली राशी' : 'First Sign'}</label>
          <select
            value={s1}
            onChange={(e) => setS1(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          >
            {ZODIAC_SIGNS.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.sanskrit}) - Lord {s.lord}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'दुसरे नाव' : 'Second Friend Name'}</label>
          <input
            type="text"
            required
            value={n2}
            onChange={(e) => setN2(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'दुसरी राशी' : 'Second Sign'}</label>
          <select
            value={s2}
            onChange={(e) => setS2(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          >
            {ZODIAC_SIGNS.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.sanskrit}) - Lord {s.lord}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'मैत्री टक्केवारी मोजा' : 'Calculate Friendship'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
