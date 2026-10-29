'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Compass, Star, Heart, Calendar, BookOpen, User, Sparkles, ArrowRight } from 'lucide-react';

interface SearchItem {
  title: string;
  category: 'Tools' | 'Horoscope' | 'Reports' | 'Consultations' | 'Festivals' | 'Healing';
  url: string;
  description: string;
}

const SEARCH_DIRECTORY: SearchItem[] = [
  // Tools
  { title: 'Free Janam Kundli / Birth Chart', category: 'Tools', url: '/kundli', description: 'Complete 12 Bhavas, planetary longitudes, and Vimshottari Dasha' },
  { title: 'Kundli Milan (Guna Match)', category: 'Tools', url: '/compatibility', description: '36-point Ashta Kuta Vedic marriage matching' },
  { title: 'Today Vedic Panchang', category: 'Tools', url: '/panchang', description: 'Tithi, Nakshatra, Yoga, Karana, and Rahu Kaal timings' },
  { title: 'Numerology Calculator', category: 'Tools', url: '/numerology', description: 'Calculate Life Path, Destiny, and Soul Urge numbers' },
  { title: 'Nakshatra & Pada Finder', category: 'Tools', url: '/nakshatra-finder', description: 'Find your governing lunar mansion and planetary deity' },
  { title: 'Zodiac Sign (Rashi) Finder', category: 'Tools', url: '/zodiac-finder', description: 'Discover your true Sidereal Moon Sign (Chandra Rashi)' },
  { title: 'All Free Astrology Tools Directory', category: 'Tools', url: '/tools', description: 'Explore all 8 free Vedic computation utilities' },

  // Horoscope
  { title: 'Daily Horoscope (Aaj Ka Rashifal)', category: 'Horoscope', url: '/horoscope', description: 'Daily celestial transit forecasts for all 12 rashis' },
  { title: 'Aries Daily Horoscope (Mesha)', category: 'Horoscope', url: '/horoscope?sign=Aries', description: 'Mars-ruled fire sign daily guidance' },
  { title: 'Taurus Daily Horoscope (Vrishabha)', category: 'Horoscope', url: '/horoscope?sign=Taurus', description: 'Venus-ruled earth sign daily guidance' },
  { title: 'Gemini Daily Horoscope (Mithuna)', category: 'Horoscope', url: '/horoscope?sign=Gemini', description: 'Mercury-ruled air sign daily guidance' },
  { title: 'Cancer Daily Horoscope (Karka)', category: 'Horoscope', url: '/horoscope?sign=Cancer', description: 'Moon-ruled water sign daily guidance' },
  { title: 'Leo Daily Horoscope (Simha)', category: 'Horoscope', url: '/horoscope?sign=Leo', description: 'Sun-ruled fire sign daily guidance' },
  { title: 'Virgo Daily Horoscope (Kanya)', category: 'Horoscope', url: '/horoscope?sign=Virgo', description: 'Mercury-ruled earth sign daily guidance' },
  { title: 'Libra Daily Horoscope (Tula)', category: 'Horoscope', url: '/horoscope?sign=Libra', description: 'Venus-ruled air sign daily guidance' },
  { title: 'Scorpio Daily Horoscope (Vrishchika)', category: 'Horoscope', url: '/horoscope?sign=Scorpio', description: 'Mars-ruled water sign daily guidance' },
  { title: 'Sagittarius Daily Horoscope (Dhanu)', category: 'Horoscope', url: '/horoscope?sign=Sagittarius', description: 'Jupiter-ruled fire sign daily guidance' },
  { title: 'Capricorn Daily Horoscope (Makara)', category: 'Horoscope', url: '/horoscope?sign=Capricorn', description: 'Saturn-ruled earth sign daily guidance' },
  { title: 'Aquarius Daily Horoscope (Kumbha)', category: 'Horoscope', url: '/horoscope?sign=Aquarius', description: 'Saturn-ruled air sign daily guidance' },
  { title: 'Pisces Daily Horoscope (Meena)', category: 'Horoscope', url: '/horoscope?sign=Pisces', description: 'Jupiter-ruled water sign daily guidance' },
  { title: '12 Zodiac Signs Guide', category: 'Horoscope', url: '/zodiac-signs', description: 'Attributes, Sanskrit names, lords, and compatibilities' },

  // Reports
  { title: 'Detailed 50-Page Kundli Report', category: 'Reports', url: '/reports/premium-kundli', description: 'Comprehensive roadmap of all 12 houses and 10-year Dasha' },
  { title: 'Career & Professional Destiny Report', category: 'Reports', url: '/reports/career', description: '10th House Karma Bhava analysis & favorable industries' },
  { title: 'Marriage & Relationship Report', category: 'Reports', url: '/reports/marriage', description: '7th House Kalatra Bhava insights & partner timing' },
  { title: 'Finance & Wealth Report', category: 'Reports', url: '/reports/finance', description: 'Dhana Yogas, Lakshmi Yogas, and wealth accumulation' },
  { title: 'Pricing & Astrology Reports Catalog', category: 'Reports', url: '/pricing', description: 'View all transparent consultation & report fees' },

  // Consultations
  { title: 'Verified Vedic Astrologers Directory', category: 'Consultations', url: '/astrologers', description: 'Schedule 1-on-1 private video calls with verified scholars' },
  { title: 'Book Video Consultation', category: 'Consultations', url: '/booking', description: '45-minute confidential session with an Acharya' },
  { title: 'User Wallet & Recharge', category: 'Consultations', url: '/wallet', description: 'Add credits for instant astrologer chat and consultations' },

  // Festivals & Healing
  { title: 'Vedic Festivals & Muhurat Calendar 2026', category: 'Festivals', url: '/festivals', description: 'Diwali, Maha Shivratri, Holi, Navratri, and Makar Sankranti dates' },
  { title: 'Vedic Healing, Gemstones & Mantras', category: 'Healing', url: '/healing', description: 'Prescribed Jyotish gemstones, Rudraksha, and sacred mantras' },
  { title: 'Jyotish Articles & Ephemeris Wisdom', category: 'Healing', url: '/blog', description: 'Read authentic research on Lahiri Ayanamsa and Parashara Hora' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? SEARCH_DIRECTORY.slice(0, 8)
    : SEARCH_DIRECTORY.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-8 sm:pt-24 px-3 sm:px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE1D2] rounded-2xl shadow-2xl overflow-hidden text-[#2D1810] max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#EAE1D2] bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#D97706] mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kundli, Horoscope, Nakshatra, Astrologers, Festivals, Remedies..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400 text-[#2D1810]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-700 mr-2 text-xs font-medium"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#F3ECE1] p-2 bg-[#FFFDF9]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No matching Vedic tools, reports, or articles found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <Link
                key={idx}
                href={item.url}
                onClick={onClose}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF9EB] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-semibold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                      {item.category}
                    </span>
                    <strong className="text-xs text-[#2D1810] group-hover:text-[#D97706] font-medium">
                      {item.title}
                    </strong>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#D97706] group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </Link>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#FAF7F2] border-t border-[#EAE1D2] flex justify-between items-center text-[11px] text-gray-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] text-gray-700">ESC</kbd> to dismiss</span>
          <span className="text-[#D97706] font-semibold">JyotishVeda Ephemeris Search</span>
        </div>
      </div>
    </div>
  );
}
