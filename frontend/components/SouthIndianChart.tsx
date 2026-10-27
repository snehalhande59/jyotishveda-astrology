'use client';

import React from 'react';
import { KundliChartData } from '@/lib/types';

interface SouthIndianChartProps {
  chartData: KundliChartData;
}

// Fixed sign placement in South Indian grid (row, col from 0 to 3)
const SIGN_GRID: Record<number, { row: number; col: number; name: string }> = {
  12: { row: 0, col: 0, name: 'Pisces' },
  1:  { row: 0, col: 1, name: 'Aries' },
  2:  { row: 0, col: 2, name: 'Taurus' },
  3:  { row: 0, col: 3, name: 'Gemini' },
  4:  { row: 1, col: 3, name: 'Cancer' },
  5:  { row: 2, col: 3, name: 'Leo' },
  6:  { row: 3, col: 3, name: 'Virgo' },
  7:  { row: 3, col: 2, name: 'Libra' },
  8:  { row: 3, col: 1, name: 'Scorpio' },
  9:  { row: 3, col: 0, name: 'Sagittarius' },
  10: { row: 2, col: 0, name: 'Capricorn' },
  11: { row: 1, col: 0, name: 'Aquarius' },
};

export default function SouthIndianChart({ chartData }: SouthIndianChartProps) {
  const { planets, ascendant } = chartData;

  // Build map of sign number -> array of planet names
  const planetsBySign: Record<number, string[]> = {};
  planets.forEach((p) => {
    if (!planetsBySign[p.signNumber]) planetsBySign[p.signNumber] = [];
    planetsBySign[p.signNumber].push(p.name);
  });

  return (
    <div className="bg-[#150D2A] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-cosmic flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <h3 className="font-serif text-lg font-bold text-[#F7DF94]">South Indian Chart</h3>
        <span className="text-xs bg-[#25184B] px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D8C7A5]">
          Fixed Zodiac Grid
        </span>
      </div>

      <div className="w-full max-w-[420px] aspect-square grid grid-cols-4 grid-rows-4 gap-1 p-2 bg-[#191233] border-2 border-[#D4AF37] rounded-xl">
        {/* Render grid cells */}
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            // Check if cell is the open center (r: 1..2, c: 1..2)
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key={`${r}-${c}`}
                    className="col-span-2 row-span-2 flex flex-col items-center justify-center p-3 text-center bg-[#0F0B1E] border border-[#D4AF37]/20 rounded-lg"
                  >
                    <span className="font-serif text-sm font-bold text-[#D4AF37]">
                      {chartData.meta.fullName}
                    </span>
                    <span className="text-[10px] text-[#D8C7A5]/70 mt-1">
                      {chartData.meta.dateOfBirth} | {chartData.meta.timeOfBirth}
                    </span>
                    <span className="text-[10px] text-[#F7DF94] font-semibold mt-1">
                      Asc: {ascendant.signName}
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

            return (
              <div
                key={`${r}-${c}`}
                className={`p-1.5 flex flex-col justify-between border border-[#D4AF37]/30 rounded text-[11px] min-h-[75px] ${
                  isLagna ? 'bg-[#2A174E]' : 'bg-[#150D2A]/60'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-semibold text-[#D4AF37]">{entry[1].name}</span>
                  {isLagna && (
                    <span className="bg-[#D4AF37] text-[#0F0B1E] font-bold px-1 rounded text-[9px]">
                      ASC
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-[#F7DF94] font-medium leading-tight">
                  {signPlanets.length > 0 ? signPlanets.join(', ') : '-'}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 text-center text-xs text-[#D8C7A5]/70 max-w-sm">
        <p>In South Indian charts, houses (Rashis) remain stationary in clockwise order starting from Pisces at top-left.</p>
      </div>
    </div>
  );
}
