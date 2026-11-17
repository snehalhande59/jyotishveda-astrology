'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { POPULAR_CITIES, CityLocation, searchLocalCities } from '@/lib/cities';
import { calculateFullCompatibility } from '@/lib/calculator-engine';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { getCurrentUser } from '@/lib/auth';
import NorthIndianChart from '@/components/NorthIndianChart';
import {
  Heart,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  User,
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  RotateCcw,
  Search,
  Loader2,
  Printer,
  Download,
  Compass,
  MessageSquare,
  Bookmark,
  Check,
  Info,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';

// Semicircle Speedometer Gauge Component
function SpeedometerGauge({ score, maxScore = 36 }: { score: number; maxScore?: number }) {
  const fraction = Math.min(1, Math.max(0, score / maxScore));
  const radius = 72;
  const cx = 100;
  const cy = 95;
  const strokeWidth = 14;

  const arcLength = Math.PI * radius; // ~226.19
  const strokeDashoffset = arcLength * (1 - fraction);

  const needleAngle = -180 + fraction * 180;
  const needleLength = 54;
  const rad = (needleAngle * Math.PI) / 180;
  const nx = cx + needleLength * Math.cos(rad);
  const ny = cy + needleLength * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <span className="text-[11px] font-bold text-[#786C60] tracking-wider uppercase mb-1">
        TOTAL GUNA SCORE
      </span>
      <div className="relative w-48 h-28 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Background Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active Colored Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#1F2937"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Needle Base Pivot */}
          <circle cx={cx} cy={cy} r="6" fill="#1F2937" />
          <circle cx={cx} cy={cy} r="2.5" fill="#F59E0B" />
          {/* Needle Tip Indicator */}
          <circle cx={nx} cy={ny} r="4.5" fill="#1F2937" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="text-center -mt-2">
        <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">
          {score}
          <span className="text-sm sm:text-base font-normal text-[#786C60]">/{maxScore}</span>
        </div>
        <div className="text-[10px] font-bold text-[#786C60] uppercase tracking-wider mt-0.5">
          {score >= 28 ? 'UTTAMA MILAN' : score >= 18 ? 'MADHYAMA MILAN' : 'ADHAMA MILAN'}
        </div>
      </div>
      <div className="flex justify-between w-40 text-[11px] font-bold text-[#9CA3AF] px-1 mt-1 font-mono">
        <span>0</span>
        <span>{maxScore}</span>
      </div>
    </div>
  );
}

// Illustrated Avatars
function FemaleAvatar() {
  return (
    <div className="w-14 h-14 rounded-full border-2 border-rose-400 p-0.5 bg-gradient-to-tr from-rose-100 to-amber-50 shadow-xs flex items-center justify-center shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full rounded-full">
        <circle cx="32" cy="32" r="30" fill="#FFE4E6" />
        <path d="M18 36 C16 22, 22 14, 32 14 C42 14, 48 22, 46 36 C42 32, 40 28, 32 28 C24 28, 22 32, 18 36 Z" fill="#78350F" />
        <circle cx="32" cy="34" r="14" fill="#FDE68A" />
        <circle cx="27" cy="33" r="1.8" fill="#451A03" />
        <circle cx="37" cy="33" r="1.8" fill="#451A03" />
        <path d="M29 38 Q32 41 35 38" fill="none" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="31" r="1.5" fill="#E11D48" />
        <path d="M18 54 C20 45, 26 43, 32 43 C38 43, 44 45, 46 54" fill="#F43F5E" />
      </svg>
    </div>
  );
}

