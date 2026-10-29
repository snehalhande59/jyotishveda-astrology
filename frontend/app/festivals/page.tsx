'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Sparkles, Clock, Sun, Moon, MapPin, ChevronRight, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FestivalItem {
  id: string;
  name: string;
  sanskritName: string;
  date2026: string;
  day: string;
  tithi: string;
  muhurat: string;
  category: 'Major' | 'Vrat' | 'Jayanti' | 'Purnima';
  significance: string;
  pujaVidhi: string;
}

const VEDIC_FESTIVALS: FestivalItem[] = [
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti / Pongal',
    sanskritName: 'मकर संक्रांति',
    date2026: 'January 14, 2026',
    day: 'Wednesday',
    tithi: 'Shukla Paksha Ekadashi/Dwadashi',
    muhurat: 'Punya Kaal: 07:15 AM to 12:30 PM (Duration: 5h 15m)',
    category: 'Major',
    significance: 'The Sun (Surya Deva) enters Makara Rashi (Capricorn), marking the start of Uttarayana (the auspicious six-month northward movement).',
    pujaVidhi: 'Sacred river bath, Surya Arghya with copper pot water, sesame (til) and jaggery charity.',
  },
  {
    id: 'maha-shivratri',
    name: 'Maha Shivratri',
    sanskritName: 'महाशिवरात्रि',
    date2026: 'February 15, 2026',
    day: 'Sunday',
    tithi: 'Phalguna Krishna Chaturdashi',
    muhurat: 'Nishita Kaal Puja: 12:09 AM to 01:00 AM',
    category: 'Vrat',
    significance: 'The grand celestial convergence of Shiva and Shakti. Cosmic vibration is at peak spiritual potency for overcoming ignorance and karmic obstacles.',
    pujaVidhi: 'Rudra Abhishekam with milk, honey, Bilva leaves, and overnight Jaagran with Panchakshari Mantra.',
  },
  {
    id: 'holi',
    name: 'Holi (Dhulandi & Holika Dahan)',
    sanskritName: 'होलिका दहन व धुलेंडी',
    date2026: 'March 03 - 04, 2026',
    day: 'Tuesday & Wednesday',
    tithi: 'Phalguna Purnima',
    muhurat: 'Holika Dahan Muhurat: 06:22 PM to 08:49 PM',
    category: 'Major',
    significance: 'Celebration of the triumph of Bhakti (devotion of Prahlada) over adharma, and welcoming the vernal cosmic spring.',
    pujaVidhi: 'Pradakshina around the holy fire with grains, coconut offering, and natural color celebration.',
  },
  {
    id: 'chaitra-navratri',
    name: 'Chaitra Navratri & Rama Navami',
    sanskritName: 'चैत्र नवरात्रि एवं राम नवमी',
    date2026: 'March 19 - 27, 2026',
    day: 'Thursday to Friday',
    tithi: 'Chaitra Shukla Pratipada to Navami',
    muhurat: 'Ghatasthapana Muhurat: 06:14 AM to 10:22 AM',
    category: 'Major',
    significance: 'Nine nights honoring the nine manifestations of Maa Durga (NavaDurga) and the auspicious descent of Bhagwan Shri Rama.',
    pujaVidhi: 'Kalash Sthapana, daily Durga Saptashati recitation, Kanya Pujan on Ashtami/Navami.',
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    sanskritName: 'रक्षाबंधन',
    date2026: 'August 28, 2026',
    day: 'Friday',
    tithi: 'Shravana Purnima',
    muhurat: 'Aparahna Muhurat: 01:42 PM to 04:18 PM (Avoid Bhadra)',
    category: 'Purnima',
    significance: 'Sacred bond of protection between siblings and honoring the cosmic guru parampara with Yajnopavita renewal.',
    pujaVidhi: 'Tying the sanctified Rakhi thread with rice (akshata) and chanting the Raksha Sutra.',
  },
  {
    id: 'krishna-janmashtami',
    name: 'Shri Krishna Janmashtami',
    sanskritName: 'श्री कृष्ण जन्माष्टमी',
    date2026: 'September 04, 2026',
    day: 'Friday',
    tithi: 'Bhadrapada Krishna Ashtami',
    muhurat: 'Nishita Puja: 11:58 PM to 12:44 AM (Midnight)',
    category: 'Jayanti',
    significance: 'Birth of Lord Krishna under the Rohini Nakshatra in the sacred Vrishabha (Taurus) Lagna.',
    pujaVidhi: 'Midnight panchamrita abhishekam of Laddu Gopal, makhan offering, and Harinam Sankirtana.',
  },
  {
    id: 'sharad-navratri',
    name: 'Sharad Navratri & Dussehra (Vijayadashami)',
    sanskritName: 'शारदीय नवरात्रि एवं विजयादशमी',
    date2026: 'October 11 - 20, 2026',
    day: 'Sunday to Tuesday',
    tithi: 'Ashwin Shukla Pratipada to Dashami',
    muhurat: 'Ghatasthapana: 06:21 AM to 10:14 AM',
    category: 'Major',
    significance: 'Victory of Goddess Durga over Mahishasura and Lord Rama over Ravana, symbolizing the victory of cosmic truth.',
    pujaVidhi: 'Navarna Mantra japa, fasting, Dandiya Ras, and Ayudha Puja.',
  },
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth (Karaka Chaturthi)',
    sanskritName: 'करवा चौथ',
    date2026: 'October 29, 2026',
    day: 'Thursday',
    tithi: 'Kartik Krishna Chaturthi',
    muhurat: 'Puja Muhurat: 05:44 PM to 07:02 PM | Moonrise: 08:14 PM',
    category: 'Vrat',
    significance: 'Auspicious fast observed by married women for the longevity, prosperity, and spiritual welfare of their spouses.',
    pujaVidhi: 'Sankalpa at dawn, evening Karwa Chauth Katha, viewing the Moon through a sieve and Surya/Chandra Arghya.',
  },
  {
    id: 'diwali',
    name: 'Deepawali (Lakshmi-Ganesha Puja)',
    sanskritName: 'दीपावली (महालक्ष्मी पूजन)',
    date2026: 'November 08, 2026',
    day: 'Sunday',
    tithi: 'Kartik Amavasya',
    muhurat: 'Pradosh Kaal Lakshmi Puja: 05:32 PM to 07:28 PM',
    category: 'Major',
    significance: 'The festival of divine light celebrating Goddess Lakshmi, Lord Ganesha, and the homecoming of Lord Rama to Ayodhya.',
    pujaVidhi: 'Ganesh-Lakshmi Shodashopachara puja, lighting 21 clay diyas, and reciting Shri Suktam.',
  },
];

