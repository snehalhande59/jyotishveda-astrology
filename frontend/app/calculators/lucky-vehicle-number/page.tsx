'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import { calculateVehicleNumber } from '@/lib/calculator-engine';
import { Car, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LuckyVehicleNumberCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [plate, setPlate] = useState('MH02EK9999');
  const [dob, setDob] = useState('1990-06-12');
  const [result, setResult] = useState<any>(calculateVehicleNumber('MH02EK9999', '1990-06-12'));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;
    const res = calculateVehicleNumber(plate.trim(), dob);
    setResult(res);
  };

  return (
    <CalculatorShell
      title="Lucky Vehicle Number Calculator"
      marathiTitle="शुभ वाहन क्रमांक कॅल्क्युलेटर"
      subtitle="Evaluates vehicle registration number vibrations via Chaldean reduction against your personal Life Path number."
      marathiSubtitle="तुमच्या वाहनाचा नंबर आणि जन्म तारखेच्या भाग्यांकामधील संख्याशास्त्रीय सुसंगतता व शुभ रंग."
      shastraRule="Vehicle numbers possess dynamic electromagnetic vibrations derived by reducing all letters (Chaldean values) and digits to a single root number. When this matches your Life Path driver, it enhances travel safety, auspicious journeys, and vehicle longevity."
      marathiShastraRule="नंबर प्लेटमधील अक्षरे व अंकांचा बेरीज मूलांक काढून, तो मालकाच्या भाग्यांकाशी जुळतो का याची तपासणी केली जाते."
      icon={<Car className="w-7 h-7 text-[#D97706]" />}
      result={
        result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Number Plate Visual */}
            <div className="bg-[#FFFBEB] border-2 border-[#D97706] p-5 rounded-2xl text-center shadow-inner">
              <span className="text-[10px] uppercase font-bold text-[#92400E] tracking-wider block mb-1">
                {isMr ? 'नंबर प्लेट मूलांक' : 'Vehicle Root Vibration'}
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-[#2D1810] my-2 bg-white inline-block px-5 py-2 rounded-xl border border-[#D97706]/40 shadow-sm">
                {result.rawInput}
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className="text-xs text-gray-600">{isMr ? 'एकूण बेरीज:' : 'Total Sum:'} {result.compoundSum}</span>
                <span className="text-[#D8C7A5]">|</span>
                <span className="text-xs font-bold text-[#D97706]">
                  {isMr ? 'मूलांक:' : 'Root:'} {result.singleDigit} ({result.governingPlanet})
                </span>
              </div>
            </div>

            {/* Verdict */}
            <div className={`p-4 rounded-2xl border text-xs flex items-start space-x-3 ${
              result.isCompatible ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {result.isCompatible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-bold text-sm mb-0.5">{result.verdict}</strong>
                <p className="leading-relaxed">{result.remedy}</p>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'वाहनाचा स्वभाव' : 'Vehicle Temperament'}</span>
                <strong className="text-[#2D1810] block mt-1">{result.nature}</strong>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE1D2]">
                <span className="text-gray-500 block">{isMr ? 'शुभ रंग (Colors)' : 'Harmonious Colors'}</span>
                <strong className="text-[#2D1810] block mt-1">{result.auspiciousColors.join(', ')}</strong>
              </div>
            </div>
          </div>
        )
      }
    >
      <form onSubmit={handleCalculate} className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'वाहन व मालक तपशील' : 'Enter Details'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'वाहन नोंदणी क्रमांक (उदा. MH12AB1234)' : 'Vehicle Plate Number (e.g. MH02EK9999)'}
          </label>
          <input
            type="text"
            required
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="MH02EK9999"
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs uppercase font-mono tracking-wider focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">
            {isMr ? 'मालकाची जन्म तारीख (ऐच्छिक)' : 'Owner Date of Birth (Optional)'}
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'वाहन क्रमांक तपासा' : 'Check Lucky Number'}</span>
        </button>
      </form>
    </CalculatorShell>
  );
}
