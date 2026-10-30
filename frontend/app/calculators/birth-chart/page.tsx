'use client';

import React, { useState } from 'react';
import CalculatorShell from '@/components/CalculatorShell';
import NorthIndianChart from '@/components/NorthIndianChart';
import SouthIndianChart from '@/components/SouthIndianChart';
import { KundliChartData } from '@/lib/types';
import { Compass, Sparkles, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BirthChartCalculatorPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [name, setName] = useState('Devendra Joshi');
  const [dob, setDob] = useState('1992-04-18');
  const [tob, setTob] = useState('11:30');
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');

  // Realistic sample planetary distribution for April 1992
  const samplePlanets = [
    { name: 'Sun', house: 10, sign: 'Aries', signId: 1, degree: '04° 12\'', isExalted: true },
    { name: 'Moon', house: 4, sign: 'Libra', signId: 7, degree: '18° 45\'' },
    { name: 'Mars', house: 9, sign: 'Pisces', signId: 12, degree: '22° 10\'' },
    { name: 'Mercury', house: 10, sign: 'Aries', signId: 1, degree: '15° 20\'' },
    { name: 'Jupiter', house: 2, sign: 'Leo', signId: 5, degree: '11° 05\'' },
    { name: 'Venus', house: 11, sign: 'Taurus', signId: 2, degree: '28° 30\'', isOwnSign: true },
    { name: 'Saturn', house: 7, sign: 'Capricorn', signId: 10, degree: '21° 40\'', isOwnSign: true },
    { name: 'Rahu', house: 6, sign: 'Sagittarius', signId: 9, degree: '08° 15\'', isRetrograde: true },
    { name: 'Ketu', house: 12, sign: 'Gemini', signId: 3, degree: '08° 15\'', isRetrograde: true },
  ];

  const sampleChartData: KundliChartData = {
    meta: {
      fullName: name,
      dateOfBirth: dob,
      timeOfBirth: tob,
      placeOfBirth: 'Mumbai, India',
      latitude: 19.076,
      longitude: 72.8777,
      timezoneOffsetHours: 5.5,
      ayanamsa: {
        name: 'Chitrapaksha Lahiri',
        value: 23.85,
        formatted: "23° 51' 14\"",
      },
      julianDate: 2448731.5,
    },
    ascendant: {
      longitude: 102.5,
      signNumber: 4,
      signName: 'Cancer',
      signSanskrit: 'Karka',
      degreeFormatted: "12° 30'",
      nakshatra: 'Pushya',
      pada: 3,
    },
    moonSign: {
      signNumber: 7,
      signName: 'Libra',
      signSanskrit: 'Tula',
      degreeFormatted: "18° 45'",
      nakshatra: 'Swati',
      nakshatraLord: 'Rahu',
      pada: 2,
    },
    sunSign: {
      signNumber: 1,
      signName: 'Aries',
      signSanskrit: 'Mesha',
      degreeFormatted: "04° 12'",
      nakshatra: 'Ashwini',
      pada: 2,
    },
    planets: samplePlanets.map((p, idx) => ({
      name: p.name,
      sanskrit: p.name,
      sanskritName: p.name,
      symbol: p.name.substring(0, 2),
      longitude: (p.signId - 1) * 30 + 10 + idx,
      signNumber: p.signId,
      signName: p.sign,
      signSanskrit: p.sign,
      degreeInSign: 10 + idx,
      degreeFormatted: p.degree,
      ruler: 'Sun',
      nakshatraName: 'Ashwini',
      nakshatraLord: 'Ketu',
      nakshatraPada: 1,
      houseNumber: p.house,
      isRetrograde: Boolean(p.isRetrograde),
    })),
    houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
      const signNum = ((h + 2) % 12) + 1;
      const occupants = samplePlanets.filter((p) => p.house === h).map((p) => p.name);
      return {
        houseNumber: h,
        signNumber: signNum,
        signName: 'Sign',
        signSanskrit: 'Rashi',
        ruler: 'Lord',
        occupants,
      };
    }),
    dasha: {
      balanceDashaPlanet: 'Rahu',
      balanceYears: 8.5,
      timeline: [],
    },
  };

  return (
    <CalculatorShell
      title="Birth/Natal Chart (Janam Kundli) Calculator"
      marathiTitle="जन्म कुंडली (लग्न कुंडली) कॅल्क्युलेटर"
      subtitle="Generates authentic 12-Bhava Vedic Kundli with planetary placements in classical North and South Indian formats."
      marathiSubtitle="१२ भाव आणि ९ ग्रहांची अचूक स्थिती दर्शवणारी उत्तर व दक्षिण भारतीय लग्न कुंडली."
      shastraRule="Vedic Janam Kundli partitions the 360° celestial sphere into 12 Bhavas starting from the Ascendant (Lagna = 1st House). Planetary longitudes are mapped under pure Chitrapaksha Lahiri Ayanamsa."
      marathiShastraRule="जन्म लग्नाला प्रथम भाव मानून १२ भावांमध्ये ग्रहांची मांडणी केली जाते. यामुळे जीवनातील विविध पैलूंचे (धर्म, अर्थ, काम, मोक्ष) अचूक विश्लेषण होते."
      icon={<Compass className="w-7 h-7 text-[#D97706]" />}
      result={
        <div className="space-y-6 animate-fadeIn">
          {/* Chart View Toggle */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE1]">
            <span className="text-xs uppercase font-bold text-[#D97706] tracking-wider">
              {isMr ? 'लग्न कुंडली आलेख' : 'Lagna Chart Display'}
            </span>
            <div className="flex items-center space-x-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE1D2] text-xs">
              <button
                type="button"
                onClick={() => setChartStyle('north')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  chartStyle === 'north' ? 'bg-[#D97706] text-white shadow-sm' : 'text-[#786C60] hover:text-[#2D1810]'
                }`}
              >
                {isMr ? 'उत्तर भारतीय' : 'North Indian'}
              </button>
              <button
                type="button"
                onClick={() => setChartStyle('south')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  chartStyle === 'south' ? 'bg-[#D97706] text-white shadow-sm' : 'text-[#786C60] hover:text-[#2D1810]'
                }`}
              >
                {isMr ? 'दक्षिण भारतीय' : 'South Indian'}
              </button>
            </div>
          </div>

          {/* SVG Chart Renderer */}
          <div className="flex justify-center p-2 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2]">
            {chartStyle === 'north' ? (
              <NorthIndianChart chartData={sampleChartData} />
            ) : (
              <SouthIndianChart chartData={sampleChartData} />
            )}
          </div>

          {/* Planetary Table */}
          <div>
            <h4 className="text-xs font-bold text-[#5C4535] uppercase tracking-wider mb-2">
              {isMr ? 'ग्रह स्पष्ट व भाव स्थिती' : 'Planetary Positions in Bhavas'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {samplePlanets.map((p) => (
                <div key={p.name} className="p-2 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] text-center">
                  <strong className="text-[#2D1810] block">{p.name}</strong>
                  <span className="text-[10px] text-gray-500 block">H{p.house} ({p.sign})</span>
                  <span className="font-mono text-[10px] text-[#D97706] font-bold">{p.degree}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#2D1810] pb-2 border-b border-[#F3ECE1]">
          {isMr ? 'जन्म माहिती प्रविष्ट करा' : 'Enter Birth Details'}
        </h3>
        <div>
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'पूर्ण नाव' : 'Full Name'}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
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
          <label className="block text-xs font-medium text-[#5C4535] mb-1">{isMr ? 'जन्म वेळ' : 'Time of Birth'}</label>
          <input
            type="time"
            required
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'जन्म कुंडली काढा' : 'Generate Natal Chart'}</span>
        </button>
      </div>
    </CalculatorShell>
  );
}
