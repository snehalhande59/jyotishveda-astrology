'use client';

import React from 'react';
import { KundliChartData, HouseData } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface NorthIndianChartProps {
  chartData: KundliChartData;
  houses?: HouseData[];
  title?: string;
  subtitle?: string;
}

export default function NorthIndianChart({
  chartData,
  houses: housesProp,
  title = 'Lagna Kundli (D-1 Rashi)',
  subtitle,
}: NorthIndianChartProps) {
  const { language, translateSign, translatePlanet } = useLanguage();
  const houses = housesProp || chartData?.houses || [];
  const ascendant = chartData?.ascendant || { signName: 'Lagna', degreeFormatted: "0° 00'" };

  // Helper to find house by houseNumber (1 to 12)
  const getHouse = (num: number) => {
    return houses.find((h) => h.houseNumber === num) || {
      houseNumber: num,
      signNumber: num,
      signName: '',
      signSanskrit: '',
      occupants: [],
    };
  };

  // Center coordinate mapping for each house in North Indian layout (SVG viewBox 0 0 400 400)
  const houseCoordinates: Record<number, { cx: number; cy: number }> = {
    1: { cx: 200, cy: 110 }, // Top diamond (1st house - Tanu Bhava)
    2: { cx: 120, cy: 45 },  // Top-left upper triangle (2nd house)
    3: { cx: 45, cy: 120 },  // Left top corner triangle (3rd house)
    4: { cx: 110, cy: 200 }, // Left diamond (4th house - Sukha Bhava)
    5: { cx: 45, cy: 280 },  // Left bottom corner triangle (5th house)
    6: { cx: 120, cy: 355 }, // Bottom-left lower triangle (6th house)
    7: { cx: 200, cy: 290 }, // Bottom diamond (7th house - Kalatra Bhava)
    8: { cx: 280, cy: 355 }, // Bottom-right lower triangle (8th house)
    9: { cx: 355, cy: 280 }, // Right bottom corner triangle (9th house)
    10: { cx: 290, cy: 200 }, // Right diamond (10th house - Karma Bhava)
    11: { cx: 355, cy: 120 }, // Right top corner triangle (11th house)
    12: { cx: 280, cy: 45 },  // Top-right upper triangle (12th house)
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE1D2] shadow-sm flex flex-col items-center w-full max-w-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 px-1 gap-2">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D1810]">
            {title}
          </h3>
          {subtitle && <p className="text-[11px] text-[#786C60]">{subtitle}</p>}
        </div>
        <span className="text-xs bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A] text-[#92400E] font-medium shadow-2xs">
          {language === 'mr' ? 'लग्न:' : 'Asc:'}{' '}
          <strong className="text-[#2D1810]">
            {translateSign(ascendant.signName)} ({ascendant.degreeFormatted})
          </strong>
        </span>
      </div>

      <div className="relative w-full max-w-[420px] aspect-square">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xs">
          {/* Background */}
          <rect width="400" height="400" fill="#FFFDF9" rx="14" stroke="#EAE1D2" strokeWidth="1" />

          {/* Outer Border */}
          <rect
            x="10"
            y="10"
            width="380"
            height="380"
            fill="none"
            stroke="#D97706"
            strokeWidth="2.5"
            rx="6"
          />

          {/* Diagonal Lines Corner to Corner */}
          <line x1="10" y1="10" x2="390" y2="390" stroke="#F59E0B" strokeWidth="1.6" />
          <line x1="10" y1="390" x2="390" y2="10" stroke="#F59E0B" strokeWidth="1.6" />

          {/* Midpoint Diamond Lines */}
          <polygon
            points="200,10 390,200 200,390 10,200"
            fill="none"
            stroke="#D97706"
            strokeWidth="1.8"
          />

          {/* Render 12 Houses */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
            const h = getHouse(houseNum);
            const { cx, cy } = houseCoordinates[houseNum];
            const occupants = h.occupants || [];

            return (
              <g key={houseNum} className="transition-all hover:opacity-85">
                {/* Sign Number Indicator */}
                <text
                  x={cx}
                  y={cy - (occupants.length > 0 ? 16 : 0)}
                  textAnchor="middle"
                  fill="#92400E"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {h.signNumber}
                </text>

                {/* House occupants / Grahas */}
                {occupants.map((occ: any, idx: number) => {
                  const planetName = typeof occ === 'string' ? occ : occ.planet || occ.name;
                  const isRetro = typeof occ === 'object' && occ.isRetrograde;
                  const translatedPlanet = translatePlanet(planetName);
                  const abbrev =
                    language === 'mr'
                      ? translatedPlanet.substring(0, 3)
                      : planetName.substring(0, 2);

                  const yOffset = cy + (idx + 1) * 13 - (occupants.length > 1 ? 8 : 0);

                  return (
                    <text
                      key={idx}
                      x={cx}
                      y={yOffset}
                      textAnchor="middle"
                      fill={isRetro ? '#DC2626' : '#2D1810'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {abbrev}
                      {isRetro ? '*' : ''}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="w-full flex items-center justify-between text-[11px] text-[#786C60] pt-3 px-2 mt-2 border-t border-[#F5EFE6]">
        <span>{language === 'mr' ? '* = वक्री ग्रह (Retrograde)' : '* = Retrograde (Vakri)'}</span>
        <span>{language === 'mr' ? 'लाहिरी अयनांश' : 'Lahiri Chitrapaksha'}</span>
      </div>
    </div>
  );
}
