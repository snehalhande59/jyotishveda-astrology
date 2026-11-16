'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { POPULAR_CITIES, CityLocation, searchLocalCities } from '@/lib/cities';
import { calculateFullCompatibility } from '@/lib/calculator-engine';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/lib/analytics';
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
  RefreshCw,
  PlusCircle,
  RotateCcw,
  Search,
  Loader2,
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
        TOTAL SCORE
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
          GUNA SCORE
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
    <div className="w-14 h-14 rounded-full border-2 border-[#F59E0B] p-0.5 bg-gradient-to-tr from-amber-100 to-amber-50 shadow-xs flex items-center justify-center shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full rounded-full">
        <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
        <path d="M18 36 C16 22, 22 14, 32 14 C42 14, 48 22, 46 36 C42 32, 40 28, 32 28 C24 28, 22 32, 18 36 Z" fill="#78350F" />
        <circle cx="32" cy="34" r="14" fill="#FDE68A" />
        <circle cx="27" cy="33" r="1.8" fill="#451A03" />
        <circle cx="37" cy="33" r="1.8" fill="#451A03" />
        <path d="M29 38 Q32 41 35 38" fill="none" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 28 C24 22, 30 20, 34 24 C38 20, 42 22, 44 28" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 54 C20 45, 26 43, 32 43 C38 43, 44 45, 46 54" fill="#F59E0B" />
      </svg>
    </div>
  );
}

