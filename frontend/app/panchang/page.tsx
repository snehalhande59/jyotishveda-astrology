'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { searchLocalCities, CityLocation } from '@/lib/cities';
import { PanchangData } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  Compass,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  RotateCw,
  Search,
  Loader2,
  Navigation,
} from 'lucide-react';

// ── Marathi translation tables ────────────────────────────────────────────────

const MARATHI_TITHIS: Record<string, string> = {
  Pratipada: 'प्रतिपदा',
  Dwitiya: 'द्वितीया',
  Tritiya: 'तृतीया',
  Chaturthi: 'चतुर्थी',
  Panchami: 'पंचमी',
  Shashthi: 'षष्ठी',
  Saptami: 'सप्तमी',
  Ashtami: 'अष्टमी',
  Navami: 'नवमी',
  Dashami: 'दशमी',
  Ekadashi: 'एकादशी',
  Dvadashi: 'द्वादशी',
  Trayodashi: 'त्रयोदशी',
  Chaturdashi: 'चतुर्दशी',
  Purnima: 'पौर्णिमा',
  Amavasya: 'अमावास्या',
};

const MARATHI_VAARAS: Record<string, string> = {
  Ravivara: 'रविवार',
  Somavara: 'सोमवार',
  Mangalavara: 'मंगळवार',
  Budhavara: 'बुधवार',
  Guruvara: 'गुरुवार',
  Shukravara: 'शुक्रवार',
  Shanivara: 'शनिवार',
  Sunday: 'रविवार',
  Monday: 'सोमवार',
  Tuesday: 'मंगळवार',
  Wednesday: 'बुधवार',
  Thursday: 'गुरुवार',
  Friday: 'शुक्रवार',
  Saturday: 'शनिवार',
};

const MARATHI_PAKSHAS: Record<string, string> = {
  Shukla: 'शुक्ल पक्ष',
  Krishna: 'कृष्ण पक्ष',
};

const MARATHI_NAKSHATRAS: Record<string, string> = {
  Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका',
  Rohini: 'रोहिणी', Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा',
  Punarvasu: 'पुनर्वसू', Pushya: 'पुष्य', Ashlesha: 'आश्लेषा',
  Magha: 'मघा', 'Purva Phalguni': 'पूर्वाफाल्गुनी', 'Uttara Phalguni': 'उत्तराफाल्गुनी',
  Hasta: 'हस्त', Chitra: 'चित्रा', Swati: 'स्वाती',
  Vishakha: 'विशाखा', Anuradha: 'अनुराधा', Jyeshtha: 'ज्येष्ठा',
  Mula: 'मूळ', 'Purva Ashadha': 'पूर्वाषाढा', 'Uttara Ashadha': 'उत्तराषाढा',
  Shravana: 'श्रवण', Dhanishtha: 'धनिष्ठा', Shatabhisha: 'शततारका',
  'Purva Bhadrapada': 'पूर्वाभाद्रपदा', 'Uttara Bhadrapada': 'उत्तराभाद्रपदा', Revati: 'रेवती',
};

const MARATHI_YOGAS: Record<string, string> = {
  Vishkambha: 'विष्कंभ', Priti: 'प्रीती', Ayushman: 'आयुष्मान',
  Saubhagya: 'सौभाग्य', Shobhana: 'शोभन', Atiganda: 'अतिगंड',
  Sukarman: 'सुकर्मा', Dhriti: 'धृती', Shula: 'शूल',
  Ganda: 'गंड', Vriddhi: 'वृद्धी', Dhruva: 'ध्रुव',
  Vyaghata: 'व्याघात', Harshana: 'हर्षण', Vajra: 'वज्र',
  Siddhi: 'सिद्धी', Vyatipata: 'व्यतिपात', Variyana: 'वरीयान',
  Parigha: 'परिघ', Shiva: 'शिव', Siddha: 'सिद्ध',
  Sadhya: 'साध्य', Shubha: 'शुभ', Shukla: 'शुक्ल',
  Brahma: 'ब्रह्म', Indra: 'इंद्र', Vaidhriti: 'वैधृती',
};

const MARATHI_KARANAS: Record<string, string> = {
  Bava: 'बव', Balava: 'बालव', Kaulava: 'कौलव',
  Taitila: 'तैतिल', Gara: 'गर', Vanija: 'वणिज',
  'Vishti': 'विष्टी (भद्रा)', Shakuni: 'शकुनि', Chatushpada: 'चतुष्पाद',
  Naga: 'नाग', Kimstughna: 'किंस्तुघ्न', Bhadra: 'भद्रा',
};

