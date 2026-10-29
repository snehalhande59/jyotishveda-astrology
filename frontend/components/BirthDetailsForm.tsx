'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    if (errors.placeOfBirth) setErrors({ ...errors, placeOfBirth: '' });

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const q = text.toLowerCase().trim();
        const matches = POPULAR_CITIES.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.stateCountry.toLowerCase().includes(q) ||
            (c.aliases && c.aliases.some((a: string) => a.toLowerCase().includes(q)))
        ).slice(0, 7);

        const mapped = matches.map((m) => ({
          name: m.name,
          stateCountry: m.stateCountry,
          displayName: `${m.name}, ${m.stateCountry}`,
          latitude: m.latitude,
          longitude: m.longitude,
          timezoneOffset: m.timezoneOffset,
        }));

        setSearchResults(mapped);
        setShowDropdown(mapped.length > 0);
      } catch (e) {
        console.warn('Geocoding search failed:', e);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 200);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = t('form.errFullName');
    if (!dateOfBirth) errs.dateOfBirth = t('form.errDob');
    if (!timeOfBirth) errs.timeOfBirth = t('form.errTob');
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
    <form onSubmit={handleSubmit} className="bg-white border border-[#EAE1D2] p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-6 text-[#2D1810]">
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D2]">
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

      {/* Date & Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold text-[#4A2E18] mb-1.5 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{t('form.dob')}</span>
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
            }}
            className={`w-full px-4 py-2.5 bg-[#FAF7F2] border ${
              errors.dateOfBirth ? 'border-red-500' : 'border-[#EAE1D2]'
            } rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.dateOfBirth}</span></p>}
        </div>

        {/* Time of Birth */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#4A2E18] flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('form.tob')}</span>
            </label>
            <div className="flex items-center text-[11px] bg-[#FAF7F2] border border-[#EAE1D2] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setTimeMode('24h')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  timeMode === '24h' ? 'bg-white text-[#D97706] font-bold shadow-xs' : 'text-gray-500'
                }`}
              >
                {t('form.time24h')}
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('12h')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  timeMode === '12h' ? 'bg-white text-[#D97706] font-bold shadow-xs' : 'text-gray-500'
                }`}
              >
                {t('form.time12h')}
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
              className={`w-full px-4 py-2.5 bg-[#FAF7F2] border ${
                errors.timeOfBirth ? 'border-red-500' : 'border-[#EAE1D2]'
              } rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors`}
            />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <select
                value={hours12}
                onChange={(e) => {
                  setHours12(e.target.value);
                  handle12hChange(e.target.value, minutes12, ampm);
                }}
                className="px-2 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white"
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
                className="px-2 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-sm text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white"
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
                className={`py-2.5 rounded-xl border font-bold text-xs uppercase transition-all cursor-pointer ${
                  ampm === 'AM'
                    ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]'
                    : 'bg-[#FFEDD5] border-[#FDBA74] text-[#C2410C]'
                }`}
              >
                {ampm}
              </button>
            </div>
          )}
          {errors.timeOfBirth && <p className="text-red-500 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>{errors.timeOfBirth}</span></p>}
        </div>
      </div>

      {/* Birth Location with Autocomplete */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#4A2E18] flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{t('form.birthPlace')}</span>
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
            placeholder={t('form.searchPlacePlaceholder')}
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

      {/* Ayanamsa & Optional Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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

        {showGender ? (
          <div>
            <label className="block text-xs font-semibold text-[#4A2E18] mb-1.5">{t('form.gender')}</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#D97706] focus:bg-white"
            >
              <option value="Male">{t('form.genderMale')}</option>
              <option value="Female">{t('form.genderFemale')}</option>
              <option value="Other">{t('form.genderOther')}</option>
              <option value="Prefer not to say">{t('form.genderPreferNot')}</option>
            </select>
          </div>
        ) : (
          <div className="flex items-end pb-1 text-[11px] text-gray-500">
            <span>{language === 'mr' ? 'अचूक सायन-निरायण ग्रहस्थिती व डी-९ नवमांश गणना.' : 'Calculates True Sidereal Positions & Navamsha D-9.'}</span>
          </div>
        )}
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
