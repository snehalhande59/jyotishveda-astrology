import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ZodiacSignsDirectoryPage() {
  const signs = await api.getZodiacSigns();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>The 12 Sidereal Rashis</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810]">
            Vedic Zodiac Signs (Rashis)
          </h1>
          <p className="text-[#786C60] text-sm sm:text-base leading-relaxed">
            In Vedic Jyotish, zodiac signs represent the twelve 30-degree divisions of the sidereal ecliptic, ruled by planetary lords and anchored to the starry constellations.
          </p>
          <div className="pt-2">
            <Link
              href="/zodiac-finder"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition-all"
            >
              <span>Calculate My Exact Moon Sign</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 12 Signs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signs.map((sign) => (
            <div
              key={sign.id}
              className="bg-white border border-[#EAE1D2] rounded-2xl p-6 hover:border-[#D97706] transition-all hover:shadow-md duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider">
                      Sign #{sign.signNumber} • {sign.element} Element
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                      {sign.name} {sign.sanskritName ? `(${sign.sanskritName})` : ''}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center font-serif text-xl font-bold text-[#D97706]">
                    {(sign.symbol || sign.name || '').substring(0, 2)}
                  </div>
                </div>

                <div className="text-xs text-[#5C4033] space-y-2 pt-2 border-t border-[#EAE1D2]">
                  <div className="flex justify-between">
                    <span className="text-[#786C60]">Ruling Graha:</span>
                    <strong className="text-[#2D1810]">{sign.ruler}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786C60]">Sidereal Dates:</span>
                    <strong className="text-[#D97706] font-mono">{sign.dateRange}</strong>
                  </div>
                  <p className="pt-2 text-xs text-[#786C60] italic leading-relaxed">
                    &quot;{sign.traits}&quot;
                  </p>
                </div>

                {/* Strengths & Compatibility */}
                <div className="pt-3 border-t border-[#EAE1D2] space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block mb-1">
                      Key Strengths:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sign.strengths?.map((st, i) => (
                        <span key={i} className="text-[10px] bg-[#FFFBEB] text-[#92400E] px-2 py-0.5 rounded border border-[#FDE68A]">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block mb-1">
                      Compatible Signs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sign.compatibleSigns?.map((cs, i) => (
                        <span key={i} className="text-[10px] bg-[#FAF7F2] text-[#5C4033] px-2 py-0.5 rounded border border-[#EAE1D2]">
                          {cs}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EAE1D2] flex items-center justify-between text-xs font-bold text-[#D97706]">
                <Link href={`/horoscope?sign=${sign.name.toLowerCase()}`} className="hover:underline">
                  View Daily Rashifal →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}