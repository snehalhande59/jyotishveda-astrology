'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateLoveCompatibility, ZODIAC_SIGNS } from '@/lib/calculator-engine';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoveCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [p1Name, setP1Name] = useState('Rahul');
  const [p1Rashi, setP1Rashi] = useState(1);
  const [p2Name, setP2Name] = useState('Pooja');
  const [p2Rashi, setP2Rashi] = useState(5);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1Name.trim() || !p2Name.trim()) return;
    const res = calculateLoveCompatibility(
      { name: p1Name.trim(), rashiId: Number(p1Rashi) },
      { name: p2Name.trim(), rashiId: Number(p2Rashi) }
    );
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Love Compatibility Calculator"
      marathiTitle="प्रेम सुसंगतता (लव्ह) कॅल्क्युलेटर"
      subtitle="Evaluates romantic resonance using Moon sign Bhavas, Venus-Mars polarity, and Chaldean name vibrations."
      marathiSubtitle="चंद्र राशींचे भाव अंतर, शुक्र-मंगळ आकर्षण आणि काल्डियन नामांक कंपनांवर आधारित खरी सुसंगतता."
      shastraRule="As per classical Vedic Jyotish (BPHS), relationship harmony depends on the Bhava distance between the two Moon signs (1/5/9 Trikona is auspicious, 3/11 Upachaya promotes shared growth, 6/8 Shadashtaka requires patience) blended with name numerology."
      marathiShastraRule="वैदिक ज्योतिषानुसार दोन कुंडलींमधील चंद्राचे परस्पर स्थान (त्रिकोण १/५/९ अत्यंत शुभ, उपचय ३/११ प्रगतीकारक, ६/८ षडाष्टक सावधगिरी) आणि नावाच्या नामांक कंपनांवरून प्रेम टक्केवारी काढली जाते."
      icon={<Heart className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center pb-5 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'एकूण प्रेम सुसंगतता गुण' : 'Total Love Compatibility Score'}
              </span>
              <div className="flex items-center justify-center space-x-2 my-2">
                <span className="font-serif text-5xl font-extrabold text-[#D97706]">
                  {result.totalScore}%
                </span>
              </div>
              <p className="font-serif text-lg font-bold text-[#2D1810]">
                {result.verdict}
              </p>
            </div>

            {/* Score Breakdown Bar */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#5C4535] uppercase tracking-wider">
                {isMr ? 'घटकनिहाय गुण विभाजन' : 'Dimensional Breakdown'}
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#786C60]">{isMr ? 'वैदिक राशी संबंध (४० पैकी)' : 'Vedic Rashi Axis (out of 40)'}</span>
                    <span className="font-bold text-[#2D1810]">{result.astroScore} / 40</span>
                  </div>
                  <div className="w-full bg-[#FAF7F2] rounded-full h-2">
                    <div className="bg-[#D97706] h-2 rounded-full" style={{ width: `${(result.astroScore / 40) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#786C60]">{isMr ? 'नामांक स्पंदन (३० पैकी)' : 'Name Vibrations (out of 30)'}</span>
                    <span className="font-bold text-[#2D1810]">{result.numScore} / 30</span>
                  </div>
                  <div className="w-full bg-[#FAF7F2] rounded-full h-2">
                    <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: `${(result.numScore / 30) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#786C60]">{isMr ? 'भावनिक सुसंवाद (३० पैकी)' : 'Emotional Affinity (out of 30)'}</span>
                    <span className="font-bold text-[#2D1810]">{result.emotionalScore} / 30</span>
                  </div>
                  <div className="w-full bg-[#FAF7F2] rounded-full h-2">
                    <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${(result.emotionalScore / 30) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl text-xs text-[#785D46] leading-relaxed">
              <strong className="block text-[#92400E] mb-1 font-semibold">{isMr ? 'ज्योतिषीय स्पष्टीकरण:' : 'Astrological Analysis:'}</strong>
              {result.astroNote}
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-5">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'दोघांचे तपशील प्रविष्ट करा' : 'Enter Both Partners\' Details'}
        </h3>

        {/* Partner 1 */}
        <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D2]">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
            {isMr ? 'पहिली व्यक्ती (Partner 1)' : 'Partner 1 Details'}
          </span>
          <div>
            <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पूर्ण नाव' : 'Full Name'}</label>
            <input
              type="text"
              required
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'चंद्र राशी' : 'Moon Sign (Rashi)'}</label>
            <select
              value={p1Rashi}
              onChange={(e) => setP1Rashi(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.name} ({s.sanskrit})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Partner 2 */}
        <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D2]">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
            {isMr ? 'दुसरी व्यक्ती (Partner 2)' : 'Partner 2 Details'}
          </span>
          <div>
            <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पूर्ण नाव' : 'Full Name'}</label>
            <input
              type="text"
              required
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'चंद्र राशी' : 'Moon Sign (Rashi)'}</label>
            <select
              value={p2Rashi}
              onChange={(e) => setP2Rashi(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.name} ({s.sanskrit})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'प्रेम टक्केवारी मोजा' : 'Calculate Compatibility'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
