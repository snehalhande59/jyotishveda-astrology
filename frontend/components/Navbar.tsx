'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, clearAuthSession, getWalletBalance } from '@/lib/auth';
import { sendHeartbeat } from '@/lib/analytics';
import { getCartTotals } from '@/lib/cart';
import { User } from '@/lib/types';
import SearchModal from '@/components/SearchModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  Menu,
  X,
  Compass,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Wallet,
  Calendar,
  Heart,
  Star,
  PhoneCall,
  MessageSquare,
  ShoppingBag,
  ShoppingCart,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Bell,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';

const CALCULATORS_COL_1 = [
  { href: '/calculators/love', label: 'Love Calculator', labelMr: 'लव्ह कॅल्क्युलेटर' },
  { href: '/calculators/numerology', label: 'Numerology Calculator', labelMr: 'न्यूमरोलॉजी कॅल्क्युलेटर' },
  { href: '/calculators/rising-sign', label: 'Rising Sign Calculator', labelMr: 'लग्न राशी कॅल्क्युलेटर' },
  { href: '/calculators/dasha', label: 'Dasha Calculator', labelMr: 'विंशोत्तरी दशा कॅल्क्युलेटर' },
  { href: '/calculators/mangal-dosha', label: 'Mangal Dosha Calculator', labelMr: 'मंगळ दोष कॅल्क्युलेटर' },
  { href: '/calculators/moon-phase', label: 'Moon Phase Calculator', labelMr: 'चंद्र कला व तिथी कॅल्क्युलेटर' },
  { href: '/calculators/flames', label: 'Flames Calculator', labelMr: 'फ्लेम्स (FLAMES) कॅल्क्युलेटर' },
  { href: '/calculators/friendship', label: 'Friendship Calculator', labelMr: 'मैत्री सुसंगतता कॅल्क्युलेटर' },
  { href: '/calculators/ishta-devata', label: 'Ishta Devata Calculator', labelMr: 'इष्ट देवता कॅल्क्युलेटर' },
  { href: '/calculators/transit-chart', label: 'Transit Chart Calculator', labelMr: 'गोचर कुंडली कॅल्क्युलेटर' },
];

const CALCULATORS_COL_2 = [
  { href: '/calculators/atmakaraka-darakaraka', label: 'Atmakaraka & Darakaraka Calculator', labelMr: 'आत्मकारक व दारकारक कॅल्क्युलेटर' },
  { href: '/calculators/sun-sign', label: 'Sun Sign Calculator', labelMr: 'सूर्य राशी कॅल्क्युलेटर' },
  { href: '/calculators/rashi', label: 'Rashi Calculator', labelMr: 'चंद्र राशी कॅल्क्युलेटर' },
  { href: '/calculators/nakshatra', label: 'Nakshatra Calculator', labelMr: 'नक्षत्र व चरण कॅल्क्युलेटर' },
  { href: '/calculators/sade-sati', label: 'Shani Sade Sati Calculator', labelMr: 'शनि साडेसाती कॅल्क्युलेटर' },
  { href: '/calculators/birth-chart', label: 'Birth/Natal Chart Calculator', labelMr: 'जन्म कुंडली कॅल्क्युलेटर' },
  { href: '/calculators/lucky-vehicle-number', label: 'Lucky Vehicle Number Calculator', labelMr: 'शुभ वाहन क्रमांक कॅल्क्युलेटर' },
  { href: '/calculators/kaal-sarp-dosh', label: 'Kaal Sarp Dosh Calculator', labelMr: 'कालसर्प दोष कॅल्क्युलेटर' },
  { href: '/calculators/lo-shu-grid', label: 'Lo Shu Grid Calculator', labelMr: 'लो शू ग्रिड कॅल्क्युलेटर' },
  { href: '/calculators/name-compatibility', label: 'Name Compatibility Calculator', labelMr: 'नाव सुसंगतता कॅल्क्युलेटर' },
];

