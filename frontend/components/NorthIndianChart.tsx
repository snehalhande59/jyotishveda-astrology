'use client';

import React from 'react';
import { KundliChartData, HouseData } from '@/lib/types';

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
    1: { cx: 200, cy: 110 }, // Top diamond
    2: { cx: 120, cy: 45 },  // Top-left upper triangle
    3: { cx: 45, cy: 120 },  // Left top corner triangle
    4: { cx: 110, cy: 200 }, // Left diamond
    5: { cx: 45, cy: 280 },  // Left bottom corner triangle
    6: { cx: 120, cy: 355 }, // Bottom-left lower triangle
    7: { cx: 200, cy: 290 }, // Bottom diamond
    8: { cx: 280, cy: 355 }, // Bottom-right lower triangle
    9: { cx: 355, cy: 280 }, // Right bottom corner triangle
    10: { cx: 290, cy: 200 }, // Right diamond
    11: { cx: 355, cy: 120 }, // Right top corner triangle
    12: { cx: 280, cy: 45 },  // Top-right upper triangle
  };

  return (
    <div className="bg-[#150D2A] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-cosmic flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <h3 className="font-serif text-lg font-bold text-[#F7DF94]">{title}</h3>
        <span className="text-xs bg-[#25184B] px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D8C7A5]">
          Asc: <strong className="text-[#FDFBF7]">{ascendant.signName} ({ascendant.degreeFormatted})</strong>
        </span>
      </div>

      <div className="relative w-full max-w-[420px] aspect-square">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
          {/* Background */}
          <rect width="400" height="400" fill="#191233" rx="12" />

          {/* Outer Border */}
          <rect
            x="10"
            y="10"
            width="380"
            height="380"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3"
            rx="4"
          />

          {/* Diagonal Lines Corner to Corner */}
          <line x1="10" y1="10" x2="390" y2="390" stroke="#D4AF37" strokeWidth="1.8" />
          <line x1="10" y1="390" x2="390" y2="10" stroke="#D4AF37" strokeWidth="1.8" />

          {/* Midpoint Diamond Lines */}
          <polygon
            points="200,10 390,200 200,390 10,200"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* Render 12 Houses */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
            const h = getHouse(houseNum);
            const { cx, cy } = houseCoordinates[houseNum];

            return (
              <g key={houseNum} className="cursor-pointer">
                {/* Sign Number Indicator */}
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  fill="#D4AF37"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {h.signNumber}
                </text>

                {/* House Label (subtle Roman numeral or 'H') */}
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  fill="#FDFBF7"
                  fontSize="9"
                  opacity="0.4"
                  fontFamily="sans-serif"
                >
                  H{houseNum}
                </text>

                {/* Occupying Planets */}
                {h.occupants && h.occupants.length > 0 ? (
                  <text
                    x={cx}
                    y={cy + 15}
                    textAnchor="middle"
                    fill="#F7DF94"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {h.occupants.join(', ')}
                  </text>
                ) : (
                  <text
                    x={cx}
                    y={cy + 15}
                    textAnchor="middle"
                    fill="#D8C7A5"
                    fontSize="9"
                    opacity="0.3"
                  >
                    -
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 text-center text-xs text-[#D8C7A5]/70 max-w-sm">
        <p>Top central diamond represents 1st House (Lagna). Sign numbers (1=Aries ... 12=Pisces) progress counter-clockwise.</p>
      </div>
    </div>
  );
}
