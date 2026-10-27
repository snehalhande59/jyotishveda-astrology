'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import { Sparkles, Moon, Star, Compass, Award, CheckCircle } from 'lucide-react';

export default function NakshatraFinderPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculateNakshatra = async (formData: BirthFormData) => {
    setLoading(true);
    try {
      const res = await api.generateKundli(formData);
      setResult({
        fullName: formData.fullName,
        moonSign: res.chartData.moonSign,
        meta: res.chartData.meta,
      });
    } catch (err: any) {
      alert(err.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
            <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>The 27 Lunar Constellations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Vedic Nakshatra &amp; Pada Finder
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto">
            Calculate your Janma Nakshatra (birth star), exact Pada (quarter), and governing celestial deity with astronomical accuracy.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <BirthDetailsForm
              onSubmit={handleCalculateNakshatra}
              isLoading={loading}
              buttonText="Calculate My Janma Nakshatra"
            />
          </div>

          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-[#150D2A] text-[#FDFBF7] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic space-y-6">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                  Janma Nakshatra Revealed
                </span>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-[#F7DF94]">
                      {result.moonSign.nakshatra}
                    </h3>
                    <p className="text-xs text-[#D8C7A5] mt-1">
                      Pada {result.moonSign.pada} • Rashi: {result.moonSign.signName} ({result.moonSign.signSanskrit})
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#25184B] border border-[#D4AF37] flex items-center justify-center text-xl text-[#F7DF94]">
                    ✨
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#0F0B1E] p-4 rounded-xl border border-[#D4AF37]/20">
                  <div>
                    <span className="text-[#D8C7A5]/60 block">Governing Planet:</span>
                    <strong className="text-[#FDFBF7]">{result.moonSign.nakshatraLord || 'Surya'}</strong>
                  </div>
                  <div>
                    <span className="text-[#D8C7A5]/60 block">Nakshatra Pada:</span>
                    <strong className="text-[#FDFBF7]">Quarter {result.moonSign.pada} of 4</strong>
                  </div>
                  <div>
                    <span className="text-[#D8C7A5]/60 block">Degrees in Sign:</span>
                    <strong className="text-[#D4AF37]">{result.moonSign.degreeFormatted}</strong>
                  </div>
                </div>

                <div className="bg-[#191233] p-5 rounded-2xl border border-[#D4AF37]/20 text-xs text-[#D8C7A5] space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#F7DF94]">
                    Significance of Your Birth Star
                  </h4>
                  <p className="leading-relaxed">
                    Your Janma Nakshatra reveals the fine emotional fabric of your subconscious mind. It directly governs the starting cycle of your <strong>Vimshottari Mahadasha</strong>, dictates marital compatibility (Kuta matching), and reveals favorable Muhurats for important ventures.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#150D2A]">
                  What is a Vedic Nakshatra?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  While Western astrology only divides the zodiac into 12 signs, the ancient Vedic seers mapped <strong>27 Nakshatras</strong> (lunar mansions) of 13 degrees 20 minutes each.
                </p>
                <div className="space-y-3 text-xs text-gray-700">
                  <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
                    <strong className="text-[#8C6D1F] block mb-1">1. The 4 Padas</strong>
                    Each constellation is split into 4 quarters called Padas (3° 20&apos; each). 27 × 4 = 108 Padas, which correspond to the 108 beads of the traditional Vedic Japa Mala.
                  </div>
                  <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
                    <strong className="text-[#8C6D1F] block mb-1">2. First Letter of Name</strong>
                    Traditional Indian naming rituals (Nama Karana) select the child&apos;s auspicious first syllable based on the precise Nakshatra and Pada active at birth.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
