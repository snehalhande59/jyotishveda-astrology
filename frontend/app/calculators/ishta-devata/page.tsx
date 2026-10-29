'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateIshtaDevata } from '@/lib/calculator-engine';
import { Star, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function IshtaDevataCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [akPlanet, setAkPlanet] = useState('Jupiter');
  const [akLongitude, setAkLongitude] = useState(28.4); // degrees
  const [result, setResult] = useState<any>(
    calculateIshtaDevata([
      { name: 'Jupiter', longitude: 28.4 },
      { name: 'Sun', longitude: 12.1 },
      { name: 'Moon', longitude: 20.3 },
      { name: 'Mars', longitude: 15.2 },
      { name: 'Mercury', longitude: 7.8 },
      { name: 'Venus', longitude: 24.5 },
      { name: 'Saturn', longitude: 4.1 },
    ])
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const planets = [
      { name: akPlanet, longitude: Number(akLongitude) },
      { name: 'Sun', longitude: 12.1 },
      { name: 'Moon', longitude: 20.3 },
      { name: 'Mars', longitude: 15.2 },
      { name: 'Mercury', longitude: 7.8 },
      { name: 'Venus', longitude: 24.5 },
      { name: 'Saturn', longitude: 4.1 },
    ];
    const res = calculateIshtaDevata(planets);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Ishta Devata Calculator (Jaimini Method)"
      marathiTitle="इष्ट देवता कॅल्क्युलेटर (जैमिनी पद्धत)"
      subtitle="Identifies your soul's guiding deity via the 12th house from Karakamsa in the D-9 Navamsha chart."
      marathiSubtitle="जैमिनी ज्योतिषानुसार आत्मकारकाच्या नवमांश १२ व्या स्थानावरून वैयक्तिक इष्ट देवता."
      shastraRule="Maharishi Jaimini's Upadesha Sutras stipulate that the planet having the highest degree in any sign becomes the Atmakaraka (soul significator). Its position in the D-9 Navamsha chart is Karakamsa. The 12th house from Karakamsa (Jivanmuktaamsa) reveals the presiding deity who guides the soul toward spiritual liberation (Moksha)."
      marathiShastraRule="जैमिनी सूत्रांनुसार आत्मकारकाच्या नवमांश कुंडलीतील १२ व्या स्थानातील ग्रह आणि राशीवरून आत्म्याची इष्ट देवता ठरवली जाते, जी मोक्ष मार्ग सुलभ करते."
      icon={<Star className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Presiding Deity Highlight Card */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-6 rounded-2xl text-center">
              <span className="text-xs uppercase font-bold text-[#92400E] tracking-wider block mb-1">
                {isMr ? 'तुमची शास्त्रीय इष्ट देवता' : 'Your Presiding Ishta Devata'}
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-[#D97706] my-2">
                {result.ishtaDevata}
              </h2>
              <div className="inline-block px-4 py-1.5 bg-white border border-[#FDE68A] rounded-full text-xs font-mono font-bold text-[#2D1810]">
                {result.mantra}
              </div>
            </div>

            {/* Jaimini Chart Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'आत्मकारक ग्रह (AK)' : 'Atmakaraka (AK)'}</span>
                <strong className="text-sm text-[#2D1810]">{result.atmakaraka} ({result.atmakarakaDegree}°)</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'कारकांश राशी (D9)' : 'Karakamsa Lagna (D9)'}</span>
                <strong className="text-sm text-[#2D1810]">{result.karakamsaSign}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? '१२ वे मोक्ष स्थान' : '12th from Karakamsa'}</span>
                <strong className="text-sm text-[#2D1810]">{result.twelfthSign}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? '१२ वा स्वामी ग्रह' : '12th Lord'}</span>
                <strong className="text-sm text-[#2D1810]">{result.twelfthLord}</strong>
              </div>
            </div>

            <div className="bg-[#FFFDF9] border border-[#EAE1D2] p-4 rounded-2xl text-xs text-[#785D46] leading-relaxed">
              <strong className="block text-[#92400E] font-semibold mb-1">
                {isMr ? 'आध्यात्मिक लाभ व महात्म्य:' : 'Spiritual Significance:'}
              </strong>
              {result.significance}
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'आत्मकारक ग्रह तपशील' : 'Select Atmakaraka Planet'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'आत्मकारक ग्रह (कुंडलीतील सर्वोच्च अंश)' : 'Planet with Highest Degree in Chart'}
          </label>
          <select
            value={akPlanet}
            onChange={(e) => setAkPlanet(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          >
            {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'राशीतील अंश (Degree in Sign: 0° - 30°)' : 'Degree in Sign (0° to 30°)'}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="29.99"
            required
            value={akLongitude}
            onChange={(e) => setAkLongitude(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'इष्ट देवता शोधा' : 'Calculate Ishta Devata'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
