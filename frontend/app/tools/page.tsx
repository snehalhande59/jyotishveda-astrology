'use client';

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
import { useLanguage } from '@/context/LanguageContext';

export default function FreeToolsPage() {
  const { language } = useLanguage();

  const TOOLS = [
    {
      title: language === 'mr' ? 'मोफत वैदिक कुंडली' : 'Free Vedic Kundli (Birth Chart)',
      description: language === 'mr'
        ? 'उत्तर आणि दक्षिण भारतीय शैली, १२ भाव आणि १२० वर्षांच्या विंशोत्तरी महादशा सह अचूक जन्मपत्रिका काढा.'
        : 'Calculate your authentic sidereal birth chart with North & South Indian SVG visuals, 12 Bhavas, and Vimshottari Mahadasha timeline.',
      icon: Compass,
      href: '/kundli',
      badge: language === 'mr' ? 'प्रमुख साधन' : 'Core Tool',
    },
    {
      title: language === 'mr' ? 'कुंडली मिलन (३६ गुण)' : 'Kundli Milan (36 Guna Matching)',
      description: language === 'mr'
        ? 'वर आणि वधू यांच्यातील मानसिक, शारीरिक आणि भाग्य सुसंगततेचे अष्टकूट गुण मिलन विश्लेषण.'
        : 'Ashta Kuta compatibility analysis measuring mental, physical, and karmic resonance between two prospective partners.',
      icon: HeartHandshake,
      href: '/compatibility',
      badge: language === 'mr' ? 'लोकप्रिय' : 'Popular',
    },
    {
      title: language === 'mr' ? 'दैनिक वैदिक पंचांग' : 'Vedic Panchang (Daily Ephemeris)',
      description: language === 'mr'
        ? 'तिथी, वार, नक्षत्र, योग आणि करण या ५ पवित्र अंगांची अचूक गणना आणि राहुकाळ व शुभ मुहूर्त.'
        : 'Real-time calculation of the 5 sacred cosmic limbs: Tithi, Vaara, Nakshatra, Yoga, and Karana with Rahu Kalam & Muhurats.',
      icon: Calendar,
      href: '/panchang',
      badge: language === 'mr' ? 'खगोलीय' : 'Astronomical',
    },
    {
      title: language === 'mr' ? 'दैनिक राशीभविष्य' : 'Daily Rashifal (Horoscope)',
      description: language === 'mr'
        ? 'सर्व १२ राशींसाठी करिअर, प्रेम, आर्थिक व आरोग्य क्षेत्रातील प्रामाणिक राशीभविष्य.'
        : 'Authentic sidereal guidance and celestial weather forecasts for all 12 Moon signs (Rashis) with career, love, and health notes.',
      icon: Sun,
      href: '/horoscope',
      badge: language === 'mr' ? 'दररोज अद्यतनित' : 'Updated Daily',
    },
    {
      title: language === 'mr' ? 'राशी शोधक' : 'Zodiac Sign (Rashi) Finder',
      description: language === 'mr'
        ? 'अचूक जन्म वेळेनुसार आपली खरी चंद्र राशी (Chandra Rashi) आणि सूर्य राशी शोधा.'
        : 'Discover your true sidereal Moon sign (Chandra Rashi) and Sun sign based on precise astronomical coordinates.',
      icon: Layers,
      href: '/zodiac-finder',
      badge: language === 'mr' ? 'मोफत' : 'Free Lookup',
    },
    {
      title: language === 'mr' ? 'नक्षत्र व चरण शोधक' : 'Nakshatra & Pada Finder',
      description: language === 'mr'
        ? '२७ नक्षत्रांपैकी आपले जन्म नक्षत्र, चरण आणि सत्ताधारी देवता जाणून घ्या.'
        : 'Identify your natal Lunar mansion among the 27 Nakshatras, revealing your ruling planetary deity and life orientation.',
      icon: Moon,
      href: '/nakshatra-finder',
      badge: language === 'mr' ? 'नक्षत्र गणना' : 'Natal Ephemeris',
    },
    {
      title: language === 'mr' ? 'वैदिक अंकशास्त्र गणक' : 'Vedic Numerology Calculator',
      description: language === 'mr'
        ? 'आपला मूलांक, भाग्यांक आणि नामांक यांचे वैदिक अंकशास्त्रानुसार विश्लेषण करा.'
        : 'Unlock your Life Path number, Destiny number, and Soul Urge vibration derived from traditional Pythagorean & Vedic algorithms.',
      icon: Binary,
      href: '/numerology',
      badge: language === 'mr' ? 'त्वरित निकाल' : 'Instant Results',
    },
    {
      title: language === 'mr' ? '२७ नक्षत्र निर्देशिका' : '27 Nakshatras Directory',
      description: language === 'mr'
        ? 'सर्व २७ नक्षत्रांचे स्वामी, देवता आणि आध्यात्मिक सामर्थ्य यांची संपूर्ण माहिती.'
        : 'Browse the complete encyclopedia of all 27 Vedic constellations, their lords, mythic deities, and spiritual powers.',
      icon: Sparkles,
      href: '/nakshatras',
      badge: language === 'mr' ? 'निर्देशिका' : 'Directory',
    },
    {
      title: language === 'mr' ? '१२ वैदिक राशी' : '12 Vedic Zodiac Rashis',
      description: language === 'mr'
        ? 'मेष ते मीन पर्यंतच्या १२ राशींचे घटक, स्वामी ग्रह आणि स्वभाव वैशिष्ट्ये जाणून घ्या.'
        : 'Explore the 12 sidereal signs of the zodiac, from Mesha (Aries) to Meena (Pisces), their elements, rulers, and qualities.',
      icon: Layers,
      href: '/zodiac-signs',
      badge: language === 'mr' ? 'निर्देशिका' : 'Directory',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? '१००% मोफत खगोलीय साधने' : '100% Free Astronomical Tools'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'मोफत वैदिक ज्योतिष साधने' : 'Free Vedic Astrology Tools'}
          </h1>
          <p className="text-[#786C60] text-sm sm:text-base leading-relaxed">
            {language === 'mr'
              ? 'सर्व साधने चित्रापक्ष / लाहिरी अयनांशासह अस्सल निरयन स्थाने मोजतात. मूलभूत खगोलीय ज्ञान सर्वांसाठी खुले असावे असा आमचा विश्वास आहे.'
              : 'All tools calculate genuine sidereal positions with the Chitrapaksha / Lahiri Ayanamsa. We believe primary astronomical knowledge should be universally accessible.'}
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
                className="bg-white border border-[#EAE1D2] rounded-2xl p-6 hover:border-[#D97706] transition-all hover:shadow-md duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] group-hover:scale-105 group-hover:bg-[#D97706] group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#92400E] border border-[#EAE1D2] uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#2D1810] group-hover:text-[#D97706] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#786C60] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EAE1D2] flex items-center justify-between text-xs font-bold text-[#D97706] group-hover:text-[#B45309]">
                  <span>{language === 'mr' ? 'साधन उघडा' : 'Launch Tool'}</span>
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
