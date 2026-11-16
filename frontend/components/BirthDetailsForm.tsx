'use client';

import React, { useState, useEffect, useRef } from 'react';
import { POPULAR_CITIES, searchLocalCities, CityLocation } from '@/lib/cities';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Calendar, Clock, User, Compass, Sparkles, Sliders, CheckCircle2, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export interface BirthFormData {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  gender?: string;
  ayanamsa?: string;
}

interface BirthDetailsFormProps {
  onSubmit: (data: BirthFormData) => void;
  isLoading?: boolean;
  buttonText?: string;
  showGender?: boolean;
  initialData?: Partial<BirthFormData>;
}

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_MR = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];
const WEEKDAYS_EN = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const WEEKDAYS_MR = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export default function BirthDetailsForm({
  onSubmit,
  isLoading = false,
  buttonText,
  showGender = false,
  initialData,
}: BirthDetailsFormProps) {
  const { language, t } = useLanguage();
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');
  
  // Custom Calendar Popup State
  const [showCalendar, setShowCalendar] = useState(false);
  const [calMonth, setCalMonth] = useState<number>(() => {
    if (initialData?.dateOfBirth) {
      const d = new Date(initialData.dateOfBirth);
      if (!isNaN(d.getTime())) return d.getMonth();
    }
    return new Date().getMonth();
  });
  const [calYear, setCalYear] = useState<number>(() => {
    if (initialData?.dateOfBirth) {
      const d = new Date(initialData.dateOfBirth);
      if (!isNaN(d.getTime())) return d.getFullYear();
    }
    return new Date().getFullYear();
  });

  // Custom Time Popup State
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [timeOfBirth, setTimeOfBirth] = useState(initialData?.timeOfBirth || '');
  const [hours12, setHours12] = useState('12');
  const [minutes12, setMinutes12] = useState('00');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  // Location state
  const [placeQuery, setPlaceQuery] = useState(initialData?.placeOfBirth || '');
  const [latitude, setLatitude] = useState<number>(initialData?.latitude ?? 28.6139);
  const [longitude, setLongitude] = useState<number>(initialData?.longitude ?? 77.2090);
  const [timezoneOffset, setTimezoneOffset] = useState<number>(initialData?.timezoneOffset ?? 5.5);
  
  // Autocomplete suggestions
  const [searchResults, setSearchResults] = useState<Array<{
    name: string;
    stateCountry: string;
    displayName: string;
    latitude: number;
    longitude: number;
    timezoneOffset: number;
  }>>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const [gender, setGender] = useState(initialData?.gender || 'Male');
  const [ayanamsa, setAyanamsa] = useState(initialData?.ayanamsa || 'Lahiri');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePopupRef = useRef<HTMLDivElement>(null);

  // Synchronize 12-hour components from timeOfBirth
  useEffect(() => {
    if (timeOfBirth && timeOfBirth.includes(':')) {
      const [hStr, mStr] = timeOfBirth.split(':');
      let h = parseInt(hStr, 10);
      const m = mStr.padStart(2, '0');
      const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
      if (h === 0) h = 12;
      else if (h > 12) h -= 12;
      setHours12(h.toString().padStart(2, '0'));
      setMinutes12(m);
      setAmpm(period);
    }
  }, [timeOfBirth]);

  // Synchronize calendar view if dateOfBirth changes
  useEffect(() => {
    if (dateOfBirth) {
      const parts = dateOfBirth.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        if (!isNaN(y) && !isNaN(m)) {
          setCalYear(y);
          setCalMonth(m);
        }
      }
    }
  }, [dateOfBirth]);

  // Close popups on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
      if (timePopupRef.current && !timePopupRef.current.contains(e.target as Node)) {
        setShowTimePopup(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Format helpers
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('/');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      } else {
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
      }
    }
    return dateStr;
  };

  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr || !timeStr.includes(':')) return '';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr.padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h.toString().padStart(2, '0')}:${m} ${period}`;
  };

  // Calendar logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((prev) => prev - 1);
    } else {
      setCalMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((prev) => prev + 1);
    } else {
      setCalMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const mm = (calMonth + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    const yyyy = calYear.toString();
    setDateOfBirth(`${yyyy}-${mm}-${dd}`);
    setShowCalendar(false);
    if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
  };

  // Time Done Button handler
  const handleTimeDone = () => {
    let h = parseInt(hours12, 10) || 12;
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const hh = h.toString().padStart(2, '0');
    const mm = (parseInt(minutes12, 10) || 0).toString().padStart(2, '0');
    setTimeOfBirth(`${hh}:${mm}`);
    setShowTimePopup(false);
    if (errors.timeOfBirth) setErrors((prev) => ({ ...prev, timeOfBirth: '' }));
  };

  // Debounced live geocoding lookup
  const handleLocationInputChange = (text: string) => {
    setPlaceQuery(text);
    if (errors.placeOfBirth) setErrors({ ...errors, placeOfBirth: '' });

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 1. Instant local matches
    const localMatches = searchLocalCities(text);
    const mappedLocal = localMatches.map((m) => ({
      name: m.name,
      stateCountry: m.stateCountry,
      displayName: `${m.name}, ${m.stateCountry}`,
      latitude: m.latitude,
      longitude: m.longitude,
      timezoneOffset: m.timezoneOffset,
    }));

    setSearchResults(mappedLocal);
    setShowDropdown(mappedLocal.length > 0);

    // If exact name match, proactively lock coordinates
    const exactLocal = localMatches.find(
      (m) =>
        m.name.toLowerCase() === text.trim().toLowerCase() ||
        (m.aliases && m.aliases.some((a) => a.toLowerCase() === text.trim().toLowerCase()))
    );
    if (exactLocal) {
      setLatitude(exactLocal.latitude);
      setLongitude(exactLocal.longitude);
      setTimezoneOffset(exactLocal.timezoneOffset);
    }

    // 2. Debounced API search for global / smaller towns & villages
    debounceTimerRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const livePlaces = await api.searchLocation(text);
        if (Array.isArray(livePlaces) && livePlaces.length > 0) {
          const mappedLive = livePlaces.map((p) => ({
            name: p.name,
            stateCountry: p.stateCountry,
            displayName: p.displayName || `${p.name}, ${p.stateCountry}`,
            latitude: p.latitude,
            longitude: p.longitude,
            timezoneOffset: p.timezoneOffset || 5.5,
          }));

          // Merge without duplicate city names
          const combined = [...mappedLocal];
          for (const item of mappedLive) {
            if (!combined.some((c) => c.displayName.toLowerCase() === item.displayName.toLowerCase())) {
              combined.push(item);
            }
          }
          setSearchResults(combined.slice(0, 10));
          setShowDropdown(combined.length > 0);
        }
      } catch (e) {
        console.warn('Live geocoding network notice:', e);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 250);
  };

  const handleSelectLocation = (loc: {
    displayName: string;
    latitude: number;
    longitude: number;
    timezoneOffset: number;
  }) => {
    setPlaceQuery(loc.displayName);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    setTimezoneOffset(loc.timezoneOffset);
    setShowDropdown(false);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = t('form.errFullName');
    if (!dateOfBirth) errs.dateOfBirth = t('form.errDob');
    if (!placeQuery.trim()) errs.placeOfBirth = t('form.errPlace');
    if (isNaN(latitude) || latitude < -90 || latitude > 90) errs.latitude = t('form.errLat');
    if (isNaN(longitude) || longitude < -180 || longitude > 180) errs.longitude = t('form.errLon');
    if (isNaN(timezoneOffset) || timezoneOffset < -12 || timezoneOffset > 14) errs.timezoneOffset = t('form.errTz');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setErrors({});

    // Intelligent coordinates safety lock
    let finalLat = latitude;
    let finalLon = longitude;
    let finalTz = timezoneOffset;

    if (placeQuery.trim()) {
      const candidates = searchLocalCities(placeQuery.trim());
      if (candidates.length > 0) {
        const exact = candidates.find(
          (c) =>
            c.name.toLowerCase() === placeQuery.trim().toLowerCase() ||
            (c.aliases && c.aliases.some((a) => a.toLowerCase() === placeQuery.trim().toLowerCase()))
        );
        const best = exact || candidates[0];
        // If still default Delhi and query is not Delhi, lock onto best local match
        if (
          !manualOverride &&
          (Math.abs(finalLat - 28.6139) < 0.001 && Math.abs(finalLon - 77.2090) < 0.001) &&
          !placeQuery.toLowerCase().includes('delhi')
        ) {
          finalLat = best.latitude;
          finalLon = best.longitude;
          finalTz = best.timezoneOffset;
        }
      }
    }

    onSubmit({
      fullName: fullName.trim(),
      dateOfBirth,
      timeOfBirth: timeOfBirth || '12:00',
      placeOfBirth: placeQuery.trim(),
      latitude: finalLat,
      longitude: finalLon,
      timezoneOffset: finalTz,
      gender: showGender ? gender : undefined,
      ayanamsa,
    });
  };

  const totalDays = daysInMonth(calYear, calMonth);
  const startOffset = firstDayOfMonth(calYear, calMonth);

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#EAE1D2] p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-5 sm:space-y-6 text-[#2D1810]">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE1D2]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2D1810]">{t('form.title')}</h3>
        </div>
        <span className="text-[11px] font-semibold text-[#B45309] bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#FDE68A]">
          {t('form.badge')}
        </span>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-[#4A2E18] mb-1.5 flex items-center space-x-1.5">
          <User className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{t('form.fullName')}</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors({ ...errors, fullName: '' });
          }}
          placeholder={t('form.fullNamePlaceholder')}
          className={`w-full px-4 py-2.5 bg-[#FAF7F2] border ${
            errors.fullName ? 'border-red-500' : 'border-[#EAE1D2]'
          } rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white placeholder-gray-400 transition-colors`}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.fullName}</span></p>}
      </div>

      {/* Gender (Image 4 reference) */}
      {showGender && (
        <div>
          <label className="block text-xs font-semibold text-[#4A2E18] mb-1.5">
            {language === 'mr' ? 'लिंग' : 'Gender'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender('Male')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                gender === 'Male'
                  ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] shadow-xs'
                  : 'bg-white border-[#EAE1D2] text-[#786C60] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="text-base text-[#D97706]">♂</span>
              <span>{language === 'mr' ? 'पुरुष' : 'Male'}</span>
            </button>
            <button
              type="button"
              onClick={() => setGender('Female')}
              className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                gender === 'Female'
                  ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] shadow-xs'
                  : 'bg-white border-[#EAE1D2] text-[#786C60] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="text-base text-[#D97706]">♀</span>
              <span>{language === 'mr' ? 'स्त्री' : 'Female'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Date & Time Grid (Image 2, 3, 4 reference) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of Birth with Custom Calendar Popup */}
        <div className="relative" ref={calendarRef}>
          <label className="block text-xs font-semibold text-[#4A2E18] mb-1.5 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'जन्म तारीख *' : 'Birth date *'}</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setShowCalendar(!showCalendar);
              setShowTimePopup(false);
            }}
            className={`w-full px-4 py-2.5 bg-[#FAF7F2] border ${
              errors.dateOfBirth ? 'border-red-500' : 'border-[#EAE1D2]'
            } rounded-xl text-sm text-left flex items-center justify-between text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors cursor-pointer`}
          >
            <div className="flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-[#D97706] flex-shrink-0" />
              <span className={dateOfBirth ? 'font-medium text-[#2D1810]' : 'text-gray-400'}>
                {dateOfBirth ? formatDateDisplay(dateOfBirth) : 'dd/mm/yyyy'}
              </span>
            </div>
          </button>
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.dateOfBirth}</span></p>}

          {/* Calendar Popup (Image 2) */}
          {showCalendar && (
            <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] bg-white border border-[#EAE1D2] rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
              {/* Month / Year Header with Selectors */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F5EFE6]">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#786C60] hover:text-[#2D1810]"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-2">
                  <select
                    value={calMonth}
                    onChange={(e) => setCalMonth(parseInt(e.target.value, 10))}
                    className="text-xs font-bold text-[#2D1810] bg-transparent border-none focus:outline-none cursor-pointer py-1"
                  >
                    {(language === 'mr' ? MONTHS_MR : MONTHS_EN).map((mName, idx) => (
                      <option key={mName} value={idx}>
                        {mName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={calYear}
                    onChange={(e) => setCalYear(parseInt(e.target.value, 10))}
                    className="text-xs font-bold text-[#2D1810] bg-transparent border-none focus:outline-none cursor-pointer py-1"
                  >
                    {Array.from({ length: 110 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#786C60] hover:text-[#2D1810]"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {(language === 'mr' ? WEEKDAYS_MR : WEEKDAYS_EN).map((dayName) => (
                  <span key={dayName} className="text-[10px] font-bold text-[#786C60] uppercase">
                    {dayName}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: startOffset }, (_, i) => (
                  <span key={`blank-${i}`} className="p-1.5" />
                ))}

                {Array.from({ length: totalDays }, (_, i) => {
                  const dayNum = i + 1;
                  const curYmd = `${calYear}-${(calMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                  const isSelected = dateOfBirth === curYmd;
                  const isToday =
                    new Date().getFullYear() === calYear &&
                    new Date().getMonth() === calMonth &&
                    new Date().getDate() === dayNum;

                  return (
                    <button
                      type="button"
                      key={`day-${dayNum}`}
                      onClick={() => handleSelectDay(dayNum)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FACC15] text-[#2D1810] font-bold shadow-xs'
                          : isToday
                          ? 'border border-[#F59E0B] text-[#D97706] hover:bg-[#FFF9EB]'
                          : 'text-[#2D1810] hover:bg-[#FAF7F2] hover:text-[#D97706]'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Time of Birth with Custom Time Popup (Image 3) */}
        <div className="relative" ref={timePopupRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#4A2E18] flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{language === 'mr' ? 'जन्म वेळ' : 'Birth time'}</span>
            </label>
            <span className="text-[10px] text-gray-400 font-medium">
              {language === 'mr' ? 'ऐच्छिक' : 'optional'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowTimePopup(!showTimePopup);
              setShowCalendar(false);
            }}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm text-left flex items-center justify-between text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-[#D97706] flex-shrink-0" />
              <span className={timeOfBirth ? 'font-medium text-[#2D1810]' : 'text-gray-400'}>
                {timeOfBirth ? formatTimeDisplay(timeOfBirth) : '--:-- --'}
              </span>
            </div>
          </button>

          {/* Time Picker Popup (Image 3 reference - aligned right so it never overflows) */}
          {showTimePopup && (
            <div className="absolute top-full right-0 left-auto mt-2 w-72 max-w-[calc(100vw-2.5rem)] bg-white border border-[#EAE1D2] rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F5EFE6]">
                {/* Hours Select */}
                <select
                  value={hours12}
                  onChange={(e) => setHours12(e.target.value)}
                  className="px-2.5 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm font-semibold text-[#2D1810] focus:outline-none focus:border-[#D97706] cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                <span className="font-bold text-[#2D1810]">:</span>

                {/* Minutes Select */}
                <select
                  value={minutes12}
                  onChange={(e) => setMinutes12(e.target.value)}
                  className="px-2.5 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm font-semibold text-[#2D1810] focus:outline-none focus:border-[#D97706] cursor-pointer"
                >
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* AM / PM Toggle Pills */}
                <div className="flex rounded-xl border border-[#EAE1D2] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAmpm('AM')}
                    className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      ampm === 'AM'
                        ? 'bg-[#FACC15] text-[#2D1810]'
                        : 'bg-white text-[#786C60] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmpm('PM')}
                    className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      ampm === 'PM'
                        ? 'bg-[#FACC15] text-[#2D1810]'
                        : 'bg-white text-[#786C60] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Done Button (Image 3) */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleTimeDone}
                  className="px-5 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#2D1810] font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  {language === 'mr' ? 'पूर्ण' : 'Done'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Birth Location with Autocomplete (Image 4 reference) */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#4A2E18] flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{language === 'mr' ? 'जन्म स्थान *' : 'Birth place *'}</span>
          </label>
          <button
            type="button"
            onClick={() => setManualOverride(!manualOverride)}
            className="text-[11px] text-[#D97706] hover:underline flex items-center space-x-1 cursor-pointer font-semibold"
          >
            <Sliders className="w-3 h-3" />
            <span>{manualOverride ? t('form.hideCoordinates') : t('form.manualCoordinates')}</span>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={placeQuery}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => handleLocationInputChange(e.target.value)}
            placeholder={language === 'mr' ? 'शहराचे नाव टाइप करा' : 'Start typing a city'}
            className={`w-full px-4 py-2.5 pr-10 bg-[#FAF7F2] border ${
              errors.placeOfBirth ? 'border-red-500' : 'border-[#EAE1D2]'
            } rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white placeholder-gray-400 transition-colors`}
          />
          <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
            {isSearchingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#D97706]" />
            ) : (
              <MapPin className="w-4 h-4 text-[#D97706]" />
            )}
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#EAE1D2] rounded-xl max-h-56 overflow-y-auto z-40 shadow-xl divide-y divide-[#F3ECE1]">
            <div className="px-3 py-1.5 text-[10px] text-[#D97706] uppercase tracking-wider font-semibold bg-[#FAF7F2]">
              {language === 'mr' ? 'अचूक जन्मस्थान निवडा' : 'Select Accurate Geocoded Location'}
            </div>
            {searchResults.map((loc, idx) => (
              <button
                type="button"
                key={`${loc.displayName}-${idx}`}
                onClick={() => handleSelectLocation(loc)}
                className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#FFF9EB] flex justify-between items-center transition-colors group cursor-pointer"
              >
                <div className="pr-2">
                  <div className="font-semibold text-[#2D1810] group-hover:text-[#D97706]">{loc.displayName}</div>
                  <div className="text-[10px] text-gray-500">
                    {t('form.timezoneLabel')}: UTC {loc.timezoneOffset >= 0 ? `+${loc.timezoneOffset}` : loc.timezoneOffset}h
                  </div>
                </div>
                <div className="text-right text-[10px] text-[#D97706] font-mono shrink-0">
                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Coordinates Status Pill */}
        <div className="mt-2 p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-wrap items-center justify-between text-[11px] text-[#92400E]">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>
              {t('form.coordinatesLabel')}: <strong className="text-[#2D1810]">{latitude >= 0 ? `${latitude.toFixed(4)}° N` : `${Math.abs(latitude).toFixed(4)}° S`}</strong>,{' '}
              <strong className="text-[#2D1810]">{longitude >= 0 ? `${longitude.toFixed(4)}° E` : `${Math.abs(longitude).toFixed(4)}° W`}</strong>
            </span>
          </div>
          <span className="text-[#B45309] font-bold">
            UTC {timezoneOffset >= 0 ? `+${timezoneOffset}` : timezoneOffset}h
          </span>
        </div>
        {errors.placeOfBirth && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.placeOfBirth}</span></p>}
      </div>

      {/* Manual Coordinates & Timezone Accordion */}
      {manualOverride && (
        <div className="p-4 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#B45309]">
            <Sliders className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{t('form.manualCoordinatesTitle')}</span>
          </div>
          <p className="text-[11px] text-[#785D46]">
            {t('form.manualCoordinatesDesc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-[#4A2E18] font-semibold mb-1">{t('form.latitude')}</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE1D2] rounded-lg text-xs text-[#2D1810] focus:outline-none focus:border-[#D97706]"
              />
              {errors.latitude && <p className="text-red-500 text-[10px] mt-0.5">{errors.latitude}</p>}
            </div>
            <div>
              <label className="block text-[11px] text-[#4A2E18] font-semibold mb-1">{t('form.longitude')}</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE1D2] rounded-lg text-xs text-[#2D1810] focus:outline-none focus:border-[#D97706]"
              />
              {errors.longitude && <p className="text-red-500 text-[10px] mt-0.5">{errors.longitude}</p>}
            </div>
            <div>
              <label className="block text-[11px] text-[#4A2E18] font-semibold mb-1">{t('form.timezoneOffset')}</label>
              <input
                type="number"
                step="0.25"
                value={timezoneOffset}
                onChange={(e) => setTimezoneOffset(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAE1D2] rounded-lg text-xs text-[#2D1810] focus:outline-none focus:border-[#D97706]"
              />
              {errors.timezoneOffset && <p className="text-red-500 text-[10px] mt-0.5">{errors.timezoneOffset}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Ayanamsa */}
      <div>
        <label className="block text-xs font-semibold text-[#4A2E18] mb-1.5 flex items-center space-x-1.5">
          <Compass className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{t('form.ayanamsa')}</span>
        </label>
        <select
          value={ayanamsa}
          onChange={(e) => setAyanamsa(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white"
        >
          <option value="Lahiri">{t('form.ayanamsaLahiri')}</option>
          <option value="Raman">{t('form.ayanamsaRaman')}</option>
          <option value="Krishnamurti">{t('form.ayanamsaKP')}</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#2D1810] font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2D1810]" />
            <span>{t('form.calculating')}</span>
          </span>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{buttonText || t('form.submit')}</span>
          </>
        )}
      </button>
    </form>
  );
}
