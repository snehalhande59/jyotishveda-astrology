'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateJaiminiKarakas } from '@/lib/calculator-engine';
import { Star, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AtmakarakaDarakarakaCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const defaultPlanets = [
    { name: 'Sun', longitude: 14.2 },
    { name: 'Moon', longitude: 28.5 },
    { name: 'Mars', longitude: 6.1 },
    { name: 'Mercury', longitude: 19.8 },
    { name: 'Jupiter', longitude: 24.3 },
    { name: 'Venus', longitude: 2.4 },
    { name: 'Saturn', longitude: 11.7 },
  ];

  const [result, setResult] = useState<any>(calculateJaiminiKarakas(defaultPlanets));

  return (
    <CalculatorShell
      title="Atmakaraka & Darakaraka Calculator (7 Jaimini Karakas)"
      marathiTitle="आत्मकारक व दारकारक कॅल्क्युलेटर (७ जैमिनी कारक)"
      subtitle="Determines the 7 Chara Karakas of Jaimini astrology revealing your Soul's purpose (AK) and Spouse vibration (DK)."
      marathiSubtitle="जैमिनी ज्योतिषानुसार आत्म्याचा उद्देश (आत्मकारक) आणि जीवनसाथीची ऊर्जा (दारकारक)."
      shastraRule="In Jaimini Upadesha Sutras, 7 classical planets (Sun through Saturn) are arranged by their longitude within their respective signs. The planet with highest degrees becomes Atmakaraka (Soul), while the lowest degree planet becomes Darakaraka (Spouse/Partnerships)."
      marathiShastraRule="जैमिनी सूत्रांनुसार राशीतील सर्वाधिक अंश असलेला ग्रह आत्मकारक (आत्म्याचे ध्येय) आणि सर्वात कमी अंश असलेला ग्रह दारकारक (पती/पत्नी स्वरूप) बनतो."
      icon={<Star className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* AK & DK Spotlight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-[#92400E] block">
                  {isMr ? 'आत्मकारक (AK) - आत्मा' : 'Atmakaraka (AK) - Soul'}
                </span>
                <span className="font-serif text-2xl font-extrabold text-[#D97706] block my-1">
                  {result[0]?.planet}
                </span>
                <span className="text-xs text-gray-600">{result[0]?.degrees} in {result[0]?.sign}</span>
              </div>

              <div className="bg-[#FAF7F2] border border-[#EAE1D2] p-4 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-[#786C60] block">
                  {isMr ? 'दारकारक (DK) - जोडीदार' : 'Darakaraka (DK) - Spouse'}
                </span>
                <span className="font-serif text-2xl font-extrabold text-[#92400E] block my-1">
                  {result[6]?.planet}
                </span>
                <span className="text-xs text-gray-600">{result[6]?.degrees} in {result[6]?.sign}</span>
              </div>
            </div>

            {/* Complete 7 Karakas Table */}
            <div>
              <h4 className="text-xs font-bold text-[#5C4535] uppercase tracking-wider mb-2">
                {isMr ? 'संपूर्ण ७ चर कारक तक्ता' : 'Complete 7 Chara Karakas Scheme'}
              </h4>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 text-xs">
                {result.map((k: any) => (
                  <div
                    key={k.code}
                    className="p-2.5 bg-white rounded-xl border border-[#EAE1D2] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold text-[10px]">
                          {k.code}
                        </span>
                        <strong className="text-[#2D1810]">{k.role}: {k.planet}</strong>
                      </div>
                      <span className="text-[11px] text-gray-500 mt-0.5 block">{k.desc}</span>
                    </div>
                    <span className="text-right font-mono text-[11px] text-[#D97706] font-bold">
                      {k.degrees}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'जैमिनी चर कारक विश्लेषण' : 'Jaimini Chara Karakas'}
        </h3>
        <p className="text-xs text-[#786C60] leading-relaxed">
          {isMr
            ? 'पराशरोक्त ९ ग्रहांमधील राहू व केतू वगळता ७ ग्रहांचे अंश तपासून आत्मकारक, अमात्यकारक, भ्रातृकारक, मातृकारक, पुत्रकारक, ज्ञातिकारक आणि दारकारक निश्चित केले जातात.'
            : 'Seven classical planets are evaluated according to their longitudinal advancement inside their respective signs. Rahu and Ketu are excluded in the classical 7-Karaka school.'}
        </p>
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE1D2] text-xs space-y-2">
          <span className="font-bold text-[#92400E] block">{isMr ? 'महत्त्वाची वैशिष्ट्ये:' : 'Key Significances:'}</span>
          <p className="text-[#5C4535] leading-relaxed">
            • <strong>Atmakaraka (AK)</strong>: Highest degree planet; indicates your deepest spiritual mission and primary karmic challenges.<br />
            • <strong>Darakaraka (DK)</strong>: Lowest degree planet; reveals the temperament, physical traits, and spiritual role of your marital partner.
          </p>
        </div>
      </div>
    </CalculatorShell>
  );
}
