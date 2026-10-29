'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateNameMatch } from '@/lib/calculator-engine';
import { Users, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NameCompatibilityCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [n1, setN1] = useState('Ankit');
  const [n2, setN2] = useState('Sneha');
  const [result, setResult] = useState<any>(calculateNameMatch('Ankit', 'Sneha'));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!n1.trim() || !n2.trim()) return;
    const res = calculateNameMatch(n1.trim(), n2.trim());
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Name Compatibility Calculator (Chaldean Method)"
      marathiTitle="नाव सुसंगतता कॅल्क्युलेटर (काल्डियन पद्धत)"
      subtitle="Evaluates interpersonal vibrational harmony through Chaldean compound numerical reductions."
      marathiSubtitle="काल्डियन संख्याशास्त्रावर आधारित दोन नावांची ध्वनी व ऊर्जा सुसंगतता टक्केवारी."
      shastraRule="Every letter carries a distinct sound vibration and cosmic wavelength. The Chaldean system computes compound vibrational numbers and single root roots to evaluate romantic and professional mutual harmony."
      marathiShastraRule="नावातील प्रत्येक अक्षराला विशिष्ट संख्या मूल्य असते. या दोन नावांच्या एकत्रित कंपनांवरून नातेसंबंधातील सुसंवाद तपासला जातो."
      icon={<Users className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Score Highlight Card */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-6 rounded-2xl text-center">
              <span className="text-xs uppercase font-bold text-[#92400E] tracking-wider block mb-1">
                {isMr ? 'नाव सुसंगतता गुण' : 'Name Vibrational Compatibility'}
              </span>
              <div className="font-serif text-5xl font-extrabold text-[#D97706] my-2">
                {result.compatibilityScore}%
              </div>
            </div>

            {/* Names Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE1D2] text-center">
                <span className="font-serif font-bold text-sm text-[#2D1810] block">{result.name1.name}</span>
                <span className="text-gray-500 block text-[11px] mt-1">{isMr ? 'एकूण बेरीज:' : 'Compound:'} {result.name1.compound}</span>
                <span className="font-bold text-[#D97706] block mt-0.5">{isMr ? 'मूलांक:' : 'Root:'} {result.name1.single}</span>
              </div>
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE1D2] text-center">
                <span className="font-serif font-bold text-sm text-[#2D1810] block">{result.name2.name}</span>
                <span className="text-gray-500 block text-[11px] mt-1">{isMr ? 'एकूण बेरीज:' : 'Compound:'} {result.name2.compound}</span>
                <span className="font-bold text-[#D97706] block mt-0.5">{isMr ? 'मूलांक:' : 'Root:'} {result.name2.single}</span>
              </div>
            </div>

            <div className="bg-white border border-[#EAE1D2] p-4 rounded-2xl text-xs text-[#786C60] leading-relaxed">
              <strong className="block text-[#92400E] font-semibold mb-1">
                {isMr ? 'संख्याशास्त्रीय विश्लेषण:' : 'Numerological Analysis:'}
              </strong>
              {result.explanation}
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
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पहिले नाव' : 'First Name'}</label>
          <input
            type="text"
            required
            value={n1}
            onChange={(e) => setN1(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'दुसरे नाव' : 'Second Name'}</label>
          <input
            type="text"
            required
            value={n2}
            onChange={(e) => setN2(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'नाव सुसंगतता मोजा' : 'Calculate Compatibility'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