export default function PanchangPage() {
  const { language, t, translatePlanet } = useLanguage();
  const isMr = language === 'mr';

  // ── Form state ────────────────────────────────────────────────────────────
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [placeQuery, setPlaceQuery] = useState('Mumbai');
  const [latitude, setLatitude] = useState(19.076);
  const [longitude, setLongitude] = useState(72.8777);
  const [timezoneOffset, setTimezoneOffset] = useState(5.5);
  const [coordsSource, setCoordsSource] = useState<'preset' | 'gps' | 'search'>('preset');

  // ── Location search state ─────────────────────────────────────────────────
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const liveSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Panchang result state ─────────────────────────────────────────────────
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // ── Initialize with current date, time, and GPS location ─────────────────
  useEffect(() => {
    setMounted(true);
    try {
      trackEvent({
        eventType: 'tool_view',
        serviceName: 'Daily Vedic Panchang',
        serviceCategory: 'free_tool',
        targetSlug: '/panchang',
      });
    } catch {}
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setTime(`${hh}:${mm}`);

    // Try GPS auto-detect
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lon = parseFloat(pos.coords.longitude.toFixed(4));
          setLatitude(lat);
          setLongitude(lon);
          setTimezoneOffset(5.5); // IST default; can be computed if needed
          setCoordsSource('gps');
          // Reverse geocode to get city name
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`,
              { headers: { 'User-Agent': 'JyotishVeda/1.0' } }
            );
            if (resp.ok) {
              const data = await resp.json();
              const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.county ||
                'Your Location';
              setPlaceQuery(city);
            }
          } catch {
            setPlaceQuery('Your Location');
          }
          setIsGpsLoading(false);
        },
        () => {
          // GPS denied — keep Mumbai default
          setIsGpsLoading(false);
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    }
  }, []);

  // ── Location search logic ─────────────────────────────────────────────────
  const handleLocationInput = useCallback((query: string) => {
    setPlaceQuery(query);
    setShowDropdown(true);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    // Instant local match
    const local = searchLocalCities(query);
    setSearchResults(local.slice(0, 8));

    // Debounced live Nominatim search
    if (liveSearchTimer.current) clearTimeout(liveSearchTimer.current);
    liveSearchTimer.current = setTimeout(async () => {
      if (query.trim().length < 2) return;
      setIsSearchingLocation(true);
      try {
        const liveResults = await api.searchLocation(query);
        if (liveResults && liveResults.length > 0) {
          // Merge: local first, then live (deduplicated by name)
          const merged = [...local];
          liveResults.forEach((r: CityLocation) => {
            if (!merged.find((m) => m.name.toLowerCase() === r.name.toLowerCase())) {
              merged.push(r);
            }
          });
          setSearchResults(merged.slice(0, 10));
        }
      } catch {
        // Keep local results on live search failure
      } finally {
        setIsSearchingLocation(false);
      }
    }, 400);
  }, []);

  const selectCity = useCallback((city: CityLocation) => {
    setPlaceQuery(city.name);
    setLatitude(city.latitude);
    setLongitude(city.longitude);
    setTimezoneOffset(city.timezoneOffset);
    setCoordsSource('search');
    setShowDropdown(false);
    setSearchResults([]);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Fetch Panchang ────────────────────────────────────────────────────────
  const fetchPanchang = useCallback(async () => {
    if (!date || !time) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.calculatePanchang({
        date,
        time,
        latitude,
        longitude,
        timezoneOffset,
      });
      setPanchang(res);
    } catch (err: any) {
      setError(
        err?.message ||
          (isMr
            ? 'पंचांग गणना अयशस्वी झाली. कृपया इंटरनेट तपासा.'
            : 'Failed to calculate Panchang. Please check your connection.')
      );
    } finally {
      setLoading(false);
    }
  }, [date, time, latitude, longitude, timezoneOffset, isMr]);

  useEffect(() => {
    if (mounted && date && time) {
      fetchPanchang();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time, latitude, longitude, timezoneOffset, mounted]);

  // ── Translation helpers ───────────────────────────────────────────────────
  const translateTithi = (name?: string) => {
    if (!name) return '';
    return isMr ? MARATHI_TITHIS[name] || name : name;
  };

  const translateVaara = (sanskrit?: string, engName?: string) => {
    if (isMr) {
      return (sanskrit && MARATHI_VAARAS[sanskrit]) || (engName && MARATHI_VAARAS[engName]) || sanskrit || engName || '';
    }
    return sanskrit || engName || '';
  };

  const translatePaksha = (paksha?: string) => {
    if (!paksha) return '';
    return isMr ? MARATHI_PAKSHAS[paksha] || `${paksha} पक्ष` : `${paksha} Paksha`;
  };

  const translateNakshatra = (name?: string) => {
    if (!name) return '';
    return isMr ? MARATHI_NAKSHATRAS[name] || name : name;
  };

  const translateYoga = (name?: string) => {
    if (!name) return '';
    return isMr ? MARATHI_YOGAS[name] || name : name;
  };

  const translateKarana = (name?: string) => {
    if (!name) return '';
    return isMr ? MARATHI_KARANAS[name] || name : name;
  };

  const coordsBadge =
    coordsSource === 'gps'
      ? isMr ? '📍 GPS स्थान' : '📍 GPS Location'
      : `📍 ${isMr ? 'अक्षांश' : 'Lat'}: ${latitude.toFixed(4)}, ${isMr ? 'रेखांश' : 'Lon'}: ${longitude.toFixed(4)}`;

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{isMr ? 'अचूक खगोलीय ग्रहगणित' : 'Pure Astronomical Ephemeris'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2D1810]">
            {isMr ? 'दैनिक वैदिक पंचांग (५ मुख्य अंगे)' : 'Vedic Panchang (Five Sacred Limbs)'}
          </h1>
          <p className="text-[#786C60] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            {isMr
              ? 'भारत सरकारमान्य चित्रापक्ष / लाहिरी अयनांशावर आधारित अचूक तिथी, वार, नक्षत्र, योग, करण व शुभ मुहूर्त.'
              : 'Computed strictly with the Chitrapaksha / Lahiri Sidereal ephemeris for exact coordinates and time. Never fabricated or generalized.'}
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-white border border-[#EAE1D2] rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-[#4A2E18] uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{isMr ? 'दिनांक' : 'Date'}</span>
                </span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-4 py-2.5 text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-bold text-[#4A2E18] uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{isMr ? 'वेळ' : 'Calculation Time'}</span>
                </span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-4 py-2.5 text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              />
            </div>

            {/* Location with live search */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#4A2E18] uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{isMr ? 'स्थान / शहर' : 'Location / City'}</span>
                  {isGpsLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" />}
                </span>
              </label>
              <div className="relative">
                <input
                  ref={locationInputRef}
                  type="text"
                  value={placeQuery}
                  onChange={(e) => handleLocationInput(e.target.value)}
                  onFocus={() => {
                    if (placeQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  placeholder={isMr ? 'शहर टाइप करा...' : 'Type a city...'}
                  className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-4 py-2.5 pr-10 text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D97706]">
                  {isSearchingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 opacity-60" />
                  )}
                </div>
              </div>

              {/* Coordinates badge */}
              <p className="mt-1.5 text-[11px] text-[#786C60] font-medium">{coordsBadge}</p>

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#EAE1D2] rounded-2xl shadow-lg overflow-hidden max-h-64 overflow-y-auto"
                >
                  {searchResults.map((city, idx) => (
                    <button
                      key={`${city.name}-${idx}`}
                      type="button"
                      onMouseDown={() => selectCity(city)}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#FFF9EB] text-sm text-[#2D1810] border-b border-[#F5EFE6] last:border-0 transition-colors"
                    >
                      <span className="font-semibold">{city.name}</span>
                      <span className="text-[#786C60] text-xs ml-2">{city.stateCountry}</span>
                      <span className="text-[#D97706] text-[10px] ml-2 font-mono">
                        {city.latitude.toFixed(2)}°N {city.longitude.toFixed(2)}°E
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* GPS detect button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!navigator.geolocation) return;
                setIsGpsLoading(true);
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    const lat = parseFloat(pos.coords.latitude.toFixed(4));
                    const lon = parseFloat(pos.coords.longitude.toFixed(4));
                    setLatitude(lat);
                    setLongitude(lon);
                    setTimezoneOffset(5.5);
                    setCoordsSource('gps');
                    try {
                      const resp = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`,
                        { headers: { 'User-Agent': 'JyotishVeda/1.0' } }
                      );
                      if (resp.ok) {
                        const data = await resp.json();
                        setPlaceQuery(
                          data.address?.city || data.address?.town || data.address?.village || 'GPS Location'
                        );
                      }
                    } catch {
                      setPlaceQuery('GPS Location');
                    }
                    setIsGpsLoading(false);
                  },
                  () => setIsGpsLoading(false),
                  { timeout: 8000 }
                );
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-[#D97706] hover:text-[#B45309] font-semibold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isMr ? 'माझे GPS स्थान वापरा' : 'Use My GPS Location'}</span>
              {isGpsLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="py-12 text-center text-[#D97706] flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">
              {isMr ? 'ग्रहगणिताची अचूक गणना करत आहे...' : 'Calculating celestial ephemeris...'}
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchPanchang}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center space-x-1"
            >
              <RotateCw className="w-3 h-3" />
              <span>{isMr ? 'पुन्हा प्रयत्न करा' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Panchang Data Display */}
        {panchang && !loading && (
          <div className="space-y-8 animate-fadeIn">

            {/* Summary header */}
            <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FFF9EB] border border-[#FDE68A] rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-bold text-[#92400E]">
                {isMr ? `${placeQuery} साठी आजचे पंचांग` : `Today's Panchang for ${placeQuery}`}
              </div>
              <div className="text-xs text-[#B45309]">
                {date} · {time} IST
              </div>
            </div>

            {/* The 5 Limbs (Panchang) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* 1. Tithi */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '१. तिथी' : '1. Tithi (Lunar Day)'}
                  </span>
                  <Moon className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {translateTithi(panchang.tithi?.name)}
                  </h3>
                  <p className="text-xs text-[#786C60]">
                    {translatePaksha(panchang.tithi?.paksha)} ({isMr ? 'दिवस' : 'Day'} {panchang.tithi?.number})
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                  <div>
                    {isMr ? 'देवता:' : 'Deity:'} <strong className="text-[#2D1810]">{panchang.tithi?.deity}</strong>
                  </div>
                  <div>
                    {isMr ? 'प्रगती:' : 'Progress:'} <strong className="text-[#B45309]">{panchang.tithi?.progressPercent}%</strong>
                  </div>
                </div>
              </div>

              {/* 2. Vaara */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '२. वार' : '2. Vaara (Solar Day)'}
                  </span>
                  <Sun className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {translateVaara(panchang.vaara?.sanskrit, panchang.vaara?.name)}
                  </h3>
                  <p className="text-xs text-[#786C60]">{panchang.vaara?.name}</p>
                </div>
                <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                  <div>
                    {isMr ? 'राशी स्वामी:' : 'Ruling Graha:'}{' '}
                    <strong className="text-[#2D1810]">{translatePlanet(panchang.vaara?.ruler)}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Nakshatra */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '३. नक्षत्र' : '3. Nakshatra'}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {translateNakshatra(panchang.nakshatra?.name)}
                  </h3>
                  <p className="text-xs text-[#786C60]">
                    {isMr ? 'चरण' : 'Pada'} {panchang.nakshatra?.pada}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                  <div>
                    {isMr ? 'स्वामी:' : 'Lord:'}{' '}
                    <strong className="text-[#2D1810]">{translatePlanet(panchang.nakshatra?.lord)}</strong>
                  </div>
                  <div>
                    {isMr ? 'प्रगती:' : 'Progress:'}{' '}
                    <strong className="text-[#B45309]">{panchang.nakshatra?.progressPercent}%</strong>
                  </div>
                </div>
              </div>

              {/* 4. Yoga */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '४. योग' : '4. Yoga (Angular Sum)'}
                  </span>
                  <Compass className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {translateYoga(panchang.yoga?.name)}
                  </h3>
                  <p className="text-xs text-[#786C60]">#{panchang.yoga?.index} / 27</p>
                </div>
                <div className="pt-2 border-t border-[#F5EFE6] text-[11px]">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      panchang.yoga?.isAuspicious
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {panchang.yoga?.isAuspicious ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                    )}
                    <span>
                      {panchang.yoga?.isAuspicious
                        ? isMr ? 'शुभ योग' : 'Auspicious'
                        : isMr ? 'सावधगिरी' : 'Caution Advised'}
                    </span>
                  </span>
                </div>
              </div>

              {/* 5. Karana */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '५. करण' : '5. Karana (Half Tithi)'}
                  </span>
                  <Clock className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {translateKarana(panchang.karana?.name)}
                  </h3>
                  <p className="text-xs text-[#786C60]">
                    {panchang.karana?.type} {isMr ? 'करण' : 'Karana'}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60]">
                  <span>
                    {panchang.karana?.name?.includes('Vishti') || panchang.karana?.name?.includes('Bhadra')
                      ? isMr ? 'अशुभ (भद्रा)' : 'Inauspicious (Bhadra)'
                      : isMr ? 'सामान्य शुभ' : 'Standard Karmic'}
                  </span>
                </div>
              </div>
            </div>

            {/* Auspicious & Inauspicious Timings */}
            <div className="bg-white border-2 border-[#FDE68A] rounded-3xl p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D1810] flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#D97706]" />
                <span>{isMr ? 'शुभ आणि अशुभ मुहूर्त काळ' : 'Auspicious & Inauspicious Muhurat Windows'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Sunrise & Sunset */}
                <div className="bg-[#FFFDF9] border border-[#EAE1D2] rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-[#D97706] font-bold uppercase tracking-wider">
                    {isMr ? 'सूर्य उदय व अस्त' : 'Solar Transitions'}
                  </span>
                  <div className="text-sm font-bold text-[#2D1810]">
                    ☀️ {isMr ? 'सूर्योदय:' : 'Sunrise:'} {panchang.timings?.sunrise}
                  </div>
                  <div className="text-xs text-[#786C60]">
                    🌅 {isMr ? 'सूर्यास्त:' : 'Sunset:'} {panchang.timings?.sunset}
                  </div>
                </div>

                {/* Abhijit Muhurat */}
                <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isMr ? 'अभिजित मुहूर्त (अतिशुभ)' : 'Abhijit Muhurat (Auspicious)'}</span>
                  </span>
                  <div className="text-sm font-extrabold text-emerald-900">
                    {panchang.timings?.abhijitMuhurat}
                  </div>
                  <div className="text-[11px] text-emerald-800/80">
                    {isMr ? 'नवीन कामाची सुरुवात व खरेदीसाठी' : 'Optimal for new beginnings & contracts'}
                  </div>
                </div>

                {/* Rahu Kalam */}
                <div className="bg-rose-50/70 border border-rose-300 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-rose-800 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isMr ? 'राहु काळ (वर्ज्य काळ)' : 'Rahu Kalam (Avoid Starts)'}</span>
                  </span>
                  <div className="text-sm font-extrabold text-rose-900">
                    {panchang.timings?.rahuKalam}
                  </div>
                  <div className="text-[11px] text-rose-800/80">
                    {isMr ? 'शुभ कार्य सुरू करू नये' : 'Do not inaugurate major ventures'}
                  </div>
                </div>

                {/* Yamaganda & Gulika */}
                <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-amber-900 font-bold uppercase tracking-wider">
                    {isMr ? 'यमगंड आणि गुलिक काळ' : 'Secondary Inauspicious'}
                  </span>
                  <div className="text-xs font-bold text-[#2D1810]">
                    {isMr ? 'यमगंड:' : 'Yamaganda:'} {panchang.timings?.yamaganda}
                  </div>
                  <div className="text-xs text-[#786C60]">
                    {isMr ? 'गुलिक काळ:' : 'Gulika Kalam:'} {panchang.timings?.gulikaKalam}
                  </div>
                </div>
              </div>
            </div>

            {/* Astronomical Meta */}
            <div className="bg-[#FFFDF9] border border-[#EAE1D2] rounded-2xl p-4 flex flex-wrap items-center justify-between text-xs text-[#786C60] gap-3">
              <div>
                {isMr ? 'अयनांश:' : 'Ayanamsa:'}{' '}
                <strong className="text-[#D97706]">
                  {panchang.ayanamsa?.name} ({panchang.ayanamsa?.formatted})
                </strong>
              </div>
              <div>
                {isMr ? 'सायन सूर्य रेखांश:' : 'Sidereal Sun Longitude:'}{' '}
                <strong className="text-[#2D1810]">{panchang.sunLongitude}°</strong>
              </div>
              <div>
                {isMr ? 'सायन चंद्र रेखांश:' : 'Sidereal Moon Longitude:'}{' '}
                <strong className="text-[#2D1810]">{panchang.moonLongitude}°</strong>
              </div>
              <div>
                {isMr ? 'अक्षांश/रेखांश:' : 'Coordinates:'}{' '}
                <strong className="text-[#2D1810] font-mono">{latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
