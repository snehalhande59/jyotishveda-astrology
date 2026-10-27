'use client';

import React, { useState } from 'react';
import { calculateNumerology } from '@/lib/numerology';
import { Sparkles, Hash, Calendar, User, Compass, CheckCircle } from 'lucide-react';

export default function NumerologyPage() {
  const [fullName, setFullName] = useState('Aryavarta Sharma');
  const [birthDate, setBirthDate] = useState('1995-08-15');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !birthDate) return;
    const res = calculateNumerology(fullName, birthDate);
    setResult(res);
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
            <Hash className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sankhya Shastra • Cosmic Numerology</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Vedic &amp; Classical Numerology Calculator
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto">
            Calculate your Life Path Number, Destiny/Expression Number, and Soul Urge with classical planetary deities.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#8C6D1F]" />
                <span>Full Name (as given at birth)</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aryavarta Sharma"
                className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8C6D1F]" />
                <span>Date of Birth</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#D4AF37]/30 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm rounded-xl shadow-gold hover:opacity-95 transition-all"
            >
              Calculate Cosmic Numbers
            </button>
          </form>
        </div>

        {/* Results Showcase */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <span className="text-xs font-semibold text-[#8C6D1F] uppercase tracking-widest">Numerology Blueprint</span>
              <h2 className="font-serif text-3xl font-bold text-[#150D2A] mt-1">
                Cosmic Profile for {result.fullName}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Life Path Card */}
              <div className="bg-[#150D2A] text-[#FDFBF7] p-6 rounded-3xl border-2 border-[#D4AF37] shadow-cosmic space-y-3 text-center">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Life Path Number</span>
                <div className="w-16 h-16 rounded-full bg-[#25184B] border-2 border-[#D4AF37] flex items-center justify-center font-serif text-3xl font-bold text-[#F7DF94] mx-auto shadow-gold">
                  {result.lifePath.number}
                </div>
                <h4 className="font-serif text-base font-bold text-[#FDFBF7]">
                  Ruling Lord: {result.lifePath.planet}
                </h4>
                <span className="text-xs text-[#D4AF37] block font-semibold">({result.lifePath.sanskrit})</span>
                <p className="text-xs text-[#D8C7A5]/80 leading-relaxed pt-2 border-t border-[#D4AF37]/20">
                  {result.lifePath.description}
                </p>
              </div>

              {/* Destiny Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-3 text-center">
                <span className="text-[10px] text-[#8C6D1F] font-bold uppercase tracking-wider block">Destiny / Expression Number</span>
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border-2 border-[#8C6D1F] flex items-center justify-center font-serif text-3xl font-bold text-[#150D2A] mx-auto">
                  {result.destiny.number}
                </div>
                <h4 className="font-serif text-base font-bold text-[#150D2A]">
                  Ruling Lord: {result.destiny.planet}
                </h4>
                <span className="text-xs text-[#8C6D1F] block font-semibold">({result.destiny.sanskrit})</span>
                <p className="text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                  {result.destiny.description}
                </p>
              </div>

              {/* Soul Urge Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-3 text-center">
                <span className="text-[10px] text-[#8C6D1F] font-bold uppercase tracking-wider block">Soul Urge (Heart&apos;s Desire)</span>
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border-2 border-[#8C6D1F] flex items-center justify-center font-serif text-3xl font-bold text-[#150D2A] mx-auto">
                  {result.soulUrge.number}
                </div>
                <h4 className="font-serif text-base font-bold text-[#150D2A]">
                  Ruling Lord: {result.soulUrge.planet}
                </h4>
                <span className="text-xs text-[#8C6D1F] block font-semibold">({result.soulUrge.sanskrit})</span>
                <p className="text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                  {result.soulUrge.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Educational Rules Section */}
        <section className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#150D2A]">
            How Vedic Numerology (Sankhya Shastra) Operates
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            In Sankhya Shastra, numbers 1 through 9 are energetic resonances linked with the 9 celestial Grahas:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700 pt-2">
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>1 = Surya (Sun):</strong> Sovereign leadership, radiance, ambition.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>2 = Chandra (Moon):</strong> Receptivity, empathy, diplomacy, imagination.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>3 = Guru (Jupiter):</strong> Wisdom, expansive creation, optimistic counsel.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>4 = Rahu:</strong> Pragmatic structure, rebellious ingenuity, persistence.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>5 = Budha (Mercury):</strong> Speed, communication, commerce, intelligence.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>6 = Shukra (Venus):</strong> Refinement, aesthetics, matrimonial harmony.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>7 = Ketu:</strong> Introspection, psychic insight, contemplative detachment.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>8 = Shani (Saturn):</strong> Justice, endurance, organizational mastery.
            </div>
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D4AF37]/20">
              <strong>9 = Mangala (Mars):</strong> Courage, vitality, protection, righteous initiative.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
