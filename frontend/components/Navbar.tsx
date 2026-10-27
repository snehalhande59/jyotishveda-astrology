'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, clearAuthSession, getWalletBalance } from '@/lib/auth';
import { User } from '@/lib/types';
import SearchModal from '@/components/SearchModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { MARATHI_ZODIAC } from '@/lib/translations/astrology-terms';
import {
  Sparkles,
  Menu,
  X,
  Compass,
  FileText,
  Users,
  CreditCard,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Search,
  Wallet,
  Calendar,
  Heart,
  Star,
  Sun,
  Moon,
  Clock,
  Shield,
  BookOpen,
  HelpCircle,
  PhoneCall,
  Flame,
} from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', sanskrit: 'Mesha', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', sanskrit: 'Vrishabha', symbol: '♉', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', sanskrit: 'Mithuna', symbol: '♊', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', sanskrit: 'Karka', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', sanskrit: 'Simha', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', sanskrit: 'Kanya', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', sanskrit: 'Tula', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', sanskrit: 'Vrishchika', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', sanskrit: 'Dhanu', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', sanskrit: 'Makara', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', sanskrit: 'Kumbha', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', sanskrit: 'Meena', symbol: '♓', dates: 'Feb 19 - Mar 20' },
];

const PLANETS = [
  { name: 'Surya (Sun)', glyph: '☉', transit: 'Libra (Neecha)', status: 'Active' },
  { name: 'Chandra (Moon)', glyph: '☽', transit: 'Pisces (Revati)', status: 'Waxing' },
  { name: 'Mangal (Mars)', glyph: '♂', transit: 'Cancer (Debilitated)', status: 'Direct' },
  { name: 'Budha (Mercury)', glyph: '☿', transit: 'Scorpio', status: 'Direct' },
  { name: 'Guru (Jupiter)', glyph: '♃', transit: 'Taurus (Rohini)', status: 'Retrograde' },
  { name: 'Shukra (Venus)', glyph: '♀', transit: 'Scorpio', status: 'Direct' },
  { name: 'Shani (Saturn)', glyph: '♄', transit: 'Aquarius (Moolatrikona)', status: 'Direct' },
  { name: 'Rahu', glyph: '☊', transit: 'Pisces', status: 'Retro' },
  { name: 'Ketu', glyph: '☋', transit: 'Virgo', status: 'Retro' },
];