export default function Navbar() {
  const { language, t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileCalculatorsOpen, setMobileCalculatorsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
    setWalletBalance(getWalletBalance());
    setCartItemCount(getCartTotals().totalItems);
    setMobileMenuOpen(false); // Auto-close drawer on navigation

    const handleWalletUpdate = () => setWalletBalance(getWalletBalance());
    const handleAuthUpdate = () => {
      const u = getCurrentUser();
      setUser(u);
      if (u) loadNotifications();
    };
    const handleCartUpdate = () => setCartItemCount(getCartTotals().totalItems);

    window.addEventListener('wallet-updated', handleWalletUpdate);
    window.addEventListener('auth-updated', handleAuthUpdate);
    window.addEventListener('cart-updated', handleCartUpdate);

    async function loadNotifications() {
      const curUser = getCurrentUser();
      if (!curUser) return;
      try {
        const bookings = await api.getMyBookings();
        if (Array.isArray(bookings)) {
          const mapped = bookings
            .filter((b) => b.status === 'confirmed' || b.status === 'cancelled')
            .map((b) => ({
              id: `booking_${b.id}`,
              type: b.status === 'confirmed' ? 'confirmed' : 'cancelled',
              title: b.status === 'confirmed' ? '🎉 Consultation Confirmed' : '⚠️ Consultation Cancelled',
              message: b.status === 'confirmed'
                ? `${b.astrologer?.name || 'Vedic Scholar'} on ${b.date} at ${b.timeSlot}`
                : `Booking #${b.bookingNumber} was cancelled. Refund initiated.`,
              meetingLink: b.meetingLink,
              date: b.date,
              timeSlot: b.timeSlot,
              read: false,
            }));
          setUserNotifications(mapped);
        }
      } catch {}
    }
    loadNotifications();

    // Cross-tab and live telemetry broadcast listener for instant notification
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('astroveda_telemetry_stream');
        bc.onmessage = (event) => {
          const msg = event.data;
          if (msg?.type === 'USER_NOTIFICATION' && msg.notification) {
            setUserNotifications((prev) => [msg.notification, ...prev]);
          } else if (msg?.type === 'BOOKING_STATUS_UPDATED') {
            loadNotifications();
          }
        };
      } catch {}
    }

    // Continuous live user telemetry heartbeat
    sendHeartbeat();
    const hbInterval = setInterval(() => {
      sendHeartbeat();
    }, 20000);

    return () => {
      clearInterval(hbInterval);
      if (bc) bc.close();
      window.removeEventListener('wallet-updated', handleWalletUpdate);
      window.removeEventListener('auth-updated', handleAuthUpdate);
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    router.push('/');
  };

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeMenu = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/chat/')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFFDF9] border-b border-[#EAE1D2] shadow-sm">
        {/* ========================================================
            1. TOP SLIM UTILITY BAR (AstroTalk-Inspired)
           ======================================================== */}
        <div className="bg-[#FAF7F2] border-b border-[#EAE1D2] text-[11px] py-1 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-x-2">
            {/* Quick Links */}
            <div className="flex items-center min-w-0 flex-shrink">
              <span className="text-[10px] text-[#8C6D1F] font-semibold sm:hidden truncate flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#D97706] inline shrink-0" />
                <span>JyotishVeda</span>
              </span>
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar py-0.5 text-[#785D46]">
                <Link href="/horoscope" className="hover:text-[#D97706] flex items-center space-x-1 whitespace-nowrap">
                  <Star className="w-3 h-3 text-[#D97706]" />
                  <span>{t('nav.rashifal')}</span>
                </Link>
                <span className="text-[#D8C7A5]">|</span>
                <Link href="/kundli" className="hover:text-[#D97706] flex items-center space-x-1 whitespace-nowrap">
                  <Compass className="w-3 h-3 text-[#D97706]" />
                  <span>{t('nav.kundli')}</span>
                </Link>
                <span className="text-[#D8C7A5]">|</span>
                <Link href="/compatibility" className="hover:text-[#D97706] flex items-center space-x-1 whitespace-nowrap">
                  <Heart className="w-3 h-3 text-[#D97706]" />
                  <span>{t('nav.compatibility')}</span>
                </Link>
                <span className="text-[#D8C7A5] hidden sm:inline">|</span>
                <Link href="/panchang" className="hover:text-[#D97706] flex items-center space-x-1 whitespace-nowrap hidden sm:inline-flex">
                  <Calendar className="w-3 h-3 text-[#D97706]" />
                  <span>{t('nav.panchang')}</span>
                </Link>
                <span className="text-[#D8C7A5] hidden md:inline">|</span>
                <Link href="/astrologers" className="text-[#16A34A] hover:underline flex items-center space-x-1 whitespace-nowrap font-semibold hidden md:inline-flex">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>24x7 Astrologers Online</span>
                </Link>
              </div>
            </div>

            {/* Right Side: Wallet, Cart, Search, Account, Language */}
            <div className="flex items-center space-x-2 sm:space-x-3 ml-auto flex-shrink-0">
              {/* Wallet Button */}
              <Link
                href="/wallet"
                className="flex items-center space-x-1 sm:space-x-1.5 bg-[#FFFBEB] border border-[#FDE68A] px-2 sm:px-2.5 py-0.5 rounded-full hover:border-[#D97706] transition-all text-[#92400E]"
                title="Manage Astro Credits & Balance"
              >
                <Wallet className="w-3 h-3 text-[#D97706]" />
                <span className="font-semibold text-xs">₹{walletBalance.toLocaleString('en-IN')}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#B45309] bg-white px-1 rounded ml-0.5 hidden xs:inline font-bold">
                  + Add
                </span>
              </Link>

              {/* Shopping Cart Icon */}
              <Link
                href="/cart"
                className="relative p-1 text-[#785D46] hover:text-[#D97706] transition-colors"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#D97706] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Search Modal Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1 text-[#785D46] hover:text-[#D97706] transition-colors"
                title="Search Tools & Forecasts"
                aria-label="Open Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* Real-time Order & Consultation Notification Bell */}
              {user && (
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-1 text-[#785D46] hover:text-[#D97706] transition-colors relative cursor-pointer flex items-center justify-center"
                    title={language === 'mr' ? 'सूचना (Order Status)' : 'Order Notifications'}
                    aria-label="Order Notifications"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {userNotifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-extrabold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-xs animate-pulse">
                        {userNotifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 sm:w-88 bg-white border border-[#EAE1D2] rounded-2xl shadow-xl z-50 p-3 text-xs text-[#2D1810] animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-[#EAE1D2]">
                        <span className="font-serif font-bold text-xs text-[#2D1810] flex items-center space-x-1.5">
                          <Bell className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{language === 'mr' ? 'ऑर्डर व सल्लामसलत स्थिती' : 'Order & Booking Status'}</span>
                        </span>
                        {userNotifications.length > 0 && (
                          <button
                            onClick={() => setUserNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                            className="text-[10px] text-[#786C60] hover:text-[#D97706] font-semibold cursor-pointer"
                          >
                            {language === 'mr' ? 'वाचले' : 'Clear'}
                          </button>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto divide-y divide-[#EAE1D2] py-1">
                        {userNotifications.length === 0 ? (
                          <p className="text-center py-5 text-gray-400 text-xs">
                            {language === 'mr' ? 'सर्व ऑर्डर्स सुरळीत आहेत.' : 'No new booking status alerts'}
                          </p>
                        ) : (
                          userNotifications.map((n) => (
                            <div key={n.id} className="py-2.5 space-y-1">
                              <div className="flex items-start space-x-2">
                                {n.type === 'confirmed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-xs text-[#2D1810]">{n.title}</h4>
                                  <p className="text-[11px] text-[#6B5A4E] mt-0.5 leading-snug">{n.message}</p>
                                  {n.meetingLink && (
                                    <div className="pt-1.5">
                                      <a
                                        href={n.meetingLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-2xs transition-colors"
                                      >
                                        <span>📹 {language === 'mr' ? 'व्हिडिओ कॉल सुरू करा' : 'Join Video Call'}</span>
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#EAE1D2] text-center">
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-[10px] text-[#D97706] hover:underline font-bold"
                        >
                          {language === 'mr' ? 'माझ्या सर्व अपॉइंटमेंट्स पहा →' : 'View all my bookings →'}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Authentication Status */}
              {user ? (
                <div className="flex items-center space-x-1.5 pl-1 border-l border-[#EAE1D2]">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-1 text-[#92400E] hover:underline font-semibold"
                  >
                    <UserIcon className="w-3 h-3 text-[#D97706]" />
                    <span className="hidden sm:inline max-w-[85px] truncate">{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title={t('nav.logout')}
                    className="text-red-500 hover:text-red-700 transition-colors p-0.5 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 pl-1 border-l border-[#EAE1D2]">
                  <Link href="/login" className="hover:text-[#D97706] font-medium text-[#5C4535] text-[10px] sm:text-[11px]">
                    {t('nav.signIn')}
                  </Link>
                  <span className="text-[#D8C7A5]">/</span>
                  <Link
                    href="/register"
                    className="text-[#D97706] hover:text-[#B45309] font-semibold text-[10px] sm:text-[11px]"
                  >
                    {t('nav.signUp')}
                  </Link>
                </div>
              )}

              {/* Language Switcher */}
              <div className="pl-1 border-l border-[#EAE1D2]">
                <LanguageSwitcher variant="compact" className="sm:hidden" />
                <LanguageSwitcher variant="pill" className="hidden sm:inline-flex" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. MAIN NAVIGATION BAR (AstroTalk Brand & Menu Structure)
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-3 group flex-shrink-0 min-w-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#F59E0B] flex items-center justify-center shadow-sm border border-[#FCD34D] group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#92400E]" />
            </div>
            <div className="min-w-0">
              <span className="font-serif text-base sm:text-2xl font-extrabold tracking-wide text-[#2D1810] block leading-tight truncate">
                Jyotish<span className="text-[#D97706]">Veda</span>
              </span>
              <span className="hidden sm:block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#8C6D1F] font-sans font-medium">
                Vedic Astrology &amp; Ephemeris
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-semibold text-[#4A2E18]">
            {/* Consultations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('consultations')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('consultations')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors ${
                  pathname.startsWith('/chat') || pathname.startsWith('/astrologers') || pathname.startsWith('/booking')
                    ? 'text-[#D97706] bg-[#FFF9EB]'
                    : ''
                }`}
                aria-expanded={activeDropdown === 'consultations'}
              >
                <span>{t('nav.consultations')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'consultations' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'consultations' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-[#EAE1D2] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <Link
                    href="/chat"
                    onClick={closeMenu}
                    className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-[#FFF9EB] text-[#2D1810] hover:text-[#D97706] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                    <div>
                      <strong className="block text-xs">
                        {language === 'mr' ? 'ज्योतिषांशी थेट चॅट' : 'Chat with Astrologer'}
                      </strong>
                      <span className="text-[10px] text-gray-500">
                        {language === 'mr' ? 'प्रमाणित आचार्यांशी थेट संवाद' : 'Live text consultation with verified Acharyas'}
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/booking"
                    onClick={closeMenu}
                    className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-[#FFF9EB] text-[#2D1810] hover:text-[#D97706] transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <div>
                      <strong className="block text-xs">
                        {language === 'mr' ? 'ज्योतिषांशी कॉल / अपॉइंटमेंट' : 'Call Astrologer (Schedule)'}
                      </strong>
                      <span className="text-[10px] text-gray-500">
                        {language === 'mr' ? 'वैयक्तिक ऑडिओ / व्हिडिओ मार्गदर्शन' : 'Private 1-on-1 audio/video appointments'}
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/astrologers"
                    onClick={closeMenu}
                    className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-[#FFF9EB] text-[#2D1810] hover:text-[#D97706] transition-colors border-t border-[#F3ECE1]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                    <div>
                      <strong className="block text-xs">
                        {language === 'mr' ? 'प्रमाणित ज्योतिषी यादी' : 'Verified Astrologers Directory'}
                      </strong>
                      <span className="text-[10px] text-gray-500">
                        {language === 'mr' ? 'अनुभव व रेटिंगनुसार ज्योतिषी निवडा' : 'Explore scholars by experience and rating'}
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={closeMenu}
                    className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-[#FFF9EB] text-[#2D1810] hover:text-[#D97706] transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <div>
                      <strong className="block text-xs">
                        {language === 'mr' ? 'सल्लामसलत योजना आणि दर' : 'Consultation Plans & Pricing'}
                      </strong>
                      <span className="text-[10px] text-gray-500">
                        {language === 'mr' ? 'पारदर्शक दर व त्वरित अहवाल पॅकेजेस' : 'Transparent rates & express report packages'}
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Horoscope Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('horoscope')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('horoscope')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors ${
                  pathname.startsWith('/horoscope') || pathname.startsWith('/zodiac-signs')
                    ? 'text-[#D97706] bg-[#FFF9EB]'
                    : ''
                }`}
                aria-expanded={activeDropdown === 'horoscope'}
              >
                <span>{t('nav.horoscope')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'horoscope' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'horoscope' && (
                <div className="absolute top-full left-0 w-60 bg-white border border-[#EAE1D2] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <Link
                    href="/horoscope"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#2D1810] hover:text-[#D97706] font-semibold"
                  >
                    {language === 'mr' ? '☀️ दैनिक राशीभविष्य (आजचे राशीफळ)' : '☀️ Daily Horoscope (Aaj Ka Rashifal)'}
                  </Link>
                  <Link
                    href="/horoscope?period=weekly"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706]"
                  >
                    {language === 'mr' ? '📅 साप्ताहिक राशीभविष्य' : '📅 Weekly Horoscope'}
                  </Link>
                  <Link
                    href="/horoscope?period=yearly"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706]"
                  >
                    {language === 'mr' ? '✨ वार्षिक भविष्य २०२६' : '✨ Yearly Predictions 2026'}
                  </Link>
                  <Link
                    href="/zodiac-signs"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706] border-t border-[#F3ECE1]"
                  >
                    {language === 'mr' ? '♈ १२ राशींची सविस्तर माहिती' : '♈ 12 Zodiac Signs (Rashis) Guide'}
                  </Link>
                </div>
              )}
            </div>

            {/* Free Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('freeServices')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('freeServices')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors ${
                  pathname === '/kundli' || pathname === '/compatibility'
                    ? 'text-[#D97706] bg-[#FFF9EB]'
                    : ''
                }`}
                aria-expanded={activeDropdown === 'freeServices'}
              >
                <span>{t('nav.freeServices')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'freeServices' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'freeServices' && (
                <div className="absolute top-full left-0 w-64 bg-white border border-[#EAE1D2] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <Link
                    href="/kundli"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#2D1810] hover:text-[#D97706] font-semibold"
                  >
                    {language === 'mr' ? '📜 मोफत जन्मकुंडली / पत्रिका' : '📜 Free Janam Kundli / Birth Chart'}
                  </Link>
                  <Link
                    href="/compatibility"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706]"
                  >
                    {language === 'mr' ? '💑 कुंडली मिलन (३६ गुणमेलन)' : '💑 Kundli Milan (36 Guna Match)'}
                  </Link>
                  <Link
                    href="/family-kundli"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706]"
                  >
                    {language === 'mr' ? '👨‍👩‍👧‍👦 कुटुंब कुंडली तिजोरी (Family Vault)' : '👨‍👩‍👧‍👦 Family Kundli Vault'}
                  </Link>
                  <Link
                    href="/panchang"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706]"
                  >
                    {language === 'mr' ? '📅 आजचे वैदिक पंचांग' : '📅 Today Vedic Panchang'}
                  </Link>
                  <Link
                    href="/free-chat"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#16A34A] font-bold border-t border-[#F3ECE1]"
                  >
                    {language === 'mr' ? '🎁 पहिले ५ मिनिटे मोफत चॅट' : '🎁 Free 5-Min First Astrologer Chat'}
                  </Link>
                </div>
              )}
            </div>

            {/* PART 1 — CALCULATORS MEGA-MENU IN NAVBAR */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('calculators')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('calculators')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors ${
                  pathname.startsWith('/calculators') ? 'text-[#D97706] bg-[#FFF9EB]' : ''
                }`}
                aria-expanded={activeDropdown === 'calculators'}
              >
                <span>{t('nav.calculators')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'calculators' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'calculators' && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[560px] md:w-[620px] bg-white border border-[#EAE1D2] rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn"
                  role="menu"
                  aria-label="Calculators Dropdown Menu"
                >
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F3ECE1] px-1">
                    <span className="font-serif font-bold text-sm text-[#2D1810] flex items-center space-x-1.5">
                      <Calculator className="w-4 h-4 text-[#D97706]" />
                      <span>{language === 'mr' ? 'अचूक वैदिक व संख्याशास्त्र कॅल्क्युलेटर' : 'Vedic & Numerology Calculators'}</span>
                    </span>
                    <Link
                      href="/calculators"
                      onClick={closeMenu}
                      className="text-[11px] font-bold text-[#D97706] hover:underline flex items-center space-x-0.5"
                    >
                      <span>{language === 'mr' ? 'सर्व २०+ कॅल्क्युलेटर पहा' : 'View All 20+ Calculators'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Two-Column Scrollable Mega-Menu */}
                  <div className="max-h-[65vh] overflow-y-auto pr-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    {/* Column 1 */}
                    <div className="space-y-1">
                      {CALCULATORS_COL_1.map((item, idx) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[#2D1810] hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors group"
                        >
                          <span className="font-medium truncate pr-1">
                            {idx + 1}. {language === 'mr' ? item.labelMr : item.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#D97706] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-1 border-l border-[#F5EFE6] pl-3">
                      {CALCULATORS_COL_2.map((item, idx) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[#2D1810] hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors group"
                        >
                          <span className="font-medium truncate pr-1">
                            {idx + 11}. {language === 'mr' ? item.labelMr : item.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#D97706] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panchang Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('panchang')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('panchang')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors ${
                  pathname.startsWith('/panchang') || pathname.startsWith('/festivals')
                    ? 'text-[#D97706] bg-[#FFF9EB]'
                    : ''
                }`}
                aria-expanded={activeDropdown === 'panchang'}
              >
                <span>{t('nav.panchang')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'panchang' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'panchang' && (
                <div className="absolute top-full left-0 w-56 bg-white border border-[#EAE1D2] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <Link
                    href="/panchang"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#2D1810] hover:text-[#D97706] font-semibold"
                  >
                    {language === 'mr' ? '📅 आजचे वैदिक पंचांग' : '📅 Today Vedic Panchang'}
                  </Link>
                  <Link
                    href="/festivals"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706]"
                  >
                    {language === 'mr' ? '🪔 २०२६ सण व उत्सव दिनदर्शिका' : '🪔 2026 Festival Calendar'}
                  </Link>
                  <Link
                    href="/panchang#muhurat"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-[#FFF9EB] text-[#5C4535] hover:text-[#D97706]"
                  >
                    {language === 'mr' ? '⏰ शुभ मुहूर्त आणि चौघडिया' : '⏰ Auspicious Muhurats'}
                  </Link>
                </div>
              )}
            </div>

            {/* PART 2 — COMPLETE ASTROLOGY SHOP LINK */}
            <Link
              href="/shop"
              className={`px-3 py-2 rounded-lg hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors flex items-center space-x-1 ${
                pathname.startsWith('/shop') || pathname.startsWith('/cart') ? 'text-[#D97706] bg-[#FFF9EB]' : ''
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('nav.shop')}</span>
            </Link>

            {/* Blog Link */}
            <Link
              href="/blog"
              className={`px-3 py-2 rounded-lg hover:text-[#D97706] hover:bg-[#FFF9EB] transition-colors flex items-center space-x-1 ${
                pathname.startsWith('/blog') ? 'text-[#D97706] bg-[#FFF9EB]' : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('nav.blog')}</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* User Profile / Dashboard Icon */}
            <Link
              href={user ? '/dashboard' : '/login'}
              className="hidden md:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] hover:border-[#D97706] hover:bg-[#FEF3C7] transition-all"
              title={user ? `Logged in as ${user.username}` : 'Sign In to Portal'}
            >
              <UserIcon className="w-4 h-4" />
            </Link>

            {/* PROMINENT ASTROTALK-STYLE "FIRST CHAT FREE" BUTTON (Points to /free-chat) */}
            <Link
              href="/free-chat"
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2 xs:px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#2D1810] font-serif font-bold text-[10px] xs:text-[11px] sm:text-xs shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
              <span className="truncate">{t('nav.firstChatFree')}</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 shrink-0" />
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#2D1810] hover:bg-[#FAF7F2] border border-[#EAE1D2] flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================
            3. MOBILE SLIDING DRAWER MENU
           ======================================================== */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <div className="relative z-50 lg:hidden bg-[#FFFDF9] border-t border-[#EAE1D2] px-4 py-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeIn">
              {/* Mobile Language Switcher Row */}
              <div className="flex items-center justify-between p-3 bg-[#FAF7F2] border border-[#EAE1D2] rounded-2xl">
                <span className="text-xs text-[#5C4535] font-semibold">
                  {language === 'mr' ? 'भाषा निवडा:' : 'Select Language:'}
                </span>
                <LanguageSwitcher />
              </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/free-chat"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] text-[#92400E] font-bold rounded-xl border border-[#FCD34D]"
              >
                <span>💬 {t('nav.firstChatFree')}</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href="/shop"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 bg-[#FAF7F2] text-[#2D1810] font-semibold rounded-xl border border-[#EAE1D2]"
              >
                <span>🛍️ {t('nav.shop')} ({cartItemCount})</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Categorized Menu Links */}
            <div className="space-y-4 pt-2 text-xs text-[#4A2E18]">
              {/* Calculators Accordion in Mobile */}
              <div>
                <button
                  onClick={() => setMobileCalculatorsOpen(!mobileCalculatorsOpen)}
                  className="w-full flex items-center justify-between font-bold text-[#D97706] uppercase text-[10px] tracking-wider mb-2"
                >
                  <span>🧮 {t('nav.calculators')} (20+)</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileCalculatorsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCalculatorsOpen && (
                  <div className="space-y-1 pl-2 max-h-60 overflow-y-auto border-l-2 border-[#D97706]/30">
                    {[...CALCULATORS_COL_1, ...CALCULATORS_COL_2].map((item, idx) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className="block py-1 hover:text-[#D97706] text-[#2D1810]"
                      >
                        {idx + 1}. {language === 'mr' ? item.labelMr : item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="font-bold text-[#D97706] uppercase text-[10px] tracking-wider mb-2">
                  {t('nav.consultations')}
                </p>
                <div className="space-y-1.5 pl-2">
                  <Link href="/free-chat" onClick={closeMenu} className="block py-1 text-[#16A34A] font-bold">
                    {language === 'mr' ? '🎁 पहिले ५ मिनिटे मोफत चॅट' : '🎁 Free 5-Min First Astrologer Chat'}
                  </Link>
                  <Link href="/chat" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? 'ज्योतिषांशी थेट चॅट' : 'Chat with Astrologer'}
                  </Link>
                  <Link href="/booking" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? 'ज्योतिषांशी कॉल / अपॉइंटमेंट' : 'Call Astrologer (Appointments)'}
                  </Link>
                  <Link href="/astrologers" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? 'प्रमाणित ज्योतिषी यादी' : 'Verified Astrologers Directory'}
                  </Link>
                  <Link href="/pricing" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? 'सल्लामसलत योजना आणि दर' : 'Consultation Plans & Pricing'}
                  </Link>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#D97706] uppercase text-[10px] tracking-wider mb-2">
                  {t('nav.horoscope')} &amp; {t('nav.panchang')}
                </p>
                <div className="space-y-1.5 pl-2">
                  <Link href="/horoscope" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? '☀️ दैनिक राशीभविष्य' : 'Daily Horoscope (Aaj Ka Rashifal)'}
                  </Link>
                  <Link href="/horoscope?period=yearly" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? '✨ वार्षिक भविष्य २०२६' : 'Yearly Predictions 2026'}
                  </Link>
                  <Link href="/zodiac-signs" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? '♈ १२ राशींची सविस्तर माहिती' : '12 Zodiac Signs Guide'}
                  </Link>
                  <Link href="/panchang" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? '📅 आजचे वैदिक पंचांग' : 'Today Vedic Panchang'}
                  </Link>
                  <Link href="/festivals" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? '🪔 २०२६ सण व उत्सव दिनदर्शिका' : '2026 Festival Calendar'}
                  </Link>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#D97706] uppercase text-[10px] tracking-wider mb-2">
                  {t('nav.freeServices')} &amp; {t('nav.shop')}
                </p>
                <div className="space-y-1.5 pl-2">
                  <Link href="/kundli" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? '📜 मोफत जन्मकुंडली' : 'Free Janam Kundli'}
                  </Link>
                  <Link href="/compatibility" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? '💑 कुंडली मिलन (३६ गुण)' : 'Kundli Milan (36 Guna Match)'}
                  </Link>
                  <Link href="/shop" onClick={closeMenu} className="block py-1 hover:text-[#D97706] font-semibold">
                    {language === 'mr' ? '🛍️ ज्योतिष दुकान (रुद्राक्ष, रत्ने)' : 'Astrology Shop (Crystals & Rudraksha)'}
                  </Link>
                  <Link href="/cart" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? 'खरेदीची गाडी' : 'Shopping Cart'}
                  </Link>
                  <Link href="/blog" onClick={closeMenu} className="block py-1 hover:text-[#D97706]">
                    {language === 'mr' ? 'वैदिक ज्योतिष ब्लॉग' : 'Vedic Astrology Blog'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-[#EAE1D2]">
              {user ? (
                <div className="flex items-center justify-between p-2 bg-[#FAF7F2] rounded-xl border border-[#EAE1D2]">
                  <Link href="/dashboard" onClick={closeMenu} className="font-bold text-[#2D1810] text-xs">
                    {language === 'mr' ? 'माझे खाते' : 'My Account'} ({user.username})
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 font-semibold text-xs cursor-pointer">
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="py-2.5 text-center rounded-xl border border-[#EAE1D2] text-[#2D1810] font-semibold text-xs bg-white"
                  >
                    {t('nav.signIn')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="py-2.5 text-center rounded-xl bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#2D1810] font-bold text-xs"
                  >
                    {t('nav.signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
          </>
        )}
      </header>

      {/* Global Live Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
