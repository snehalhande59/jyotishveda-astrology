'use client';

import React from 'react';
import { KundliChartData } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface SouthIndianChartProps {
  chartData: KundliChartData;
}

// Fixed sign placement in South Indian grid (row, col from 0 to 3)
const SIGN_GRID: Record<number, { row: number; col: number; name: string; mrName: string }> = {
  12: { row: 0, col: 0, name: 'Pisces', mrName: 'मीन' },
  1:  { row: 0, col: 1, name: 'Aries', mrName: 'मेष' },
  2:  { row: 0, col: 2, name: 'Taurus', mrName: 'वृषभ' },
  3:  { row: 0, col: 3, name: 'Gemini', mrName: 'मिथुन' },
  4:  { row: 1, col: 3, name: 'Cancer', mrName: 'कर्क' },
  5:  { row: 2, col: 3, name: 'Leo', mrName: 'सिंह' },
  6:  { row: 3, col: 3, name: 'Virgo', mrName: 'कन्या' },
  7:  { row: 3, col: 2, name: 'Libra', mrName: 'तूळ' },
  8:  { row: 3, col: 1, name: 'Scorpio', mrName: 'वृश्चिक' },
  9:  { row: 3, col: 0, name: 'Sagittarius', mrName: 'धनु' },
  10: { row: 2, col: 0, name: 'Capricorn', mrName: 'मकर' },
  11: { row: 1, col: 0, name: 'Aquarius', mrName: 'कुंभ' },
};

export default function SouthIndianChart({ chartData }: SouthIndianChartProps) {
  const { language, translatePlanet, translateSign } = useLanguage();
  const { planets, ascendant } = chartData;

  // Build map of sign number -> array of planet names
  const planetsBySign: Record<number, any[]> = {};
  planets.forEach((p) => {
    if (!planetsBySign[p.signNumber]) planetsBySign[p.signNumber] = [];
    planetsBySign[p.signNumber].push(p);
  });

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE1D2] shadow-sm flex flex-col items-center w-full max-w-lg">
      <div className="flex items-center justify-between w-full mb-4 px-1">
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D1810]">
          {language === 'mr' ? 'दक्षिण भारतीय पद्धत (स्थिर राशी)' : 'South Indian Chart (Fixed Zodiac)'}
        </h3>
        <span className="text-xs bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A] text-[#92400E] font-medium shadow-2xs">
          {language === 'mr' ? '१२ स्थिर राशी' : '12 Fixed Signs'}
        </span>
      </div>

      <div className="w-full max-w-[420px] aspect-square grid grid-cols-4 grid-rows-4 gap-1 p-2 bg-[#FAF7F2] border-2 border-[#D97706] rounded-2xl shadow-xs">
        {/* Render grid cells */}
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            // Center open area (r: 1..2, c: 1..2)
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key={`${r}-${c}`}
                    className="col-span-2 row-span-2 flex flex-col items-center justify-center p-3 text-center bg-white border border-[#EAE1D2] rounded-xl shadow-2xs"
                  >
                    <span className="font-serif text-sm font-bold text-[#2D1810]">
                      {chartData.meta?.fullName || 'User'}
                    </span>
                    <span className="text-[10px] text-[#786C60] mt-0.5">
                      {chartData.meta?.dateOfBirth} • {chartData.meta?.timeOfBirth}
                    </span>
                    <span className="text-[11px] font-bold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A] mt-1.5">
                      {language === 'mr' ? 'लग्न:' : 'Asc:'} {translateSign(ascendant.signName)}
                    </span>
                  </div>
                );
              }
              return null; // Handled by col-span-2
            }

            // Find sign for this cell
            const entry = Object.entries(SIGN_GRID).find(
              ([, val]) => val.row === r && val.col === c
            );
            if (!entry) return <div key={`${r}-${c}`} />;

            const signNum = parseInt(entry[0], 10);
            const isLagna = ascendant.signNumber === signNum;
            const signPlanets = planetsBySign[signNum] || [];
            const signLabel = language === 'mr' ? entry[1].mrName : entry[1].name;

            return (
              <div
                key={`${r}-${c}`}
                className={`p-1.5 flex flex-col justify-between border rounded-lg text-[11px] min-h-[75px] transition-colors ${
                  isLagna
                    ? 'bg-[#FEF3C7] border-[#F59E0B] shadow-2xs'
                    : 'bg-white border-[#EAE1D2] hover:bg-[#FFFDF9]'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className={`font-bold ${isLagna ? 'text-[#92400E]' : 'text-[#786C60]'}`}>
                    {signLabel}
                  </span>
                  {isLagna && (
                    <span className="text-[9px] font-extrabold bg-[#D97706] text-white px-1 py-0.2 rounded">
                      {language === 'mr' ? 'लग्न' : 'ASC'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 my-1">
                  {signPlanets.map((p, pIdx) => {
                    const translated = translatePlanet(p.name);
                    const shortName =
                      language === 'mr' ? translated.substring(0, 3) : p.name.substring(0, 2);
                    return (
                      <span
                        key={pIdx}
                        className={`text-[10px] font-bold px-1 rounded ${
                          p.isRetrograde
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-[#FAF7F2] text-[#2D1810] border border-[#EAE1D2]'
                        }`}
                      >
                        {shortName}
                        {p.isRetrograde ? '*' : ''}
                      </span>
                    );
                  })}
                </div>

                <div className="text-[9px] text-right text-[#786C60]/60">
                  {signNum}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="w-full flex items-center justify-between text-[11px] text-[#786C60] pt-3 px-2 mt-2 border-t border-[#F5EFE6]">
        <span>{language === 'mr' ? '* = वक्री ग्रह (Retrograde)' : '* = Retrograde (Vakri)'}</span>
        <span>{language === 'mr' ? 'लाहिरी अयनांश' : 'Lahiri Chitrapaksha'}</span>
      </div>
    </div>
  );
}
