'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { POPULAR_CITIES, CityLocation } from '@/lib/cities';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Calendar, Clock, User, Compass, Sparkles, Sliders, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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

export default function BirthDetailsForm({
  onSubmit,
  isLoading = false,
  buttonText,
  showGender = false,
  initialData,
}: BirthDetailsFormProps) {
  const { language, t } = useLanguage();
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '1995-08-15');
  
  // Time state: supports both 24-hour internal format and 12-hour AM/PM UI
  const [timeMode, setTimeMode] = useState<'24h' | '12h'>('24h');
  const [timeOfBirth, setTimeOfBirth] = useState(initialData?.timeOfBirth || '10:30');
  const [hours12, setHours12] = useState('10');
  const [minutes12, setMinutes12] = useState('30');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  // Location state
  const [placeQuery, setPlaceQuery] = useState(initialData?.placeOfBirth || 'New Delhi, India');
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

  const [gender, setGender] = useState(initialData?.gender || 'Prefer not to say');
  const [ayanamsa, setAyanamsa] = useState(initialData?.ayanamsa || 'Lahiri');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // Update timeOfBirth when 12h controls change
  const handle12hChange = (hVal: string, mVal: string, periodVal: 'AM' | 'PM') => {
    let h = parseInt(hVal, 10) || 12;
    if (periodVal === 'PM' && h < 12) h += 12;
    if (periodVal === 'AM' && h === 12) h = 0;
    const hh = h.toString().padStart(2, '0');
    const mm = (parseInt(mVal, 10) || 0).toString().padStart(2, '0');
    setTimeOfBirth(`${hh}:${mm}`);
  };

  // Debounced live geocoding lookup
  const handleLocationInputChange = (text: string) => {
    setPlaceQuery(text);
    setShowDropdown(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await api.searchLocation(text);
        if (results && results.length > 0) {
          setSearchResults(results);
        } else {
          // Fallback to local POPULAR_CITIES matching
          const localFiltered = POPULAR_CITIES.filter((c) =>
            c.name.toLowerCase().includes(text.toLowerCase()) ||
            c.stateCountry.toLowerCase().includes(text.toLowerCase())
          ).map((c) => ({
            name: c.name,
            stateCountry: c.stateCountry,
            displayName: `${c.name}, ${c.stateCountry}`,
            latitude: c.latitude,
            longitude: c.longitude,
            timezoneOffset: c.timezoneOffset,
          }));
          setSearchResults(localFiltered);
        }
      } catch (err) {
        // Fallback to local
        const localFiltered = POPULAR_CITIES.filter((c) =>
          c.name.toLowerCase().includes(text.toLowerCase())
        ).map((c) => ({
          name: c.name,
          stateCountry: c.stateCountry,
          displayName: `${c.name}, ${c.stateCountry}`,
          latitude: c.latitude,
          longitude: c.longitude,
          timezoneOffset: c.timezoneOffset,
        }));
        setSearchResults(localFiltered);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);
  };

  const handleSelectLocation = (loc: {
    displayName: string;
    latitude: number;
    longitude: number;
    timezoneOffset: number;
  }) => {
    setPlaceQuery(loc.displayName);
    setLatitude(parseFloat(loc.latitude.toFixed(4)));
    setLongitude(parseFloat(loc.longitude.toFixed(4)));
    setTimezoneOffset(parseFloat(loc.timezoneOffset.toFixed(2)));
    setShowDropdown(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = t('form.errFullName');
    if (!dateOfBirth) newErrors.dateOfBirth = t('form.errDob');
    if (!timeOfBirth) newErrors.timeOfBirth = t('form.errTob');
    if (!placeQuery.trim()) newErrors.placeOfBirth = t('form.errPlace');

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      newErrors.latitude = t('form.errLat');
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      newErrors.longitude = t('form.errLon');
    }
    if (isNaN(timezoneOffset) || timezoneOffset < -12 || timezoneOffset > 14) {
      newErrors.timezoneOffset = t('form.errTz');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      fullName: fullName.trim(),
      dateOfBirth,
      timeOfBirth,
      placeOfBirth: placeQuery.trim(),
      latitude,
      longitude,
      timezoneOffset,
      gender: showGender ? gender : undefined,
      ayanamsa,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#150D2A] border border-[#D4AF37]/30 p-6 md:p-8 rounded-2xl shadow-cosmic space-y-6 text-[#FDFBF7]">
      <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif text-lg font-bold text-[#F7DF94]">{t('form.title')}</h3>
        </div>
        <span className="text-[11px] text-[#D8C7A5]/70 bg-[#0F0B1E] px-2.5 py-1 rounded-full border border-[#D4AF37]/20">
          {t('form.badge')}
        </span>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-[#D8C7A5] mb-1.5 flex items-center space-x-1.5">
          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
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
          className={`w-full px-4 py-2.5 bg-[#0F0B1E] border ${
            errors.fullName ? 'border-red-500' : 'border-[#D4AF37]/30'
          } rounded-lg text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] placeholder-[#D8C7A5]/40 transition-colors`}
        />
        {errors.fullName && <p className="text-red-400 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.fullName}</span></p>}
      </div>

      {/* Date & Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold text-[#D8C7A5] mb-1.5 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('form.dob')}</span>
          </label>
          <input
            type="date"
            value={dateOfBirth}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
            }}
            className={`w-full px-4 py-2.5 bg-[#0F0B1E] border ${
              errors.dateOfBirth ? 'border-red-500' : 'border-[#D4AF37]/30'
            } rounded-lg text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors`}
          />
          {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.dateOfBirth}</span></p>}
        </div>

        {/* Time of Birth with 12h/24h toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#D8C7A5] flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t('form.tob')}</span>
            </label>
            <div className="flex items-center space-x-1 text-[10px] bg-[#0F0B1E] p-0.5 rounded border border-[#D4AF37]/20">
              <button
                type="button"
                onClick={() => setTimeMode('12h')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  timeMode === '12h' ? 'bg-[#D4AF37] text-[#0F0B1E] font-bold' : 'text-[#D8C7A5]/60 hover:text-[#D8C7A5]'
                }`}
              >
                {t('form.time12h')}
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('24h')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  timeMode === '24h' ? 'bg-[#D4AF37] text-[#0F0B1E] font-bold' : 'text-[#D8C7A5]/60 hover:text-[#D8C7A5]'
                }`}
              >
                {t('form.time24h')}
              </button>
            </div>
          </div>

          {timeMode === '24h' ? (
            <input
              type="time"
              value={timeOfBirth}
              onChange={(e) => {
                setTimeOfBirth(e.target.value);
                if (errors.timeOfBirth) setErrors({ ...errors, timeOfBirth: '' });
              }}
              className={`w-full px-4 py-2.5 bg-[#0F0B1E] border ${
                errors.timeOfBirth ? 'border-red-500' : 'border-[#D4AF37]/30'
              } rounded-lg text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors`}
            />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <select
                value={hours12}
                onChange={(e) => {
                  setHours12(e.target.value);
                  handle12hChange(e.target.value, minutes12, ampm);
                }}
                className="px-2 py-2.5 bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              >
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((h) => (
                  <option key={h} value={h}>{h} {t('form.hour')}</option>
                ))}
              </select>
              <select
                value={minutes12}
                onChange={(e) => {
                  setMinutes12(e.target.value);
                  handle12hChange(hours12, e.target.value, ampm);
                }}
                className="px-2 py-2.5 bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-lg text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                  <option key={m} value={m}>{m} {t('form.minute')}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const nextPeriod = ampm === 'AM' ? 'PM' : 'AM';
                  setAmpm(nextPeriod);
                  handle12hChange(hours12, minutes12, nextPeriod);
                }}
                className={`py-2.5 rounded-lg border font-bold text-xs uppercase transition-all cursor-pointer ${
                  ampm === 'AM'
                    ? 'bg-[#1F163D] border-[#D4AF37] text-[#F7DF94]'
                    : 'bg-[#2D1645] border-[#E87A5D] text-[#FFA88B]'
                }`}
              >
                {ampm}
              </button>
            </div>
          )}
          {errors.timeOfBirth && <p className="text-red-400 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.timeOfBirth}</span></p>}
        </div>
      </div>

      {/* Birth Location with Autocomplete */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#D8C7A5] flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('form.birthPlace')}</span>
          </label>
          <button
            type="button"
            onClick={() => setManualOverride(!manualOverride)}
            className="text-[11px] text-[#D4AF37] hover:underline flex items-center space-x-1 cursor-pointer"
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
            placeholder={t('form.searchPlacePlaceholder')}
            className={`w-full px-4 py-2.5 pr-10 bg-[#0F0B1E] border ${
              errors.placeOfBirth ? 'border-red-500' : 'border-[#D4AF37]/30'
            } rounded-lg text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] placeholder-[#D8C7A5]/40 transition-colors`}
          />
          <div className="absolute right-3 top-3 text-[#D8C7A5]/60 pointer-events-none">
            {isSearchingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
            ) : (
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
            )}
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#191233] border border-[#D4AF37]/50 rounded-xl max-h-56 overflow-y-auto z-40 shadow-2xl backdrop-blur-md">
            <div className="px-3 py-1.5 text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-[#D4AF37]/10 bg-[#120B24]">
              {language === 'mr' ? 'अचूक जन्मस्थान निवडा' : 'Select Accurate Geocoded Location'}
            </div>
            {searchResults.map((loc, idx) => (
              <button
                type="button"
                key={`${loc.displayName}-${idx}`}
                onClick={() => handleSelectLocation(loc)}
                className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#281A4D] border-b border-[#D4AF37]/10 flex justify-between items-center transition-colors group cursor-pointer"
              >
                <div className="pr-2">
                  <div className="font-medium text-[#FDFBF7] group-hover:text-[#F7DF94]">{loc.displayName}</div>
                  <div className="text-[10px] text-[#D8C7A5]/60">
                    {t('form.timezoneLabel')}: UTC {loc.timezoneOffset >= 0 ? `+${loc.timezoneOffset}` : loc.timezoneOffset}h
                  </div>
                </div>
                <div className="text-right text-[10px] text-[#D4AF37] font-mono shrink-0">
                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Coordinates Status Pill */}
        <div className="mt-2 p-2.5 rounded-lg bg-[#0F0B1E]/80 border border-[#D4AF37]/20 flex flex-wrap items-center justify-between text-[11px] text-[#D8C7A5]">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {t('form.coordinatesLabel')}: <strong className="text-[#FDFBF7]">{latitude >= 0 ? `${latitude.toFixed(4)}° N` : `${Math.abs(latitude).toFixed(4)}° S`}</strong>,{' '}
              <strong className="text-[#FDFBF7]">{longitude >= 0 ? `${longitude.toFixed(4)}° E` : `${Math.abs(longitude).toFixed(4)}° W`}</strong>
            </span>
          </div>
          <span className="text-[#D4AF37] font-semibold">
            UTC {timezoneOffset >= 0 ? `+${timezoneOffset}` : timezoneOffset}h
          </span>
        </div>
        {errors.placeOfBirth && <p className="text-red-400 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.placeOfBirth}</span></p>}
      </div>

      {/* Manual Coordinates & Timezone Accordion */}
      {manualOverride && (
        <div className="p-4 bg-[#0F0B1E] border border-[#D4AF37]/40 rounded-xl space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#F7DF94]">
            <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('form.manualCoordinatesTitle')}</span>
          </div>
          <p className="text-[11px] text-[#D8C7A5]/70">
            {t('form.manualCoordinatesDesc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-[#D8C7A5] mb-1">{t('form.latitude')}</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-[#150D2A] border border-[#D4AF37]/30 rounded text-xs text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              />
              {errors.latitude && <p className="text-red-400 text-[10px] mt-0.5">{errors.latitude}</p>}
            </div>
            <div>
              <label className="block text-[11px] text-[#D8C7A5] mb-1">{t('form.longitude')}</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-[#150D2A] border border-[#D4AF37]/30 rounded text-xs text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              />
              {errors.longitude && <p className="text-red-400 text-[10px] mt-0.5">{errors.longitude}</p>}
            </div>
            <div>
              <label className="block text-[11px] text-[#D8C7A5] mb-1">{t('form.timezoneOffset')}</label>
              <input
                type="number"
                step="0.25"
                value={timezoneOffset}
                onChange={(e) => setTimezoneOffset(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-[#150D2A] border border-[#D4AF37]/30 rounded text-xs text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              />
              {errors.timezoneOffset && <p className="text-red-400 text-[10px] mt-0.5">{errors.timezoneOffset}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Ayanamsa & Optional Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-[#D8C7A5] mb-1.5 flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('form.ayanamsa')}</span>
          </label>
          <select
            value={ayanamsa}
            onChange={(e) => setAyanamsa(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="Lahiri">{t('form.ayanamsaLahiri')}</option>
            <option value="Raman">{t('form.ayanamsaRaman')}</option>
            <option value="Krishnamurti">{t('form.ayanamsaKP')}</option>
          </select>
        </div>

        {showGender ? (
          <div>
            <label className="block text-xs font-semibold text-[#D8C7A5] mb-1.5">{t('form.gender')}</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-lg text-xs text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="Male">{t('form.genderMale')}</option>
              <option value="Female">{t('form.genderFemale')}</option>
              <option value="Other">{t('form.genderOther')}</option>
              <option value="Prefer not to say">{t('form.genderPreferNot')}</option>
            </select>
          </div>
        ) : (
          <div className="flex items-end pb-1 text-[11px] text-[#D8C7A5]/70">
            <span>{language === 'mr' ? 'अचूक सायन-निरायण ग्रहस्थिती व डी-९ नवमांश गणना.' : 'Calculates True Sidereal Positions & Navamsha D-9.'}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm tracking-wide shadow-gold hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#0F0B1E]" />
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