export default function FestivalsPage() {
  const { language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filtered = selectedCat === 'All'
    ? VEDIC_FESTIVALS
    : VEDIC_FESTIVALS.filter((f) => f.category === selectedCat);

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'वैदिक पंचांग आणि शुभ मुहूर्त २०२६' : 'Vedic Calendar & Celestial Muhurats 2026'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {language === 'mr' ? 'सनातन धर्म सण आणि शुभ तिथी' : 'Sanatana Dharma Festivals & Auspicious Tithis'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'चित्रापक्ष लाहिरी पंचांगानुसार अचूक गणना. प्रमुख सण, पूजा मुहूर्त, तिथी आणि पारंपरिक वैदिक विधी जाणून घ्या.'
              : 'Calculated with high-precision Chitrapaksha Lahiri ephemeris. Discover exact dates, puja muhurats, tithis, and authentic Vedic rituals.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 pb-2">
          <Filter className="w-4 h-4 text-[#D97706] flex-shrink-0" />
          <span className="text-xs font-semibold text-[#786C60] mr-2">
            {language === 'mr' ? 'फिल्टर:' : 'Filter:'}
          </span>
          {['All', 'Major', 'Vrat', 'Jayanti', 'Purnima'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-[#D97706] text-white shadow-sm border border-[#D97706]'
                  : 'bg-white text-[#5C4033] border border-[#EAE1D2] hover:border-[#D97706]'
              }`}
            >
              {cat === 'All' ? (language === 'mr' ? 'सर्व सण' : 'All Festivals') : `${cat} Festivals`}
            </button>
          ))}
        </div>

        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((fest) => (
            <div
              key={fest.id}
              className="bg-white border border-[#EAE1D2] rounded-3xl p-4 sm:p-6 shadow-sm hover:border-[#D97706] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                    {fest.category} Festival
                  </span>
                  <span className="text-xs font-serif font-bold text-[#B45309]">
                    {fest.sanskritName}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#2D1810] mt-1">
                  {fest.name}
                </h3>

                <div className="mt-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2] space-y-1.5 text-xs text-[#5C4033]">
                  <div className="flex items-center space-x-2 font-semibold text-[#2D1810]">
                    <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{fest.date2026} ({fest.day})</span>
                  </div>
                  <div className="flex items-start space-x-2 text-[11px] text-[#B45309]">
                    <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{fest.muhurat}</span>
                  </div>
                  <div className="text-[11px] text-[#786C60]">
                    <strong>Tithi:</strong> {fest.tithi}
                  </div>
                </div>

                <p className="text-xs text-[#786C60] mt-4 leading-relaxed">
                  {fest.significance}
                </p>

                <div className="mt-4 pt-3 border-t border-[#EAE1D2] text-[11px] text-[#5C4033]">
                  <strong className="text-[#2D1810] block mb-1">
                    {language === 'mr' ? 'पूजन विधी:' : 'Recommended Vidhi:'}
                  </strong>
                  <span>{fest.pujaVidhi}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE1D2] flex items-center justify-between">
                <Link
                  href="/panchang"
                  className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center"
                >
                  <span>{language === 'mr' ? 'आजचे पंचांग पहा' : "Check Today's Panchang"}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link
                  href="/astrologers"
                  className="px-3 py-1.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {language === 'mr' ? 'सल्ला घ्या' : 'Consult Acharya'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
