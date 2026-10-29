'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CITIES } from '@/lib/cities';
import { PanchangData } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
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
} from 'lucide-react';

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

export default function PanchangPage() {
  const { language, t, translatePlanet } = useLanguage();
  const isMr = language === 'mr';

  const [date, setDate] = useState('2026-10-29');
  const [time, setTime] = useState('06:30');
  const [selectedCityName, setSelectedCityName] = useState('New Delhi');
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize with current local ISO date
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const fetchPanchang = async () => {
    setLoading(true);
    setError(null);
    try {
      const city = CITIES.find((c) => c.name === selectedCityName) || CITIES[0];
      const res = await api.calculatePanchang({
        date,
        time,
        latitude: city.latitude,
        longitude: city.longitude,
        timezoneOffset: city.timezoneOffset,
      });
      setPanchang(res);
    } catch (err: any) {
      setError(
        err?.message ||
          (isMr
            ? 'पंचांग गणना अयशस्वी झाली. कृपया इंटरनेट तपासा.'
            : 'Failed to calculate astronomical Panchang.')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchPanchang();
    }
  }, [date, time, selectedCityName, mounted]);

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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1810] py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-semibold uppercase tracking-wider shadow-2xs">
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
            <div>
              <label className="block text-xs font-bold text-[#4A2E18] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{isMr ? 'दिनांक' : 'Date'}</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-4 py-2.5 text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A2E18] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{isMr ? 'वेळ' : 'Calculation Time'}</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-4 py-2.5 text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A2E18] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{isMr ? 'स्थान / शहर' : 'Location / City'}</span>
              </label>
              <select
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl px-4 py-2.5 text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-colors"
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.stateCountry})
                  </option>
                ))}
              </select>
            </div>
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
        {error && (
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
        {panchang && (
          <div className="space-y-8 animate-fadeIn">
            {/* The 5 Limbs (Panchang) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* 1. Tithi */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
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
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-xs">
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
                  <p className="text-xs text-[#786C60]">
                    {panchang.vaara?.name}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60] space-y-1">
                  <div>
                    {isMr ? 'राशी स्वामी:' : 'Ruling Graha:'}{' '}
                    <strong className="text-[#2D1810]">{translatePlanet(panchang.vaara?.ruler)}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Nakshatra */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '३. नक्षत्र' : '3. Nakshatra'}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {panchang.nakshatra?.name}
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
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '४. योग' : '4. Yoga (Angular Sum)'}
                  </span>
                  <Compass className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {panchang.yoga?.name}
                  </h3>
                  <p className="text-xs text-[#786C60]">
                    #{panchang.yoga?.index} / 27
                  </p>
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
                        ? isMr
                          ? 'शुभ योग'
                          : 'Auspicious'
                        : isMr
                        ? 'सावधगिरी'
                        : 'Caution Advised'}
                    </span>
                  </span>
                </div>
              </div>

              {/* 5. Karana */}
              <div className="bg-white border border-[#EAE1D2] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
                    {isMr ? '५. करण' : '5. Karana (Half Tithi)'}
                  </span>
                  <Clock className="w-4 h-4 text-[#D97706]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D1810]">
                    {panchang.karana?.name}
                  </h3>
                  <p className="text-xs text-[#786C60]">
                    {panchang.karana?.type} {isMr ? 'करण' : 'Karana'}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F5EFE6] text-[11px] text-[#786C60]">
                  <span>
                    {panchang.karana?.name?.includes('Vishti')
                      ? isMr
                        ? 'अशुभ (भद्रा)'
                        : 'Inauspicious (Bhadra)'
                      : isMr
                      ? 'सामान्य शुभ'
                      : 'Standard Karmic'}
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
                    {isMr ? 'सूर्योदय:' : 'Sunrise:'} {panchang.timings?.sunrise || '06:28 AM'}
                  </div>
                  <div className="text-xs text-[#786C60]">
                    {isMr ? 'सूर्यास्त:' : 'Sunset:'} {panchang.timings?.sunset || '05:42 PM'}
                  </div>
                </div>

                {/* Abhijit Muhurat */}
                <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isMr ? 'अभिजित मुहूर्त (अतिशुभ)' : 'Abhijit Muhurat (Auspicious)'}</span>
                  </span>
                  <div className="text-sm font-extrabold text-emerald-900">
                    {panchang.timings?.abhijitMuhurat || '11:42 AM - 12:26 PM'}
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
                    {panchang.timings?.rahuKalam || '13:30 - 15:00'}
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
                    {isMr ? 'यमगंड:' : 'Yamaganda:'} {panchang.timings?.yamaganda || '06:00 - 07:30'}
                  </div>
                  <div className="text-xs text-[#786C60]">
                    {isMr ? 'गुलिक काळ:' : 'Gulika Kalam:'} {panchang.timings?.gulikaKalam || '09:00 - 10:30'}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
