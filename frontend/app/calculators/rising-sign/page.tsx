'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateRisingSign } from '@/lib/calculator-engine';
import { Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function RisingSignCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [dob, setDob] = useState('1998-05-20');
  const [tob, setTob] = useState('06:30');
  const [city, setCity] = useState('Mumbai, Maharashtra');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !tob) return;
    const res = calculateRisingSign(dob, tob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Rising Sign (Lagna) Calculator"
      marathiTitle="लग्न राशी (उदित लग्न) कॅल्क्युलेटर"
      subtitle="Find your authentic 1st House Ascendant in Vedic Sidereal astrology using pure Lahiri Ayanamsa."
      marathiSubtitle="जन्म वेळेच्या वेळी पूर्व क्षितिजावर उदित होणारी खरी वैदिक लग्न राशी."
      shastraRule="The Ascendant represents the exact zodiac degree rising on the eastern horizon at the moment of birth. In Vedic astrology, pure Chitrapaksha Lahiri Ayanamsa is deducted from tropical Sayana coordinates to establish your physical constitution and true Lagna."
      marathiShastraRule="जन्म क्षणी पूर्व क्षितिजावरील राशी म्हणजे लग्न. यात सायन अंशांमधून लाहिरी अयनांश वजा करून निरयन लग्न निश्चित केले जाते."
      icon={<Compass className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center pb-5 border-b border-[#F3ECE1]">
              <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
                {isMr ? 'तुमची खरी वैदिक लग्न राशी' : 'Your Vedic Ascendant (Lagna)'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810] my-2">
                {result.sign} ({result.sanskrit})
              </h2>
              <span className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] rounded-full text-xs font-bold">
                {result.degree}° in {result.sign}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'लग्न स्वामी (Lagna Lord)' : 'Ascendant Lord'}</span>
                <strong className="text-sm text-[#2D1810]">{result.lord}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'मूलतत्व (Element)' : 'Element'}</span>
                <strong className="text-sm text-[#2D1810]">{result.element}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'उदित नक्षत्र' : 'Rising Nakshatra'}</span>
                <strong className="text-sm text-[#2D1810]">{result.nakshatra}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'चरण (Pada)' : 'Pada'}</span>
                <strong className="text-sm text-[#2D1810]">Pada {result.pada}</strong>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl text-xs text-[#785D46] leading-relaxed">
              <strong className="block text-[#92400E] font-semibold mb-1">
                {isMr ? 'लाहिरी अयनांश:' : 'Lahiri Ayanamsa Applied:'} {result.ayanamsa}°
              </strong>
              {isMr
                ? 'लग्न हे तुमच्या संपूर्ण आयुष्याचे शरीर, आरोग्य, व्यक्तिमत्व आणि जीवन प्रवासाचे मुख्य केंद्र आहे.'
                : 'The Ascendant (Lagna) is the cornerstone of your birth chart, determining your physical vitality, worldly approach, and the distribution of all 12 houses.'}
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'जन्माची अचूक वेळ प्रविष्ट करा' : 'Enter Accurate Birth Details'}
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
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'जन्म वेळ (अचूक मिनिटांसह)' : 'Time of Birth (Exact minutes)'}
          </label>
          <input
            type="time"
            required
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'जन्म ठिकाण / शहर' : 'City / Place of Birth'}</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'लग्न राशी शोधा' : 'Calculate Rising Sign'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