function MaleAvatar() {
  return (
    <div className="w-14 h-14 rounded-full border-2 border-[#F59E0B] p-0.5 bg-gradient-to-tr from-amber-100 to-amber-50 shadow-xs flex items-center justify-center shrink-0">
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
  const { language, t, translateSign, formatNumber } = useLanguage();
  const isMr = language === 'mr';

  const defaultSangamner = POPULAR_CITIES.find((c) => c.name === 'Sangamner') || POPULAR_CITIES[0];
  const defaultSinnar = POPULAR_CITIES.find((c) => c.name === 'Sinnar') || POPULAR_CITIES[1] || POPULAR_CITIES[0];

  // Active Tab: 'form' for user entry, 'report' once generated
  const [activeTab, setActiveTab] = useState<'report' | 'form'>('form');

  // Girl Details (Empty by default for clean user input)
  const [girlName, setGirlName] = useState('');
  const [girlDob, setGirlDob] = useState('');
  const [girlTob, setGirlTob] = useState('12:00');
  const [girlCity, setGirlCity] = useState<CityLocation>(defaultSangamner);

  // Boy Details (Empty by default for clean user input)
  const [boyName, setBoyName] = useState('');
  const [boyDob, setBoyDob] = useState('');
  const [boyTob, setBoyTob] = useState('12:00');
  const [boyCity, setBoyCity] = useState<CityLocation>(defaultSinnar);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
        matchRes.boyChart.fullName = bData.fullName || (isMr ? 'वर' : 'Boy');
        matchRes.boyChart.dateOfBirth = bData.dateOfBirth;
        matchRes.boyChart.timeOfBirth = bData.timeOfBirth;
        matchRes.boyChart.placeOfBirth = bData.placeOfBirth;

        matchRes.girlChart.fullName = gData.fullName || (isMr ? 'वधू' : 'Girl');
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
      fullName: boyName || (isMr ? 'वर' : 'Boy'),
      dateOfBirth: boyDob,
      timeOfBirth: boyTob || '12:00',
      placeOfBirth: boyCity.name + ', ' + boyCity.stateCountry,
      latitude: boyCity.latitude,
      longitude: boyCity.longitude,
    };
    const girlBirth = {
      fullName: girlName || (isMr ? 'वधू' : 'Girl'),
      dateOfBirth: girlDob,
      timeOfBirth: girlTob || '12:00',
      placeOfBirth: girlCity.name + ', ' + girlCity.stateCountry,
      latitude: girlCity.latitude,
      longitude: girlCity.longitude,
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
    };
    const g = {
      fullName: 'Priyanka Sharma',
      dateOfBirth: '1998-08-15',
      timeOfBirth: '10:30',
      placeOfBirth: 'Pune, Maharashtra, India',
      latitude: defaultSangamner.latitude,
      longitude: defaultSangamner.longitude,
    };
    performMatch(b, g);
  };

  // Track tool view on mount (do not prefill fake/sample report automatically)
  useEffect(() => {
    // Form starts ready for user input
  }, []);

  const kutas = Array.isArray(result?.gunaMilan?.kutas)
    ? result.gunaMilan.kutas
    : result?.gunaMilan?.kutas && typeof result.gunaMilan.kutas === 'object'
    ? Object.keys(result.gunaMilan.kutas).map((key) => ({
        id: key,
        name: key.toUpperCase(),
        obtainedPoints: result.gunaMilan.kutas[key].points,
        maxPoints: result.gunaMilan.kutas[key].max,
        description: 'Compatibility kuta evaluation.',
      }))
    : [];

  const totalScore = result?.gunaMilan?.totalScore ?? 19.5;
  const matchStatus = result?.gunaMilan?.matchStatus || (totalScore >= 18 ? 'GOOD MATCH' : 'AVERAGE MATCH');

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Top Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{isMr ? 'अष्टकूट ३६ गुणमेलन' : 'Astrotalk-Compliant 36 Guna Milan'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
            {isMr ? 'कुंडली मिलन अहवाल' : 'Kundli Matching Report'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] font-medium">
            {girlName || (isMr ? 'वधू' : 'Girl')} &amp; {boyName || (isMr ? 'वर' : 'Boy')} · {isMr ? 'अष्टकूट गुणमेलन' : 'Ashtakoota Guna Milan'}
          </p>
        </div>

        {/* Navigation Tabs & Actions Toolbar */}
        <div className="bg-white border border-[#EAE1D2] rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex bg-[#FAF7F2] p-1 rounded-xl text-xs border border-[#EAE1D2]">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'report' ? 'bg-[#D97706] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{isMr ? 'गुणमेलन अहवाल' : 'Match Report'}</span>
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'form' ? 'bg-[#D97706] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isMr ? 'दुसरी कुंडली काढा (New Match)' : 'Match Another Kundli'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleClearForm}
              className="text-xs font-bold text-[#786C60] hover:text-[#2D1810] flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE1D2] hover:bg-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#D97706]" />
              <span>{isMr ? 'फॉर्म रिकामा करा (Clear)' : 'Reset / Clear'}</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-bold text-[#92400E] flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              <span>{isMr ? 'नमुना जोडी (Sample Match)' : 'Load Sample Match'}</span>
            </button>
          </div>
        </div>

        {/* Form View Tab */}
        {activeTab === 'form' && (
          <form
            onSubmit={handleMatchSubmit}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6 animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
              <h2 className="font-serif text-lg font-bold text-[#2D1810] flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{isMr ? 'दोघांचेही जन्मतपशील भरा' : 'Enter Birth Details for Kundli Matching'}</span>
              </h2>
              <span className="text-[11px] text-[#786C60]">
                {isMr ? 'अचूक अक्षांश व रेखांश स्वयंचलित जोडले जातील' : 'Auto-resolves exact geocoordinates'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Girl / First Person Details */}
              <div className="p-4 sm:p-5 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] space-y-3">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wide block border-b border-[#F5EFE6] pb-1.5 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>{isMr ? '१. वधू / प्रथम व्यक्तीचे तपशील (Girl)' : "1. Girl's / First Person Details"}</span>
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

              {/* Boy / Second Person Details */}
              <div className="p-4 sm:p-5 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] space-y-3">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide block border-b border-[#F5EFE6] pb-1.5 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>{isMr ? '२. वर / द्वितीय व्यक्तीचे तपशील (Boy)' : "2. Boy's / Second Person Details"}</span>
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
                    <span>{isMr ? 'अचूक ३६ गुण गुणमेलन काढा' : 'Calculate 36 Guna Milan Report'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Report View Tab */}
        {activeTab === 'report' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Astrotalk-Style Main Report Card */}
            {result && (
              <div className="bg-white border border-[#EAE1D2] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative space-y-6">

                {/* Top row with Status Badge & Switch to Form Button */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] shadow-2xs">
                    {isMr && matchStatus === 'GOOD MATCH' ? 'उत्तम गुणमेलन (शुभ विवाह)' : matchStatus}
                  </span>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center space-x-1.5 cursor-pointer bg-[#FFFDF9] px-3.5 py-1.5 rounded-xl border border-[#EAE1D2] hover:bg-white transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isMr ? 'दुसरी कुंडली काढा (New Match)' : 'Match Another Kundli'}</span>
                  </button>
                </div>

                {/* Side-by-side Score & Profiles */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">

                  {/* Speedometer Gauge Column */}
                  <div className="lg:col-span-4 flex justify-center border-b lg:border-b-0 lg:border-r border-[#F5EFE6] pb-6 lg:pb-0 lg:pr-6">
                    <SpeedometerGauge score={totalScore} maxScore={36} />
                  </div>

                  {/* Profiles Column */}
                  <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">

                      {/* Girl Profile (YOUR DETAILS) */}
                      <div className="md:col-span-5 bg-[#FFFDF9] border border-[#F5EFE6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                        <span className="text-[10px] font-bold text-[#786C60] uppercase tracking-wider block">
                          {isMr ? 'तुमचे जन्मतपशील' : 'YOUR DETAILS'}
                        </span>
                        <div className="flex items-center space-x-3">
                          <FemaleAvatar />
                          <div>
                            <h3 className="font-bold text-[#2D1810] text-base sm:text-lg leading-tight">
                              {result?.girlChart?.fullName || girlName || (isMr ? 'वधू' : 'Girl')}
                            </h3>
                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                              {result?.girlChart?.moonSign?.signName
                                ? `${result.girlChart.moonSign.signName} (${result.girlChart.moonSign.signSanskrit})`
                                : (typeof result?.girlChart?.moonSign === 'string'
                                    ? result.girlChart.moonSign
                                    : 'Moon Sign')}
                            </span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                          <div>
                            <strong className="text-[#2D1810] font-semibold">{isMr ? 'जन्म:' : 'BORN'}</strong>{' '}
                            {formatDisplayDate(result?.girlChart?.dateOfBirth || girlDob)} · {formatDisplayTime(result?.girlChart?.timeOfBirth || girlTob)}
                          </div>
                          <div>
                            <strong className="text-[#2D1810] font-semibold">{isMr ? 'स्थान:' : 'PLACE'}</strong>{' '}
                            {result?.girlChart?.placeOfBirth || `${girlCity.name}, ${girlCity.stateCountry}`}
                          </div>
                        </div>
                      </div>

                      {/* Center Rings Connector */}
                      <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                        <div className="w-10 h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-base shadow-xs">
                          💍
                        </div>
                      </div>

                      {/* Boy Profile (PARTNER'S DETAILS) */}
                      <div className="md:col-span-5 bg-[#FFFDF9] border border-[#F5EFE6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                        <span className="text-[10px] font-bold text-[#786C60] uppercase tracking-wider block">
                          {isMr ? 'जोडीदाराचे जन्मतपशील' : "PARTNER'S DETAILS"}
                        </span>
                        <div className="flex items-center space-x-3">
                          <MaleAvatar />
                          <div>
                            <h3 className="font-bold text-[#2D1810] text-base sm:text-lg leading-tight">
                              {result?.boyChart?.fullName || boyName || 'Boy'}
                            </h3>
                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                              {result?.boyChart?.moonSign?.signName
                                ? `${result.boyChart.moonSign.signName} (${result.boyChart.moonSign.signSanskrit})`
                                : (typeof result?.boyChart?.moonSign === 'string'
                                    ? result.boyChart.moonSign
                                    : 'Moon Sign')}
                            </span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                          <div>
                            <strong className="text-[#2D1810] font-semibold">{isMr ? 'जन्म:' : 'BORN'}</strong>{' '}
                            {formatDisplayDate(result?.boyChart?.dateOfBirth || boyDob)} · {formatDisplayTime(result?.boyChart?.timeOfBirth || boyTob)}
                          </div>
                          <div>
                            <strong className="text-[#2D1810] font-semibold">{isMr ? 'स्थान:' : 'PLACE'}</strong>{' '}
                            {result?.boyChart?.placeOfBirth || `${boyCity.name}, ${boyCity.stateCountry}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Ashtakoota Section */}
            {result && (
              <div className="space-y-4">
                <div className="border-b border-[#EAE1D2] pb-2 flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-[#786C60]">
                    {isMr
                      ? 'दोन्ही जन्मकुंडल्यांवरून काढलेले सर्व आठ अष्टकूट गुण तपशील.'
                      : 'All eight Ashtakoota gunas, scored from both birth charts.'}
                  </h2>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="text-xs font-bold text-[#D97706] hover:underline flex items-center space-x-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isMr ? 'नवीन व्यक्तींची कुंडली तपासा' : 'Check Another Couple'}</span>
                  </button>
                </div>

                {/* The 8 Kutas Cards */}
                <div className="space-y-4">
                  {kutas.map((k: any, idx: number) => {
                    const isFullScore = k.obtainedPoints === k.maxPoints;
                    const isZeroScore = k.obtainedPoints === 0;

                    return (
                      <div
                        key={k.id || idx}
                        className="bg-white border border-[#EAE1D2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 transition-all hover:border-[#FDE68A]"
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[#2D1810] text-sm sm:text-base">
                            {k.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold ${
                              isFullScore
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                : isZeroScore
                                ? 'bg-rose-50 text-rose-800 border border-rose-300'
                                : 'bg-amber-50 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {k.obtainedPoints} / {k.maxPoints}
                          </span>
                        </div>

                        {/* Standard Description */}
                        <p className="text-xs sm:text-sm text-[#4A2E18] leading-relaxed">
                          {k.description}
                        </p>

                        {/* Astrological Analysis & Pair Values */}
                        {(k.boyValue || k.girlValue || k.analysis) && (
                          <div className="pt-2.5 border-t border-[#F5EFE6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#786C60]">
                            <div className="space-x-3">
                              {k.girlValue && (
                                <span>
                                  {isMr ? 'वधू:' : "Girl's:"} <strong className="text-[#2D1810]">{k.girlValue}</strong>
                                </span>
                              )}
                              {k.boyValue && (
                                <span>
                                  {isMr ? 'वर:' : "Boy's:"} <strong className="text-[#2D1810]">{k.boyValue}</strong>
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

                {/* Astrological Vedic Guidance Note */}
                <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-bold">
                      {isMr ? 'ज्योतिषीय निष्कर्ष आणि सल्ला:' : 'Vedic Astrological Guidance:'}
                    </strong>
                    <p className="leading-relaxed">
                      {isMr
                        ? `अष्टकूट गुणमेलनात १८ किंवा त्यापेक्षा जास्त गुण (${totalScore}/३६) विवाहानुकूल मानले जातात. ${totalScore >= 18 ? 'गुणमेलन अनुकूल असल्याने हे वैवाहिक संबंध ज्योतिषीय दृष्ट्या शुभ मानले जातात.' : 'गुण १८ पेक्षा कमी असल्याने विवाह संमतीपूर्वी अनुभवी ज्योतिषांचा सल्ला घेणे हितावह ठरेल.'}`
                        : `A score of 18 or higher is traditionally considered auspicious for marriage. With ${totalScore}/36 Gunas matched, ${totalScore >= 18 ? 'this celestial alliance is astrologically recommended.' : 'personalized Vedic astrological counseling is recommended before proceeding.'}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
