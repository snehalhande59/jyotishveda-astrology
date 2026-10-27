import React from 'react';
import Link from 'next/link';
import {
  Compass,
  HeartHandshake,
  Sun,
  Moon,
  Sparkles,
  Binary,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

const TOOLS = [
  {
    title: 'Free Vedic Kundli (Birth Chart)',
    description: 'Calculate your authentic sidereal birth chart with North & South Indian SVG visuals, 12 Bhavas, and Vimshottari Mahadasha timeline.',
    icon: Compass,
    href: '/kundli',
    badge: 'Core Tool',
  },
  {
    title: 'Kundli Milan (36 Guna Matching)',
    description: 'Ashta Kuta compatibility analysis measuring mental, physical, and karmic resonance between two prospective partners.',
    icon: HeartHandshake,
    href: '/compatibility',
    badge: 'Popular',
  },
  {
    title: 'Vedic Panchang (Daily Ephemeris)',
    description: 'Real-time calculation of the 5 sacred cosmic limbs: Tithi, Vaara, Nakshatra, Yoga, and Karana with Rahu Kalam & Muhurats.',
    icon: Calendar,
    href: '/panchang',
    badge: 'Astronomical',
  },
  {
    title: 'Daily Rashifal (Horoscope)',
    description: 'Authentic sidereal guidance and celestial weather forecasts for all 12 Moon signs (Rashis) with career, love, and health notes.',
    icon: Sun,
    href: '/horoscope',
    badge: 'Updated Daily',
  },
  {
    title: 'Zodiac Sign (Rashi) Finder',
    description: 'Discover your true sidereal Moon sign (Chandra Rashi) and Sun sign based on precise astronomical coordinates.',
    icon: Layers,
    href: '/zodiac-finder',
    badge: 'Free Lookup',
  },
  {
    title: 'Nakshatra & Pada Finder',
    description: 'Identify your natal Lunar mansion among the 27 Nakshatras, revealing your ruling planetary deity and life orientation.',
    icon: Moon,
    href: '/nakshatra-finder',
    badge: 'Natal Ephemeris',
  },
  {
    title: 'Vedic Numerology Calculator',
    description: 'Unlock your Life Path number, Destiny number, and Soul Urge vibration derived from traditional Pythagorean & Vedic algorithms.',
    icon: Binary,
    href: '/numerology',
    badge: 'Instant Results',
  },
  {
    title: '27 Nakshatras Directory',
    description: 'Browse the complete encyclopedia of all 27 Vedic constellations, their lords, mythic deities, and spiritual powers.',
    icon: Sparkles,
    href: '/nakshatras',
    badge: 'Directory',
  },
  {
    title: '12 Vedic Zodiac Rashis',
    description: 'Explore the 12 sidereal signs of the zodiac, from Mesha (Aries) to Meena (Pisces), their elements, rulers, and qualities.',
    icon: Layers,
    href: '/zodiac-signs',
    badge: 'Directory',
  },
];

export default function FreeToolsPage() {
  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free Astronomical Tools</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-[#F7DF94] via-[#D4AF37] to-[#E5C058] bg-clip-text text-transparent">
            Free Vedic Astrology Tools
          </h1>
          <p className="text-[#D8C7A5]/80 text-sm sm:text-base leading-relaxed">
            All tools calculate genuine sidereal positions with the Chitrapaksha / Lahiri Ayanamsa. We believe primary astronomical knowledge should be universally accessible.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link
                key={idx}
                href={tool.href}
                className="bg-[#191233]/70 border border-[#D4AF37]/25 rounded-2xl p-6 hover:border-[#D4AF37] transition-all hover:shadow-gold duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#0F0B1E] transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#25184B] text-[#F7DF94] border border-[#D4AF37]/20 uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#FDFBF7] group-hover:text-[#F7DF94] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#D8C7A5]/80 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#D4AF37]/10 flex items-center justify-between text-xs font-semibold text-[#D4AF37] group-hover:text-[#F7DF94]">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