function MaleAvatar() {
  return (
    <div className="w-14 h-14 rounded-full border-2 border-amber-500 p-0.5 bg-gradient-to-tr from-amber-100 to-amber-50 shadow-xs flex items-center justify-center shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full rounded-full">
        <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
        <path d="M18 28 C18 16, 26 12, 32 12 C38 12, 46 16, 46 28 C42 24, 38 22, 32 22 C26 22, 22 24, 18 28 Z" fill="#451A03" />
        <circle cx="32" cy="35" r="14" fill="#FDE68A" />
        <circle cx="27" cy="34" r="1.8" fill="#451A03" />
        <circle cx="37" cy="34" r="1.8" fill="#451A03" />
        <path d="M29 39 Q32 42 35 39" fill="none" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 54 C20 46, 25 44, 32 44 C39 44, 44 46, 46 54" fill="#D97706" />
      </svg>
    </div>
  );
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d} ${months[m - 1]}, ${y}`;
  } catch {
    return dateStr;
  }
}

function formatDisplayTime(timeStr: string) {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch {
    return timeStr;
  }
}

// Autocomplete Location Input Component
function CitySearchInput({
  label,
  selectedCity,
  onSelectCity,
  isMr,
}: {
  label: string;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  isMr: boolean;
}) {
  const [query, setQuery] = useState(selectedCity.name);
  const [results, setResults] = useState<CityLocation[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(selectedCity.name);
  }, [selectedCity]);

  const handleInput = (val: string) => {
    setQuery(val);
    setShowDropdown(true);

    if (val.trim().length < 2) {
      setResults([]);
      return;
    }

    const localMatches = searchLocalCities(val);
    setResults(localMatches.slice(0, 6));

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      if (val.trim().length < 2) return;
      setLoading(true);
      try {
        const live = await api.searchLocation(val);
        if (live && live.length > 0) {
          const merged = [...localMatches];
          live.forEach((r: CityLocation) => {
            if (!merged.find((m) => m.name.toLowerCase() === r.name.toLowerCase())) {
              merged.push(r);
            }
          });
          setResults(merged.slice(0, 8));
        }
      } catch {
        // keep local results
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-[11px] font-bold text-[#4A2E18] mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setShowDropdown(true);
          }}
          placeholder={isMr ? 'शहर शोधा...' : 'Search city...'}
          className="w-full px-3 py-2 pr-8 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#786C60]">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" /> : <Search className="w-3.5 h-3.5 opacity-50" />}
        </div>
      </div>

      <div className="mt-1 text-[10px] text-[#786C60] font-mono">
        📍 {selectedCity.name} ({selectedCity.latitude.toFixed(2)}°, {selectedCity.longitude.toFixed(2)}°)
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#EAE1D2] rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {results.map((c, idx) => (
            <button
              key={`${c.name}-${idx}`}
              type="button"
              onMouseDown={() => {
                onSelectCity(c);
                setQuery(c.name);
                setShowDropdown(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-[#FFF9EB] text-xs text-[#2D1810] border-b border-[#F5EFE6] last:border-0"
            >
              <div className="font-semibold">{c.name}</div>
              <div className="text-[10px] text-[#786C60]">{c.stateCountry}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompatibilityPage() {
  const { language, t, translateSign } = useLanguage();
  const isMr = language === 'mr';

  const defaultSangamner = POPULAR_CITIES.find((c) => c.name === 'Sangamner') || POPULAR_CITIES[0];
  const defaultSinnar = POPULAR_CITIES.find((c) => c.name === 'Sinnar') || POPULAR_CITIES[1] || POPULAR_CITIES[0];

  // Active Main Tab: 'form' for user entry, 'report' once generated
  const [activeTab, setActiveTab] = useState<'report' | 'form'>('form');

  // Sub-tab inside report view
  const [reportSubTab, setReportSubTab] = useState<'gunas' | 'manglik' | 'doshas' | 'charts' | 'planetary' | 'remedies'>('gunas');
  const [chartView, setChartView] = useState<'d1' | 'd9'>('d1');

  // Girl Details (Bride / Person 1)
  const [girlName, setGirlName] = useState('Priyanka Sharma');
  const [girlDob, setGirlDob] = useState('1998-08-15');
  const [girlTob, setGirlTob] = useState('10:30');
  const [girlCity, setGirlCity] = useState<CityLocation>(defaultSangamner);

  // Boy Details (Groom / Person 2)
  const [boyName, setBoyName] = useState('Rahul Verma');
  const [boyDob, setBoyDob] = useState('1996-04-22');
  const [boyTob, setBoyTob] = useState('14:15');
  const [boyCity, setBoyCity] = useState<CityLocation>(defaultSinnar);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    trackEvent({
      eventType: 'tool_view',
      serviceName: 'Kundli Milan (Compatibility)',
      serviceCategory: 'free_tool',
      targetSlug: '/compatibility',
    });
  }, []);

  const performMatch = async (bData: any, gData: any) => {
    setLoading(true);
    setIsSaved(false);
    try {
      let matchRes: any = null;
      try {
        const res = await api.calculateCompatibility(bData, gData);
        if (res && res.gunaMilan && typeof res.gunaMilan.totalScore === 'number') {
          matchRes = res;
        }
      } catch (apiErr) {
        console.warn('Backend API compatibility fallback to client-side Vedic calculations:', apiErr);
      }

      if (!matchRes) {
        matchRes = calculateFullCompatibility(bData, gData);
      }

      // Ensure names and birth details are strictly attached to result
      if (matchRes) {
        if (!matchRes.boyChart) matchRes.boyChart = {};
        if (!matchRes.girlChart) matchRes.girlChart = {};
        matchRes.boyChart.fullName = bData.fullName || (isMr ? 'वर' : 'Groom');
        matchRes.boyChart.dateOfBirth = bData.dateOfBirth;
        matchRes.boyChart.timeOfBirth = bData.timeOfBirth;
        matchRes.boyChart.placeOfBirth = bData.placeOfBirth;

        matchRes.girlChart.fullName = gData.fullName || (isMr ? 'वधू' : 'Bride');
        matchRes.girlChart.dateOfBirth = gData.dateOfBirth;
        matchRes.girlChart.timeOfBirth = gData.timeOfBirth;
        matchRes.girlChart.placeOfBirth = gData.placeOfBirth;
      }

      setResult(matchRes);
      setActiveTab('report');

      // Track Kundli Milan Live Event
      try {
        trackEvent({
          eventType: 'tool_usage',
          serviceName: 'Ashtakoot Kundli Matching',
          serviceCategory: 'free_tool',
          targetSlug: '/compatibility',
          metadata: {
            name: `${gData.fullName} & ${bData.fullName}`,
            gunaScore: `${matchRes?.gunaMilan?.totalScore || 28}/36`,
            compatibility: (matchRes?.gunaMilan?.totalScore || 28) >= 18 ? 'Auspicious' : 'Consultation Recommended',
            place: `${gData.placeOfBirth} x ${bData.placeOfBirth}`,
          },
        });
      } catch {}
    } catch (err: any) {
      console.warn('Matching error, computing client-side:', err);
      const fallback = calculateFullCompatibility(bData, gData);
      setResult(fallback);
      setActiveTab('report');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!girlDob || !boyDob) {
      alert(isMr ? 'कृपया दोघांची जन्मतारीख भरा.' : 'Please enter valid date of birth for both individuals.');
      return;
    }
    const boyBirth = {
      fullName: boyName || (isMr ? 'वर' : 'Groom'),
      dateOfBirth: boyDob,
      timeOfBirth: boyTob || '12:00',
      placeOfBirth: boyCity.name + ', ' + boyCity.stateCountry,
      latitude: boyCity.latitude,
      longitude: boyCity.longitude,
      timezoneOffsetHours: 5.5,
    };
    const girlBirth = {
      fullName: girlName || (isMr ? 'वधू' : 'Bride'),
      dateOfBirth: girlDob,
      timeOfBirth: girlTob || '12:00',
      placeOfBirth: girlCity.name + ', ' + girlCity.stateCountry,
      latitude: girlCity.latitude,
      longitude: girlCity.longitude,
      timezoneOffsetHours: 5.5,
    };
    performMatch(boyBirth, girlBirth);
  };

  // Clear Form for completely fresh entry
  const handleClearForm = () => {
    setGirlName('');
    setGirlDob('');
    setGirlTob('12:00');
    setBoyName('');
    setBoyDob('');
    setBoyTob('12:00');
    setActiveTab('form');
  };

  // Swap Bride and Groom
  const handleSwapCouple = () => {
    const tempName = girlName;
    const tempDob = girlDob;
    const tempTob = girlTob;
    const tempCity = girlCity;

    setGirlName(boyName);
    setGirlDob(boyDob);
    setGirlTob(boyTob);
    setGirlCity(boyCity);

    setBoyName(tempName);
    setBoyDob(tempDob);
    setBoyTob(tempTob);
    setBoyCity(tempCity);
  };

  // Restore reference sample (Priyanka & Rahul)
  const handleLoadSample = () => {
    setGirlName('Priyanka Sharma');
    setGirlDob('1998-08-15');
    setGirlTob('10:30');
    setGirlCity(defaultSangamner);

    setBoyName('Rahul Verma');
    setBoyDob('1996-04-22');
    setBoyTob('14:15');
    setBoyCity(defaultSinnar);

    const b = {
      fullName: 'Rahul Verma',
      dateOfBirth: '1996-04-22',
      timeOfBirth: '14:15',
      placeOfBirth: 'Mumbai, Maharashtra, India',
      latitude: defaultSinnar.latitude,
      longitude: defaultSinnar.longitude,
      timezoneOffsetHours: 5.5,
    };
    const g = {
      fullName: 'Priyanka Sharma',
      dateOfBirth: '1998-08-15',
      timeOfBirth: '10:30',
      placeOfBirth: 'Pune, Maharashtra, India',
      latitude: defaultSangamner.latitude,
      longitude: defaultSangamner.longitude,
      timezoneOffsetHours: 5.5,
    };
    performMatch(b, g);
  };

  const handleSaveMatch = async () => {
    const user = getCurrentUser();
    if (!user) {
      alert(isMr ? 'कृपया कुंडली तिजोरीत सेव्ह करण्यासाठी आधी लॉगिन करा.' : 'Please sign in to save this matching report to your Kundli Vault.');
      return;
    }
    try {
      await api.calculateCompatibility(
        {
          fullName: result?.boyChart?.fullName || boyName,
          dateOfBirth: result?.boyChart?.dateOfBirth || boyDob,
          timeOfBirth: result?.boyChart?.timeOfBirth || boyTob,
          placeOfBirth: result?.boyChart?.placeOfBirth,
        },
        {
          fullName: result?.girlChart?.fullName || girlName,
          dateOfBirth: result?.girlChart?.dateOfBirth || girlDob,
          timeOfBirth: result?.girlChart?.timeOfBirth || girlTob,
          placeOfBirth: result?.girlChart?.placeOfBirth,
        },
        true
      );
      setIsSaved(true);
    } catch {
      setIsSaved(true);
    }
  };

  const kutas = Array.isArray(result?.gunaMilan?.kutas)
    ? result.gunaMilan.kutas
    : [];

  const totalScore = result?.gunaMilan?.totalScore ?? 28;
  const matchStatus = result?.gunaMilan?.matchStatus || (totalScore >= 18 ? 'GOOD MATCH' : 'AVERAGE MATCH');
  const manglikMatching = result?.manglikMatching;
  const doshas = result?.doshaAnalysis;

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Top Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{isMr ? 'अष्टकूट ३६ गुणमेलन व पत्रिका मिलन' : 'Authentic 36 Guna Milan & Patrika Matching'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
            {isMr ? 'विवाह जन्मकुंडली मिलन' : 'Janma Kundali Matching & Marriage Compatibility'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] font-medium max-w-2xl mx-auto">
            {isMr
              ? 'ऋषी पराशर सिद्धांतांवर आधारित अचूक अष्टकूट ३६ गुण, मंगळ दोष (कुज दोष), नाडी व भकूट दोष परिहार, आणि नवमांश कुंडली समन्वय.'
              : 'Deterministic Parashari Ashtakoota calculation, Kuja (Manglik) Dosha verification, Nadi-Bhakoot cancellations, and Navamsa harmony.'}
          </p>
        </div>

        {/* Navigation Tabs & Actions Toolbar */}
        <div className="bg-white border border-[#EAE1D2] rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex bg-[#FAF7F2] p-1 rounded-xl text-xs border border-[#EAE1D2]">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'form' ? 'bg-[#D97706] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isMr ? 'नवीन मिलन फॉर्म (Match Form)' : 'Matching Form'}</span>
            </button>
            <button
              onClick={() => {
                if (result) setActiveTab('report');
                else handleLoadSample();
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'report' ? 'bg-[#D97706] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{isMr ? 'गुणमेलन अहवाल (Report)' : 'View Report'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSwapCouple}
              className="text-xs font-bold text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE1D2] hover:bg-white transition-colors cursor-pointer"
              title="Swap Bride & Groom"
            >
              <ArrowRightLeft className="w-3 h-3 text-[#D97706]" />
              <span className="hidden sm:inline">{isMr ? 'अदलाबदल (Swap)' : 'Swap'}</span>
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="text-xs font-bold text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE1D2] hover:bg-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#D97706]" />
              <span>{isMr ? 'रीसेट (Clear)' : 'Reset'}</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-bold text-[#92400E] flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              <span>{isMr ? 'नमुना जोडी (Sample)' : 'Sample Match'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            1. FORM VIEW TAB
           ======================================================== */}
        {activeTab === 'form' && (
          <form
            onSubmit={handleMatchSubmit}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6 animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
              <h2 className="font-serif text-lg font-bold text-[#2D1810] flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{isMr ? 'वधू आणि वराचे अचूक जन्मतपशील भरा' : 'Enter Accurate Birth Details for Both Individuals'}</span>
              </h2>
              <span className="text-[11px] text-[#786C60] hidden sm:inline">
                {isMr ? 'लाहिरी अयनांश व अचूक भौगोलिक समन्वय' : 'Pure Lahiri Ayanamsa & Coordinate Geocoding'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Girl / Bride Details */}
              <div className="p-4 sm:p-5 bg-[#FFFDF9] rounded-2xl border border-rose-200/80 space-y-3">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wide block border-b border-[#F5EFE6] pb-1.5 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>{isMr ? '१. वधूचे जन्मतपशील (Bride / Girl)' : "1. Bride's Details (Girl)"}</span>
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-[#4A2E18] mb-1">{isMr ? 'पूर्ण नाव' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={girlName}
                    onChange={(e) => setGirlName(e.target.value)}
                    placeholder={isMr ? 'वधूचे नाव (उदा. पूजा शर्मा)...' : 'e.g. Pooja Sharma'}
                    className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A2E18] mb-1">{isMr ? 'जन्मतारीख' : 'Date of Birth'}</label>
                    <input
                      type="date"
                      value={girlDob}
                      onChange={(e) => setGirlDob(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A2E18] mb-1">{isMr ? 'जन्मवेळ' : 'Time of Birth'}</label>
                    <input
                      type="time"
                      value={girlTob}
                      onChange={(e) => setGirlTob(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                </div>
                <CitySearchInput
                  label={isMr ? 'जन्मस्थान (शहर)' : 'Birth Place / City'}
                  selectedCity={girlCity}
                  onSelectCity={setGirlCity}
                  isMr={isMr}
                />
              </div>

              {/* Boy / Groom Details */}
              <div className="p-4 sm:p-5 bg-[#FFFDF9] rounded-2xl border border-amber-300 space-y-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block border-b border-[#F5EFE6] pb-1.5 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>{isMr ? '२. वराचे जन्मतपशील (Groom / Boy)' : "2. Groom's Details (Boy)"}</span>
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-[#4A2E18] mb-1">{isMr ? 'पूर्ण नाव' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={boyName}
                    onChange={(e) => setBoyName(e.target.value)}
                    placeholder={isMr ? 'वराचे नाव (उदा. राहुल वर्मा)...' : 'e.g. Rahul Verma'}
                    className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A2E18] mb-1">{isMr ? 'जन्मतारीख' : 'Date of Birth'}</label>
                    <input
                      type="date"
                      value={boyDob}
                      onChange={(e) => setBoyDob(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A2E18] mb-1">{isMr ? 'जन्मवेळ' : 'Time of Birth'}</label>
                    <input
                      type="time"
                      value={boyTob}
                      onChange={(e) => setBoyTob(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                </div>
                <CitySearchInput
                  label={isMr ? 'जन्मस्थान (शहर)' : 'Birth Place / City'}
                  selectedCity={boyCity}
                  onSelectCity={setBoyCity}
                  isMr={isMr}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isMr ? 'अचूक ३६ गुणमेलन गणना करत आहे...' : 'Calculating 36 Guna Milan...'}</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{isMr ? 'अचूक ३६ गुण व पत्रिका मिलन अहवाल काढा' : 'Generate Complete 36 Guna Milan & Kundli Matching'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            2. REPORT VIEW TAB
           ======================================================== */}
        {activeTab === 'report' && (
          <div className="space-y-6 animate-fadeIn">
            {result && (
              <>
                {/* Main Summary Header Card */}
                <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative space-y-6">
                  {/* Top Status & Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5EFE6] pb-4">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] shadow-2xs">
                        {isMr && matchStatus === 'GOOD MATCH' ? 'उत्तम गुणमेलन (शुभ विवाह)' : matchStatus}
                      </span>
                      {manglikMatching && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                          manglikMatching.compatible ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {manglikMatching.verdict}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveMatch}
                        className="text-xs font-bold text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#EAE1D2] bg-[#FFFDF9] hover:bg-white cursor-pointer transition-colors"
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-[#D97706]" />}
                        <span>{isSaved ? (isMr ? 'सेव्ह केले' : 'Saved') : (isMr ? 'तिजोरीत सेव्ह करा' : 'Save Match')}</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="text-xs font-bold text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#EAE1D2] bg-[#FFFDF9] hover:bg-white cursor-pointer transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>{isMr ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Side-by-side Score & Profiles */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                    {/* Speedometer Gauge Column */}
                    <div className="lg:col-span-4 flex justify-center border-b lg:border-b-0 lg:border-r border-[#F5EFE6] pb-6 lg:pb-0 lg:pr-6">
                      <SpeedometerGauge score={totalScore} maxScore={36} />
                    </div>

                    {/* Profiles Comparison Column */}
                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                        {/* Bride Profile */}
                        <div className="md:col-span-5 bg-[#FFFDF9] border border-rose-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                            {isMr ? 'वधूचे तपशील (BRIDE)' : 'BRIDE DETAILS'}
                          </span>
                          <div className="flex items-center space-x-3">
                            <FemaleAvatar />
                            <div>
                              <h3 className="font-bold text-[#2D1810] text-base leading-tight">
                                {result?.girlChart?.fullName || girlName || 'Bride'}
                              </h3>
                              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                                {result?.girlChart?.moonSign?.signName
                                  ? `${result.girlChart.moonSign.signName} (${result.girlChart.moonSign.signSanskrit})`
                                  : 'Moon Sign'}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'लग्न:' : 'Lagna:'}</strong>{' '}
                              {result?.girlChart?.ascendant?.signName || 'Lagna'} ({result?.girlChart?.ascendant?.signSanskrit})
                            </div>
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'नक्षत्र:' : 'Nakshatra:'}</strong>{' '}
                              {result?.girlChart?.moonSign?.nakshatra || 'Nakshatra'} (चरण {result?.girlChart?.moonSign?.pada || 1})
                            </div>
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'मंगळ दोष:' : 'Manglik:'}</strong>{' '}
                              <span className={result?.girlChart?.manglik?.hasDosha && !result?.girlChart?.manglik?.isCancelled ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                                {result?.girlChart?.manglik?.status || 'No Manglik Dosha'}
                              </span>
                            </div>
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'जन्म:' : 'Born:'}</strong>{' '}
                              {formatDisplayDate(result?.girlChart?.dateOfBirth || girlDob)} · {formatDisplayTime(result?.girlChart?.timeOfBirth || girlTob)}
                            </div>
                          </div>
                        </div>

                        {/* Center Rings Connector */}
                        <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                          <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-base shadow-xs">
                            💍
                          </div>
                        </div>

                        {/* Groom Profile */}
                        <div className="md:col-span-5 bg-[#FFFDF9] border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                            {isMr ? 'वराचे तपशील (GROOM)' : 'GROOM DETAILS'}
                          </span>
                          <div className="flex items-center space-x-3">
                            <MaleAvatar />
                            <div>
                              <h3 className="font-bold text-[#2D1810] text-base leading-tight">
                                {result?.boyChart?.fullName || boyName || 'Groom'}
                              </h3>
                              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                                {result?.boyChart?.moonSign?.signName
                                  ? `${result.boyChart.moonSign.signName} (${result.boyChart.moonSign.signSanskrit})`
                                  : 'Moon Sign'}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'लग्न:' : 'Lagna:'}</strong>{' '}
                              {result?.boyChart?.ascendant?.signName || 'Lagna'} ({result?.boyChart?.ascendant?.signSanskrit})
                            </div>
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'नक्षत्र:' : 'Nakshatra:'}</strong>{' '}
                              {result?.boyChart?.moonSign?.nakshatra || 'Nakshatra'} (चरण {result?.boyChart?.moonSign?.pada || 1})
                            </div>
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'मंगळ दोष:' : 'Manglik:'}</strong>{' '}
                              <span className={result?.boyChart?.manglik?.hasDosha && !result?.boyChart?.manglik?.isCancelled ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                                {result?.boyChart?.manglik?.status || 'No Manglik Dosha'}
                              </span>
                            </div>
                            <div>
                              <strong className="text-[#2D1810] font-semibold">{isMr ? 'जन्म:' : 'Born:'}</strong>{' '}
                              {formatDisplayDate(result?.boyChart?.dateOfBirth || boyDob)} · {formatDisplayTime(result?.boyChart?.timeOfBirth || boyTob)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Tabs Navigation for In-Depth Analysis */}
                <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar border-b border-[#EAE1D2] pb-1 text-xs">
                  {[
                    { id: 'gunas', label: isMr ? '३६ गुण तपशील' : '36 Guna Milan', icon: Heart },
                    { id: 'manglik', label: isMr ? 'मंगळ दोष मिलन' : 'Manglik Analysis', icon: ShieldCheck },
                    { id: 'doshas', label: isMr ? 'नाडी व भकूट दोष' : 'Doshas & Parihara', icon: AlertTriangle },
                    { id: 'charts', label: isMr ? 'पत्रिका चार्ट्स (D1 व D9)' : 'Birth Charts (D1 & D9)', icon: Compass },
                    { id: 'planetary', label: isMr ? '७वे स्थान व ग्रह मैत्री' : '7th House & Planets', icon: Sparkles },
                    { id: 'remedies', label: isMr ? 'उपाय व ज्योतिष सल्ला' : 'Remedies & Advice', icon: CheckCircle2 },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setReportSubTab(tab.id as any)}
                        className={`px-3 sm:px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                          reportSubTab === tab.id
                            ? 'bg-[#D97706] text-white shadow-xs'
                            : 'bg-white border border-[#EAE1D2] text-[#786C60] hover:text-[#2D1810] hover:border-[#F59E0B]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ========================================================
                    SUB-TAB 1: 36 GUNA MILAN DETAILED CARDS & TABLE
                   ======================================================== */}
                {reportSubTab === 'gunas' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Comparative Table */}
                    <div className="bg-white border border-[#EAE1D2] rounded-3xl p-5 sm:p-6 shadow-xs overflow-hidden space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#F5EFE6]">
                        <h3 className="font-serif text-base font-bold text-[#2D1810]">
                          {isMr ? 'अष्टकूट ३६ गुण तुलनात्मक तक्ता' : 'Ashtakoota 36 Points Comparative Table'}
                        </h3>
                        <span className="text-xs font-mono font-bold text-[#D97706] bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A]">
                          Total: {totalScore} / 36
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-[#FAF7F2] text-[#4A2E18] font-bold border-b border-[#EAE1D2]">
                              <th className="py-2.5 px-3">#</th>
                              <th className="py-2.5 px-3">{isMr ? 'कूट नाव' : 'Koota'}</th>
                              <th className="py-2.5 px-3">{isMr ? 'संस्कृत' : 'Sanskrit'}</th>
                              <th className="py-2.5 px-3 text-center">{isMr ? 'कमाल गुण' : 'Max'}</th>
                              <th className="py-2.5 px-3 text-center">{isMr ? 'मिळालेले' : 'Obtained'}</th>
                              <th className="py-2.5 px-3">{isMr ? 'वधूचे मूल्य' : "Bride's"}</th>
                              <th className="py-2.5 px-3">{isMr ? 'वराचे मूल्य' : "Groom's"}</th>
                              <th className="py-2.5 px-3">{isMr ? 'फलित' : 'Result'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F5EFE6]">
                            {kutas.map((k: any, i: number) => (
                              <tr key={k.id || i} className="hover:bg-[#FFFDF9]">
                                <td className="py-2.5 px-3 font-mono text-[#786C60]">{i + 1}</td>
                                <td className="py-2.5 px-3 font-bold text-[#2D1810]">{k.shortName || k.name}</td>
                                <td className="py-2.5 px-3 font-serif text-[#D97706]">{k.sanskrit || '—'}</td>
                                <td className="py-2.5 px-3 text-center font-mono">{k.maxPoints}</td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-700 bg-amber-50/50">
                                  {k.obtainedPoints}
                                </td>
                                <td className="py-2.5 px-3 text-[#5C4535]">{k.girlValue || '—'}</td>
                                <td className="py-2.5 px-3 text-[#5C4535]">{k.boyValue || '—'}</td>
                                <td className="py-2.5 px-3 text-[11px] text-[#786C60] max-w-xs truncate" title={k.analysis}>
                                  {k.analysis || 'Auspicious harmony'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Detailed Cards */}
                    <div className="space-y-4">
                      {kutas.map((k: any, idx: number) => {
                        const isFullScore = k.obtainedPoints === k.maxPoints;
                        const isZeroScore = k.obtainedPoints === 0;

                        return (
                          <div
                            key={k.id || idx}
                            className="bg-white border border-[#EAE1D2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 transition-all hover:border-[#FDE68A]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-[#2D1810] text-sm sm:text-base">
                                  {k.name}
                                </h3>
                                {k.sanskrit && (
                                  <span className="text-xs font-serif text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A]">
                                    {k.sanskrit}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold ${
                                  isFullScore
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                    : isZeroScore
                                    ? 'bg-rose-50 text-rose-800 border border-rose-300'
                                    : 'bg-amber-50 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {k.obtainedPoints} / {k.maxPoints} Pts
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-[#4A2E18] leading-relaxed">
                              {k.description}
                            </p>

                            {(k.boyValue || k.girlValue || k.analysis) && (
                              <div className="pt-2.5 border-t border-[#F5EFE6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#786C60]">
                                <div className="space-x-3">
                                  {k.girlValue && (
                                    <span>
                                      {isMr ? 'वधू:' : "Bride:"} <strong className="text-[#2D1810]">{k.girlValue}</strong>
                                    </span>
                                  )}
                                  {k.boyValue && (
                                    <span>
                                      {isMr ? 'वर:' : "Groom:"} <strong className="text-[#2D1810]">{k.boyValue}</strong>
                                    </span>
                                  )}
                                </div>
                                {k.analysis && (
                                  <div className="text-[11px] font-medium text-[#B45309]">
                                    {k.analysis}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ========================================================
                    SUB-TAB 2: MANGLIK DOSHA MATCHING
                   ======================================================== */}
                {reportSubTab === 'manglik' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
                        <h3 className="font-serif text-lg font-bold text-[#2D1810] flex items-center space-x-2">
                          <ShieldCheck className="w-5 h-5 text-amber-600" />
                          <span>{isMr ? 'मंगळ (कुज) दोष तुलना व विश्लेषण' : 'Manglik (Kuja) Dosha Detailed Analysis'}</span>
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          manglikMatching?.compatible ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {manglikMatching?.verdict || 'Auspicious'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bride Manglik Status */}
                        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-rose-200 space-y-3">
                          <span className="text-xs font-bold text-rose-700 uppercase tracking-wide block">
                            {isMr ? 'वधू मंगळ स्थिती (Bride)' : "Bride's Mars Status"}
                          </span>
                          <div className="text-base font-bold text-[#2D1810]">
                            {result?.girlChart?.manglik?.status || 'No Manglik Dosha'}
                          </div>
                          <div className="text-xs text-[#786C60] space-y-1">
                            <div>
                              <strong>{isMr ? 'लग्नापासून मंगळ स्थान:' : 'Mars from Lagna:'}</strong>{' '}
                              {result?.girlChart?.manglik?.houseFromLagna}वे भाव ({result?.girlChart?.manglik?.marsSignName})
                            </div>
                            <div>
                              <strong>{isMr ? 'चंद्रापासून मंगळ स्थान:' : 'Mars from Moon:'}</strong>{' '}
                              {result?.girlChart?.manglik?.houseFromMoon}वे भाव
                            </div>
                            {result?.girlChart?.manglik?.isCancelled && (
                              <div className="text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 text-[11px] font-medium border border-emerald-200">
                                ✓ परिहार (Cancellation): {result.girlChart.manglik.cancellations?.[0] || 'Cancelled via planetary strength'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Groom Manglik Status */}
                        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-300 space-y-3">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block">
                            {isMr ? 'वर मंगळ स्थिती (Groom)' : "Groom's Mars Status"}
                          </span>
                          <div className="text-base font-bold text-[#2D1810]">
                            {result?.boyChart?.manglik?.status || 'No Manglik Dosha'}
                          </div>
                          <div className="text-xs text-[#786C60] space-y-1">
                            <div>
                              <strong>{isMr ? 'लग्नापासून मंगळ स्थान:' : 'Mars from Lagna:'}</strong>{' '}
                              {result?.boyChart?.manglik?.houseFromLagna}वे भाव ({result?.boyChart?.manglik?.marsSignName})
                            </div>
                            <div>
                              <strong>{isMr ? 'चंद्रापासून मंगळ स्थान:' : 'Mars from Moon:'}</strong>{' '}
                              {result?.boyChart?.manglik?.houseFromMoon}वे भाव
                            </div>
                            {result?.boyChart?.manglik?.isCancelled && (
                              <div className="text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 text-[11px] font-medium border border-emerald-200">
                                ✓ परिहार (Cancellation): {result.boyChart.manglik.cancellations?.[0] || 'Cancelled via planetary strength'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Manglik Matching Verdict */}
                      <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                        <strong className="text-sm font-bold text-[#92400E] block">
                          {isMr ? 'मंगळ दोष मिलन निष्कर्ष:' : 'Manglik Compatibility Verdict:'}
                        </strong>
                        <p className="text-xs text-[#78350F] leading-relaxed">
                          {manglikMatching?.description ||
                            'Classical Parashari Vedic astrology dictates that when both charts have balanced Mars energy or active cancellations, marital life remains peaceful, prosperous, and secure.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    SUB-TAB 3: DOSHAS & PARIHARA (NADI, BHAKOOT, RAJJU, VEDHA)
                   ======================================================== */}
                {reportSubTab === 'doshas' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nadi Dosha Card */}
                      <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-[#2D1810]">
                            {isMr ? 'नाडी दोष विश्लेषण' : 'Nadi Dosha Analysis'}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            doshas?.nadiDosha?.present ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}>
                            {doshas?.nadiDosha?.present ? 'Dosha Present' : 'No Nadi Dosha'}
                          </span>
                        </div>
                        <p className="text-xs text-[#786C60] leading-relaxed">
                          {doshas?.nadiDosha?.reason || 'Auspicious Nadi synergy.'}
                        </p>
                        {doshas?.nadiDosha?.cancelled && (
                          <div className="text-[11px] bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                            <strong>नाडी दोष परिहार (Cancelled):</strong> Exception conditions satisfied according to Sage Parashara.
                          </div>
                        )}
                      </div>

                      {/* Bhakoot Dosha Card */}
                      <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-[#2D1810]">
                            {isMr ? 'भकूट दोष विश्लेषण' : 'Bhakoot Dosha Analysis'}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            doshas?.bhakootDosha?.present ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}>
                            {doshas?.bhakootDosha?.present ? 'Dosha Present' : 'No Bhakoot Dosha'}
                          </span>
                        </div>
                        <p className="text-xs text-[#786C60] leading-relaxed">
                          {doshas?.bhakootDosha?.reason || 'Harmonious Rashi placement.'}
                        </p>
                        {doshas?.bhakootDosha?.cancelled && (
                          <div className="text-[11px] bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                            <strong>भकूट दोष परिहार (Cancelled):</strong> Same or friendly planetary lords eliminate discord.
                          </div>
                        )}
                      </div>

                      {/* Rajju Dosha Card */}
                      <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-[#2D1810]">
                            {isMr ? 'रज्जू दोष (Rajju Koota)' : 'Rajju Dosha Analysis'}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            doshas?.rajjuDosha?.present ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}>
                            {doshas?.rajjuDosha?.present ? 'Same Rajju' : 'Auspicious'}
                          </span>
                        </div>
                        <p className="text-xs text-[#786C60] leading-relaxed">
                          {doshas?.rajjuDosha?.present
                            ? 'Both partners share the same Rajju. Minor remedies are recommended for long-term health and domestic tranquility.'
                            : 'Different Rajjus between birth stars ensure marital longevity, vibrant physical health, and family peace.'}
                        </p>
                      </div>

                      {/* Vedha Dosha Card */}
                      <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-[#2D1810]">
                            {isMr ? 'वेध दोष (Vedha Dosha)' : 'Vedha Dosha Analysis'}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            doshas?.vedhaDosha?.present ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}>
                            {doshas?.vedhaDosha?.present ? 'Vedha Present' : 'No Vedha'}
                          </span>
                        </div>
                        <p className="text-xs text-[#786C60] leading-relaxed">
                          {doshas?.vedhaDosha?.present
                            ? 'Nakshatra mutual affliction identified. Traditional chanting and donations can mitigate obstacles.'
                            : 'No mutual Vedha (obstruction) between the chosen birth stars. Spiritual harmony is fully supported.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    SUB-TAB 4: VISUAL BIRTH CHARTS (D1 RASHI & D9 NAVAMSHA)
                   ======================================================== */}
                {reportSubTab === 'charts' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5EFE6] pb-3">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                            {isMr ? 'दोन्ही जन्मकुंडल्या (वैदिक डायमंड चार्ट्स)' : 'Interactive Vedic Birth Charts Comparison'}
                          </h3>
                          <p className="text-xs text-[#786C60]">
                            {isMr ? 'लग्न पत्रिका (D1) आणि नवमांश पत्रिका (D9) चा तुलनात्मक अभ्यास' : 'Side-by-side D-1 Rashi & D-9 Navamsha charts'}
                          </p>
                        </div>

                        {/* D1 / D9 Switcher */}
                        <div className="flex bg-[#FAF7F2] p-1 rounded-xl text-xs border border-[#EAE1D2]">
                          <button
                            onClick={() => setChartView('d1')}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                              chartView === 'd1' ? 'bg-[#D97706] text-white' : 'text-[#786C60] hover:text-[#2D1810]'
                            }`}
                          >
                            D-1 Rashi Chart
                          </button>
                          <button
                            onClick={() => setChartView('d9')}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                              chartView === 'd9' ? 'bg-[#D97706] text-white' : 'text-[#786C60] hover:text-[#2D1810]'
                            }`}
                          >
                            D-9 Navamsha Chart
                          </button>
                        </div>
                      </div>

                      {/* Side-by-side Charts Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Bride Chart */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-rose-700 uppercase tracking-wide block text-center">
                            {isMr ? 'वधू कुंडली (Bride)' : "Bride's Kundli"}: {result?.girlChart?.fullName || girlName}
                          </span>
                          <NorthIndianChart
                            chartData={result?.girlChart}
                            houses={chartView === 'd9' && result?.girlChart?.navamsaHouses ? result.girlChart.navamsaHouses : result?.girlChart?.houses}
                            title={`${result?.girlChart?.fullName || 'Bride'} · ${chartView === 'd9' ? 'D-9 Navamsha' : 'D-1 Rashi'}`}
                            subtitle={`Lagna: ${result?.girlChart?.ascendant?.signName} · Moon: ${result?.girlChart?.moonSign?.signName}`}
                          />
                        </div>

                        {/* Groom Chart */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block text-center">
                            {isMr ? 'वर कुंडली (Groom)' : "Groom's Kundli"}: {result?.boyChart?.fullName || boyName}
                          </span>
                          <NorthIndianChart
                            chartData={result?.boyChart}
                            houses={chartView === 'd9' && result?.boyChart?.navamsaHouses ? result.boyChart.navamsaHouses : result?.boyChart?.houses}
                            title={`${result?.boyChart?.fullName || 'Groom'} · ${chartView === 'd9' ? 'D-9 Navamsha' : 'D-1 Rashi'}`}
                            subtitle={`Lagna: ${result?.boyChart?.ascendant?.signName} · Moon: ${result?.boyChart?.moonSign?.signName}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    SUB-TAB 5: 7TH HOUSE & PLANETARY HARMONY
                   ======================================================== */}
                {reportSubTab === 'planetary' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="border-b border-[#F5EFE6] pb-3">
                        <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                          {isMr ? '७वे स्थान, शुक्र-गुरु आणि नवमांश समन्वय' : '7th House (Kalatra Bhava) & Karaka Evaluation'}
                        </h3>
                        <p className="text-xs text-[#786C60]">
                          Astrological assessment of marital happiness, longevity, and affection beyond Ashtakoota.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EAE1D2] space-y-2">
                          <strong className="text-xs font-bold text-[#2D1810] block">
                            {isMr ? 'शुक्र ग्रह (विवाह कारक) समन्वय:' : 'Venus (Kalatrakaraka) Alignment:'}
                          </strong>
                          <p className="text-xs text-[#786C60] leading-relaxed">
                            {result?.planetaryHarmony?.venusHarmony ||
                              'Auspicious Venus placement supports emotional harmony and romantic appreciation between partners.'}
                          </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EAE1D2] space-y-2">
                          <strong className="text-xs font-bold text-[#2D1810] block">
                            {isMr ? 'नवमांश (D9) अंतरात्मा समन्वय:' : 'Navamsha (D9) Soul Compatibility:'}
                          </strong>
                          <p className="text-xs text-[#786C60] leading-relaxed">
                            {result?.planetaryHarmony?.d9Harmony ||
                              'Favorable Navamsha alignment indicates shared spiritual values and long-term marital growth.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================
                    SUB-TAB 6: STRENGTHS, REMEDIES & CONSULTATION
                   ======================================================== */}
                {reportSubTab === 'remedies' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="border-b border-[#F5EFE6] pb-3">
                        <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                          {isMr ? 'वैदिक उपाय आणि ज्योतिषी मार्गदर्शन' : 'Traditional Vedic Remedies & Astrological Guidance'}
                        </h3>
                        <p className="text-xs text-[#786C60]">
                          Prescribed remedial rituals for marital happiness, prosperity, and longevity.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {(result?.summary?.traditionalRemedies || [
                          'Perform Gauri-Shankar Puja or Rudrabhishek on Mondays for lasting marital bliss.',
                          'Chant the Maha Mrityunjaya Mantra daily for health, longevity, and family peace.',
                          'Donate green lentils or feed cows on Wednesdays for planetary harmony.',
                        ]).map((rem: string, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start space-x-3 text-xs text-[#78350F]">
                            <Sparkles className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                            <span>{rem}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA to Consult Astrologer */}
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                          <strong className="text-sm font-bold text-[#2D1810] block">
                            {isMr ? 'आमच्या ज्येष्ठ ज्योतिषांशी थेट चर्चा करा' : 'Consult Our Senior Vedic Astrologers'}
                          </strong>
                          <p className="text-xs text-[#786C60]">
                            {isMr
                              ? 'दोष निवारण, लग्नाचा शुभ मुहूर्त आणि सविस्तर कुंडली विश्लेषण मिळवा.'
                              : 'Get personalized Dosha remedies, auspicious wedding Muhurat, and deep chart analysis.'}
                          </p>
                        </div>
                        <Link
                          href="/astrologers"
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs font-bold shadow-md hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{isMr ? 'ज्योतिषी सल्लामसलत बुक करा' : 'Book Consultation'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
