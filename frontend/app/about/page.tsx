import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, ShieldCheck, BookOpen, Sun, Moon, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-20 font-sans">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F7DF94]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>The Science of Light (Jyotir-Vidya)</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#FDFBF7]">
            Understanding Vedic Astrology
          </h1>
          <p className="text-sm sm:text-base text-[#D8C7A5] leading-relaxed">
            A timeless astronomical and philosophical discipline that maps the correspondence between macrocosmic celestial movements and microcosmic human experience.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-16">
        {/* Section 1: Vedic vs Western Astrology */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/25 shadow-sm space-y-6">
          <div className="border-l-4 border-[#D4AF37] pl-4">
            <h2 className="font-serif text-2xl font-bold text-[#150D2A]">
              Vedic (Sidereal) vs. Western (Tropical) Astrology
            </h2>
            <p className="text-xs text-[#8C6D1F] font-semibold mt-1">The Critical Precession of the Equinoxes</p>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed space-y-4">
            <p>
              The fundamental divide between Western and Vedic astrology lies in the calculation of zodiacal coordinates:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-[#FAF6F0] rounded-2xl border border-[#D4AF37]/20">
                <h3 className="font-serif text-base font-bold text-[#150D2A] flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-[#8C6D1F]" />
                  <span>Western (Tropical Zodiac)</span>
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Western astrology is tied to Earth’s seasonal equinoxes. 0° Aries is defined as the exact moment of the Vernal Equinox (around March 21), regardless of where the physical stars in the sky actually are.
                </p>
              </div>

              <div className="p-5 bg-[#150D2A] text-[#FDFBF7] rounded-2xl border border-[#D4AF37]/30">
                <h3 className="font-serif text-base font-bold text-[#F7DF94] flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-[#D4AF37]" />
                  <span>Vedic (Sidereal Zodiac)</span>
                </h3>
                <p className="text-xs text-[#D8C7A5] mt-2 leading-relaxed">
                  Vedic astrology measures the physical, observable stellar constellations (Nirayana). Due to Earth’s slow axial wobble (precession of ~50.3 arcseconds per year), the physical constellations have shifted approximately <strong>24 degrees</strong> from the seasonal equinox.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-amber-50 p-4 rounded-xl border border-amber-200">
              <strong>The Lahiri (Chitrapaksha) Ayanamsa:</strong> The offset between the tropical equinox and the sidereal fixed star Chitra (Spica at 180°) is called the <em>Ayanamsa</em>. On our platform, all calculations use the officially authenticated Indian Government standard Lahiri formula.
            </p>
          </div>
        </section>

        {/* Section 2: The Core Pillars of Jyotish */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold text-[#8C6D1F] uppercase tracking-widest">Architectural Pillars</span>
            <h2 className="font-serif text-3xl font-bold text-[#150D2A] mt-1">The Anatomy of a Kundli</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm space-y-3">
              <span className="text-xs font-bold text-[#8C6D1F] uppercase tracking-wider block">1. The 9 Grahas</span>
              <h3 className="font-serif text-lg font-bold text-[#150D2A]">The Planetary Forces</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Surya (Sun), Chandra (Moon), Mangala (Mars), Budha (Mercury), Guru (Jupiter), Shukra (Venus), Shani (Saturn), and the karmic lunar nodes Rahu (North Node) and Ketu (South Node).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm space-y-3">
              <span className="text-xs font-bold text-[#8C6D1F] uppercase tracking-wider block">2. The 12 Bhavas</span>
              <h3 className="font-serif text-lg font-bold text-[#150D2A]">The Life Houses</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The 12 houses represent physical vitality (Tanu), wealth (Dhana), courage (Sahaja), home (Sukha), intellect (Putra), health (Ripu), marriage (Kalatra), transformation (Ayu), dharma (Bhagya), career (Karma), gains (Labha), and transcendence (Moksha).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm space-y-3">
              <span className="text-xs font-bold text-[#8C6D1F] uppercase tracking-wider block">3. 27 Nakshatras</span>
              <h3 className="font-serif text-lg font-bold text-[#150D2A]">The Lunar Mansions</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Each 13° 20&apos; segment of the zodiac is governed by an ancient deity and planetary lord, divided into 4 fine quarters (Padas), determining the mental temperament and Vimshottari Dasha timing.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Ethical Philosophy: Karma & Purushartha */}
        <section className="bg-[#150D2A] text-[#FDFBF7] p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-cosmic space-y-6">
          <div className="flex items-center space-x-3 text-[#D4AF37]">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="font-serif text-2xl font-bold text-[#F7DF94]">
              The Four Purusharthas (Universal Aims of Life)
            </h2>
          </div>

          <p className="text-sm text-[#D8C7A5] leading-relaxed">
            Vedic astrology is never a fatalistic superstition. In classical philosophy, destiny is not pre-scripted doom; it is an energetic terrain upon which conscious effort (Purushartha) operates. A Kundli illuminates your karmic predispositions across:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#191233] p-4 rounded-xl border border-[#D4AF37]/20">
              <strong className="text-[#F7DF94] text-sm block mb-1">1. Dharma (Righteous Duty)</strong>
              <p className="text-[#D8C7A5]/80">Houses 1, 5, and 9 guide your moral compass, authentic purpose, and spiritual integrity.</p>
            </div>
            <div className="bg-[#191233] p-4 rounded-xl border border-[#D4AF37]/20">
              <strong className="text-[#F7DF94] text-sm block mb-1">2. Artha (Material Wealth)</strong>
              <p className="text-[#D8C7A5]/80">Houses 2, 6, and 10 provide resources, professional livelihood, and financial stability.</p>
            </div>
            <div className="bg-[#191233] p-4 rounded-xl border border-[#D4AF37]/20">
              <strong className="text-[#F7DF94] text-sm block mb-1">3. Kama (Desire & Love)</strong>
              <p className="text-[#D8C7A5]/80">Houses 3, 7, and 11 govern creative passion, companionship, marriage, and social harmony.</p>
            </div>
            <div className="bg-[#191233] p-4 rounded-xl border border-[#D4AF37]/20">
              <strong className="text-[#F7DF94] text-sm block mb-1">4. Moksha (Liberation)</strong>
              <p className="text-[#D8C7A5]/80">Houses 4, 8, and 12 foster inner peace, emotional surrender, and spiritual awakening.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/kundli"
              className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs rounded-xl shadow-gold hover:opacity-95 transition-all inline-flex items-center space-x-2"
            >
              <span>Generate Your Free Birth Chart Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