export default function Navbar() {
  const { language, t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
    setWalletBalance(getWalletBalance());

    const handleWalletUpdate = () => setWalletBalance(getWalletBalance());
    window.addEventListener('wallet-updated', handleWalletUpdate);
    return () => window.removeEventListener('wallet-updated', handleWalletUpdate);
  }, [pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    router.push('/');
  };

  const closeDropdown = () => setActiveDropdown(null);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0F0B1E] text-[#FDFBF7] shadow-xl border-b border-[#D4AF37]/30">
        {/* 1. TOP UTILITY BAR (AstroSage Style) */}
        <div className="bg-[#090614] border-b border-[#D4AF37]/20 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1">
            {/* Left Quick Navigation Links */}
            <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto text-[#D8C7A5]">
              <Link href="/horoscope" className="hover:text-[#F7DF94] flex items-center space-x-1 whitespace-nowrap">
                <Star className="w-3 h-3 text-[#D4AF37]" />
                <span>{t('nav.rashifal')}</span>
              </Link>
              <span className="text-[#D4AF37]/30">|</span>
              <Link href="/kundli" className="hover:text-[#F7DF94] flex items-center space-x-1 whitespace-nowrap">
                <Compass className="w-3 h-3 text-[#D4AF37]" />
                <span>{t('nav.kundli')}</span>
              </Link>
              <span className="text-[#D4AF37]/30">|</span>
              <Link href="/horoscope?period=yearly" className="hover:text-[#F7DF94] whitespace-nowrap">
                <span>{t('nav.yearlyHoroscope')}</span>
              </Link>
              <span className="text-[#D4AF37]/30 hidden sm:inline">|</span>
              <Link href="/horoscope" className="hover:text-[#F7DF94] whitespace-nowrap hidden sm:inline">
                <span>{t('nav.todaysHoroscope')}</span>
              </Link>
              <span className="text-[#D4AF37]/30 hidden md:inline">|</span>
              <Link href="/panchang" className="hover:text-[#F7DF94] flex items-center space-x-1 whitespace-nowrap hidden md:inline-flex">
                <Calendar className="w-3 h-3 text-[#D4AF37]" />
                <span>{t('nav.calendar')}</span>
              </Link>
              <span className="text-[#D4AF37]/30 hidden md:inline">|</span>
              <Link href="/chat" className="text-[#F7DF94] hover:underline flex items-center space-x-1 whitespace-nowrap font-semibold">
                <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
                <span>{t('nav.chatWithAstrologer')}</span>
              </Link>
            </div>

            {/* Right Account & Wallet Controls */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Wallet Button */}
              <Link
                href="/wallet"
                className="flex items-center space-x-1.5 bg-[#25184B] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full hover:border-[#D4AF37] transition-all text-[#F7DF94]"
                title="Manage Astro Credits & Balance"
              >
                <Wallet className="w-3 h-3 text-[#D4AF37]" />
                <span className="font-semibold">₹{walletBalance.toLocaleString('en-IN')}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#D8C7A5]/80 bg-[#150D2A] px-1 rounded ml-1">
                  Add
                </span>
              </Link>

              {/* Search Modal Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1 text-[#D8C7A5] hover:text-[#F7DF94] transition-colors"
                title="Search Tools & Forecasts"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* User Authentication Status */}
              {user ? (
                <div className="flex items-center space-x-2 pl-1 border-l border-[#D4AF37]/20">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1 text-[#F7DF94] hover:underline font-medium"
                  >
                    <UserIcon className="w-3 h-3 text-[#D4AF37]" />
                    <span className="max-w-[90px] truncate">{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title={t('nav.logout')}
                    className="text-red-400 hover:text-red-300 transition-colors p-0.5 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 pl-1 border-l border-[#D4AF37]/20">
                  <Link href="/login" className="hover:text-[#F7DF94]">
                    {t('nav.signIn')}
                  </Link>
                  <span className="text-[#D4AF37]/40">/</span>
                  <Link
                    href="/register"
                    className="text-[#D4AF37] hover:text-[#F7DF94] font-semibold"
                  >
                    {t('nav.signUp')}
                  </Link>
                </div>
              )}

              {/* Language Switcher (Visible in Top Bar) */}
              <div className="pl-1 border-l border-[#D4AF37]/20">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* 2. MIDDLE BRANDING & 12 ZODIAC SIGN GRID */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#0F0B1E]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-extrabold tracking-wide bg-gradient-to-r from-[#F7DF94] via-[#D4AF37] to-[#E5C058] bg-clip-text text-transparent block leading-tight">
                JyotishVeda
              </span>
              <span className="block text-[9px] tracking-widest uppercase text-[#D8C7A5]/80 font-sans">
                Authentic Sidereal Ephemeris
              </span>
            </div>
          </Link>

          {/* 12 Zodiac Sign Grid (Desktop) */}
          <div className="hidden xl:grid grid-cols-12 gap-1.5 flex-1 max-w-3xl mx-4">
            {ZODIAC_SIGNS.map((sign) => (
              <Link
                key={sign.name}
                href={`/horoscope?sign=${sign.name}`}
                className="group flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-[#150D2A] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#25184B] transition-all text-center"
                title={`${sign.name} (${sign.sanskrit}) - ${sign.dates}`}
              >
                <span className="text-sm text-[#F7DF94] group-hover:scale-110 transition-transform leading-none">
                  {sign.symbol}
                </span>
                <span className="text-[9px] font-semibold text-[#D8C7A5] group-hover:text-white truncate w-full mt-0.5">
                  {language === 'mr' ? (MARATHI_ZODIAC[sign.name]?.mr || sign.name) : sign.name.slice(0, 3)}
                </span>
              </Link>
            ))}
          </div>

          {/* Fast CTA Buttons & Mobile Hamburger */}
          <div className="flex items-center space-x-2">
            <Link
              href="/kundli"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs shadow-gold hover:opacity-95 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Free Kundli</span>
            </Link>

            <Link
              href="/compatibility"
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#25184B] border border-[#D4AF37]/40 text-xs font-semibold text-[#F7DF94] hover:border-[#D4AF37] transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Kundli Milan</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#FDFBF7] hover:bg-[#25184B]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 3. PLANETARY SYMBOLS STRIP (Navagraha Transit Bar) */}
        <div className="bg-[#120B24] border-y border-[#D4AF37]/15 py-1 px-4 sm:px-6 lg:px-8 overflow-x-auto text-[10px]">
          <div className="max-w-7xl mx-auto flex items-center space-x-4 min-w-max text-[#D8C7A5]/80">
            <span className="font-serif font-bold text-[#F7DF94] flex items-center space-x-1">
              <Sun className="w-3 h-3 text-[#D4AF37]" />
              <span>Navagraha Positions (Lahiri):</span>
            </span>
            {PLANETS.map((p, idx) => (
              <Link
                key={idx}
                href="/panchang"
                className="flex items-center space-x-1 hover:text-[#F7DF94] transition-colors"
                title={`${p.name} transit in ${p.transit} (${p.status})`}
              >
                <span className="text-[#D4AF37] font-bold">{p.glyph}</span>
                <span className="font-medium text-[#FDFBF7]">{p.name.split(' ')[0]}:</span>
                <span className="text-[#D8C7A5]/70">{p.transit.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. MAIN NAVIGATION MENU WITH DROPDOWNS (11 Mega-Dropdowns) */}
        <nav className="hidden lg:block bg-[#150D2A] border-b border-[#D4AF37]/25 text-xs font-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {/* Home */}
              <Link
                href="/"
                className={`px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                  pathname === '/' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37]' : 'text-[#FDFBF7]'
                }`}
              >
                Home
              </Link>

              {/* Horoscope Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('horoscope')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname.startsWith('/horoscope') ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Horoscope</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'horoscope' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/horoscope" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      ☀️ Daily Horoscope (Aaj Ka Rashifal)
                    </Link>
                    <Link href="/horoscope?period=weekly" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      📅 Weekly Horoscope
                    </Link>
                    <Link href="/horoscope?period=monthly" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🌙 Monthly Horoscope
                    </Link>
                    <Link href="/horoscope?period=yearly" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ✨ Yearly Horoscope 2026
                    </Link>
                    <Link href="/zodiac-signs" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] border-t border-[#D4AF37]/15">
                      ♈ 12 Zodiac Signs (Rashis) Guide
                    </Link>
                  </div>
                )}
              </div>

              {/* Astrology Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('astrology')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/kundli' || pathname === '/birth-profile' ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Astrology</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'astrology' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/kundli" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      📜 Free Janam Kundli / Birth Chart
                    </Link>
                    <Link href="/birth-profile" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      👤 Create Sacred Birth Profile
                    </Link>
                    <Link href="/kundli" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🏛️ 12 Bhavas (Houses) Analysis
                    </Link>
                    <Link href="/kundli" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ⏳ Vimshottari Mahadasha Timeline
                    </Link>
                    <Link href="/reports/premium-kundli" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] border-t border-[#D4AF37]/15 text-[#D4AF37]">
                      ⭐ 50-Page Life Kundli Report
                    </Link>
                  </div>
                )}
              </div>

              {/* Yearly Predictions */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('yearly')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/reports/yearly' ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Yearly Predictions</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'yearly' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/horoscope?period=yearly" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      🌟 2026 Complete Rashi Forecast
                    </Link>
                    <Link href="/reports/career" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      💼 2026 Career &amp; Business Transits
                    </Link>
                    <Link href="/reports/finance" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      💰 Dhana Yoga &amp; Wealth Cycles
                    </Link>
                    <Link href="/pricing" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🪐 Shani Sade Sati Transit Guide
                    </Link>
                  </div>
                )}
              </div>

              {/* Free Reports */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('reports')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname.startsWith('/reports') ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Free Reports</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'reports' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/reports/career" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      💼 Career &amp; Education Report
                    </Link>
                    <Link href="/reports/marriage" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      💍 Marriage &amp; Compatibility Report
                    </Link>
                    <Link href="/reports/finance" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      💰 Finance &amp; Wealth Report
                    </Link>
                    <Link href="/reports/premium-kundli" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] text-[#D4AF37] font-semibold border-t border-[#D4AF37]/15">
                      📜 Detailed 50-Page Kundli Report
                    </Link>
                  </div>
                )}
              </div>

              {/* Healing & Remedies */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('healing')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/healing' ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Healing</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'healing' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/healing" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      💎 Jyotish Gemstones (Ratna)
                    </Link>
                    <Link href="/healing" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      📿 Sacred Rudraksha Recommendations
                    </Link>
                    <Link href="/healing" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🕉️ Vedic Beej Mantras &amp; Japa
                    </Link>
                    <Link href="/healing" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🔯 Sacred Yantras for Vastu
                    </Link>
                  </div>
                )}
              </div>

              {/* Panchang */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('panchang')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/panchang' ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Panchang</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'panchang' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/panchang" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      📅 Today&apos;s Vedic Panchang (5 Limbs)
                    </Link>
                    <Link href="/panchang" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ⏱️ Rahu Kaal &amp; Yamaganda Timings
                    </Link>
                    <Link href="/panchang" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ✨ Abhijit Muhurat &amp; Shubh Kaal
                    </Link>
                    <Link href="/panchang" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🌓 Tithi, Vara, Nakshatra, Yoga, Karana
                    </Link>
                  </div>
                )}
              </div>

              {/* Compatibility */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('compatibility')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/compatibility' ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Compatibility</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'compatibility' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/compatibility" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      💑 Kundli Milan (36 Guna Match)
                    </Link>
                    <Link href="/compatibility" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🔥 Manglik Dosha Analysis &amp; Remedies
                    </Link>
                    <Link href="/compatibility" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ❤️ Ashta Kuta Harmony Breakdown
                    </Link>
                    <Link href="/reports/marriage" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] border-t border-[#D4AF37]/15">
                      💍 Deep Marriage Guidance Report
                    </Link>
                  </div>
                )}
              </div>

              {/* Calculators */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('calculators')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/numerology' || pathname === '/nakshatra-finder' || pathname === '/zodiac-finder'
                      ? 'text-[#D4AF37] font-bold'
                      : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Calculators</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'calculators' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/numerology" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      🔢 Numerology (Life Path &amp; Destiny)
                    </Link>
                    <Link href="/nakshatra-finder" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🌙 Nakshatra &amp; Pada Finder
                    </Link>
                    <Link href="/zodiac-finder" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ♈ Moon Sign (Chandra Rashi) Finder
                    </Link>
                    <Link href="/tools" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] border-t border-[#D4AF37]/15 text-[#D4AF37]">
                      🌟 All Free Calculators Directory
                    </Link>
                  </div>
                )}
              </div>

              {/* Festivals */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('festivals')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/festivals' ? 'text-[#D4AF37] font-bold' : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>Festivals</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'festivals' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/festivals" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37] font-semibold text-[#F7DF94]">
                      🪔 Complete 2026 Festival Calendar
                    </Link>
                    <Link href="/festivals" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🌟 Makar Sankranti &amp; Uttarayana
                    </Link>
                    <Link href="/festivals" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🔱 Maha Shivratri Nishita Puja
                    </Link>
                    <Link href="/festivals" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🎨 Holi &amp; Holika Dahan
                    </Link>
                    <Link href="/festivals" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🌸 Chaitra &amp; Sharad Navratri
                    </Link>
                    <Link href="/festivals" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ✨ Diwali &amp; Lakshmi Puja
                    </Link>
                  </div>
                )}
              </div>

              {/* Miscellaneous */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('misc')}
                onMouseLeave={closeDropdown}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2.5 hover:text-[#D4AF37] transition-colors ${
                    pathname === '/about' || pathname === '/blog' || pathname === '/pricing' || pathname === '/faq'
                      ? 'text-[#D4AF37] font-bold'
                      : 'text-[#FDFBF7]'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'misc' && (
                  <div className="absolute top-full left-0 w-64 bg-[#191233] border border-[#D4AF37]/40 rounded-b-xl shadow-cosmic py-2 z-50">
                    <Link href="/blog" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      📖 Articles &amp; Ephemeris Wisdom
                    </Link>
                    <Link href="/astrologers" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      👥 Certified Astrologers Directory
                    </Link>
                    <Link href="/pricing" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      💳 Pricing &amp; Consultation Plans
                    </Link>
                    <Link href="/faq" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      ❓ Frequently Asked Questions
                    </Link>
                    <Link href="/about" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      🏛️ About JyotishVeda Foundation
                    </Link>
                    <Link href="/contact" onClick={closeDropdown} className="block px-4 py-2 hover:bg-[#25184B] hover:text-[#D4AF37]">
                      📬 Contact Support
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Search Shortcut */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center space-x-2 text-[11px] text-[#D8C7A5]/80 bg-[#0F0B1E] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-white transition-all"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Search JyotishVeda...</span>
              <kbd className="text-[9px] bg-[#25184B] px-1 py-0.5 rounded text-[#D4AF37] border border-[#D4AF37]/30">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </nav>

        {/* 5. SECONDARY NAVIGATION STRIP FOR UPCOMING FESTIVALS */}
        <div className="bg-[#1C1236] border-b border-[#D4AF37]/20 py-1.5 px-4 sm:px-6 lg:px-8 text-xs text-[#F7DF94]">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4">
            <div className="flex items-center space-x-2 min-w-max">
              <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px] bg-[#0F0B1E] px-2 py-0.5 rounded border border-[#D4AF37]/30 flex items-center space-x-1">
                <Flame className="w-3 h-3 text-[#D4AF37]" />
                <span>Upcoming Muhurats:</span>
              </span>
              <Link href="/festivals" className="hover:underline text-[#FDFBF7]">
                🌟 Makar Sankranti (Jan 14)
              </Link>
              <span className="text-[#D4AF37]/40">•</span>
              <Link href="/festivals" className="hover:underline text-[#FDFBF7]">
                🔱 Maha Shivratri (Feb 15)
              </Link>
              <span className="text-[#D4AF37]/40">•</span>
              <Link href="/festivals" className="hover:underline text-[#FDFBF7]">
                🎨 Holi Dahan (Mar 03)
              </Link>
              <span className="text-[#D4AF37]/40">•</span>
              <Link href="/festivals" className="hover:underline text-[#FDFBF7]">
                🌸 Chaitra Navratri (Mar 19)
              </Link>
              <span className="text-[#D4AF37]/40">•</span>
              <Link href="/festivals" className="hover:underline text-[#FDFBF7]">
                🪔 Deepawali (Nov 08)
              </Link>
            </div>

            <Link
              href="/festivals"
              className="text-[11px] font-semibold text-[#D4AF37] hover:underline min-w-max hidden sm:inline"
            >
              View Full 2026 Calendar &rarr;
            </Link>
          </div>
        </div>

        {/* 6. MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#150D2A] border-b border-[#D4AF37]/30 max-h-[80vh] overflow-y-auto px-4 pt-3 pb-8 space-y-4 text-xs">
            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                readOnly
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                placeholder="Search Kundli, Horoscope, Tools..."
                className="w-full bg-[#0F0B1E] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-xs text-[#FDFBF7] cursor-pointer"
              />
              <Search className="w-4 h-4 text-[#D4AF37] absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-2.5 bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-xl">
              <span className="text-[#D8C7A5] font-semibold text-xs">
                {language === 'mr' ? 'भाषा (Language):' : 'Select Language:'}
              </span>
              <LanguageSwitcher />
            </div>

            {/* Zodiac Sign Grid on Mobile */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                12 Zodiac Signs (Rashifal)
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {ZODIAC_SIGNS.map((sign) => (
                  <Link
                    key={sign.name}
                    href={`/horoscope?sign=${sign.name}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-lg text-center hover:bg-[#25184B]"
                  >
                    <span className="text-sm block">{sign.symbol}</span>
                    <span className="text-[9px] block text-[#D8C7A5]">{sign.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Core Links */}
            <div className="space-y-2 pt-2 border-t border-[#D4AF37]/15">
              <Link
                href="/kundli"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 bg-[#25184B] rounded-xl text-[#F7DF94] font-semibold"
              >
                <span>📜 Free Janam Kundli Calculator</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/compatibility"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 bg-[#25184B] rounded-xl text-[#F7DF94] font-semibold"
              >
                <span>💑 Kundli Milan (36 Guna Match)</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/panchang"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 bg-[#25184B] rounded-xl text-[#F7DF94] font-semibold"
              >
                <span>📅 Today&apos;s Vedic Panchang</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/wallet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 bg-[#191233] border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] font-semibold"
              >
                <span>💰 Wallet (Balance: ₹{walletBalance})</span>
                <span>Add &rarr;</span>
              </Link>
            </div>

            {/* Navigation Sections */}
            <div className="space-y-3 pt-2 border-t border-[#D4AF37]/15">
              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[10px] mb-1">Astrology Reports</p>
                <div className="pl-2 space-y-1 text-[#D8C7A5]">
                  <Link href="/reports/career" onClick={() => setMobileMenuOpen(false)} className="block py-1">Career &amp; Business Report</Link>
                  <Link href="/reports/marriage" onClick={() => setMobileMenuOpen(false)} className="block py-1">Marriage &amp; Compatibility Report</Link>
                  <Link href="/reports/finance" onClick={() => setMobileMenuOpen(false)} className="block py-1">Finance &amp; Wealth Report</Link>
                  <Link href="/reports/premium-kundli" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#F7DF94]">Detailed 50-Page Kundli Report</Link>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[10px] mb-1">Calculators &amp; Healing</p>
                <div className="pl-2 space-y-1 text-[#D8C7A5]">
                  <Link href="/numerology" onClick={() => setMobileMenuOpen(false)} className="block py-1">Numerology Calculator</Link>
                  <Link href="/nakshatra-finder" onClick={() => setMobileMenuOpen(false)} className="block py-1">Nakshatra &amp; Pada Finder</Link>
                  <Link href="/zodiac-finder" onClick={() => setMobileMenuOpen(false)} className="block py-1">Moon Sign Finder</Link>
                  <Link href="/healing" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#F7DF94]">Vedic Gemstones &amp; Remedies</Link>
                  <Link href="/festivals" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#F7DF94]">2026 Vedic Festival Calendar</Link>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[10px] mb-1">Consultations &amp; Support</p>
                <div className="pl-2 space-y-1 text-[#D8C7A5]">
                  <Link href="/astrologers" onClick={() => setMobileMenuOpen(false)} className="block py-1">Verified Astrologers Directory</Link>
                  <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1">Pricing &amp; Consultation Plans</Link>
                  <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-1">Articles &amp; Wisdom</Link>
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1">About JyotishVeda</Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1">Contact Us</Link>
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="pt-3 border-t border-[#D4AF37]/15">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-semibold text-[#F7DF94]"
                  >
                    My Dashboard ({user.username})
                  </Link>
                  <button onClick={handleLogout} className="text-red-400">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center rounded-lg border border-[#D4AF37]/40 text-[#FDFBF7]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-[#0F0B1E] font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Live Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
