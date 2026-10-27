'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CITIES } from '@/lib/cities';
import { PanchangData } from '@/lib/types';
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
} from 'lucide-react';

export default function PanchangPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('06:30');
  const [selectedCityName, setSelectedCityName] = useState('New Delhi');
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err?.message || 'Failed to calculate astronomical Panchang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanchang();
  }, [date, time, selectedCityName]);

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure Astronomical Ephemeris</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-[#F7DF94] via-[#D4AF37] to-[#E5C058] bg-clip-text text-transparent">
            Vedic Panchang (Five Sacred Limbs)
          </h1>
          <p className="text-[#D8C7A5]/80 text-xs sm:text-sm leading-relaxed">
            Computed strictly with the Chitrapaksha / Lahiri Sidereal ephemeris for exact coordinates and time. Never fabricated or generalized.
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-[#191233]/90 border border-[#D4AF37]/30 rounded-2xl p-6 shadow-cosmic">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Calculation Time</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </label>
              <select
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
                className="w-full bg-[#0F0B1E] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#191233]">
                    {c.name} ({c.stateCountry})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center text-[#D4AF37] flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-sm">Calculating celestial ephemeris...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-xs text-red-200">
            {error}
          </div>
        )}

        {panchang && !loading && (
          <div className="space-y-8 animate-fadeIn">
            {/* The 5 Limbs (Panchang) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Tithi */}
              <div className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    1. Tithi (Lunar Day)
                  </span>
                  <Moon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F7DF94]">
                    {panchang.tithi.name}
                  </h3>
                  <p className="text-xs text-[#D8C7A5]/80">
                    {panchang.tithi.paksha} Paksha (Day {panchang.tithi.number})
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/10 text-[11px] text-[#D8C7A5]/70 space-y-1">
                  <div>Deity: <strong className="text-[#FDFBF7]">{panchang.tithi.deity}</strong></div>
                  <div>Progress: <strong className="text-[#FDFBF7]">{panchang.tithi.progressPercent}%</strong></div>
                </div>
              </div>

              {/* 2. Vaara */}
              <div className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    2. Vaara (Solar Day)
                  </span>
                  <Sun className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F7DF94]">
                    {panchang.vaara.sanskrit}
                  </h3>
                  <p className="text-xs text-[#D8C7A5]/80">
                    {panchang.vaara.name}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/10 text-[11px] text-[#D8C7A5]/70 space-y-1">
                  <div>Ruling Graha: <strong className="text-[#FDFBF7]">{panchang.vaara.ruler}</strong></div>
                </div>
              </div>

              {/* 3. Nakshatra */}
              <div className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    3. Nakshatra
                  </span>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F7DF94]">
                    {panchang.nakshatra.name}
                  </h3>
                  <p className="text-xs text-[#D8C7A5]/80">
                    Pada {panchang.nakshatra.pada}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/10 text-[11px] text-[#D8C7A5]/70 space-y-1">
                  <div>Lord: <strong className="text-[#FDFBF7]">{panchang.nakshatra.lord}</strong></div>
                  <div>Progress: <strong className="text-[#FDFBF7]">{panchang.nakshatra.progressPercent}%</strong></div>
                </div>
              </div>

              {/* 4. Yoga */}
              <div className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    4. Yoga (Angular Sum)
                  </span>
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F7DF94]">
                    {panchang.yoga.name}
                  </h3>
                  <p className="text-xs text-[#D8C7A5]/80">
                    Yoga #{panchang.yoga.index} of 27
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/10 text-[11px] text-[#D8C7A5]/70">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      panchang.yoga.isAuspicious
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {panchang.yoga.isAuspicious ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>{panchang.yoga.isAuspicious ? 'Auspicious' : 'Caution Advised'}</span>
                  </span>
                </div>
              </div>

              {/* 5. Karana */}
              <div className="bg-[#191233]/80 border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    5. Karana (Half Tithi)
                  </span>
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F7DF94]">
                    {panchang.karana.name}
                  </h3>
                  <p className="text-xs text-[#D8C7A5]/80">
                    {panchang.karana.type} Karana
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/10 text-[11px] text-[#D8C7A5]/70">
                  <span>Nature: {panchang.karana.name.includes('Vishti') ? 'Inauspicious (Bhadra)' : 'Standard Karmic Flow'}</span>
                </div>
              </div>
            </div>

            {/* Auspicious & Inauspicious Timings */}
            <div className="bg-[#150D2A] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-6">
              <h3 className="font-serif text-lg font-bold text-[#FDFBF7] flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Auspicious & Inauspicious Muhurat Windows</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sunrise & Sunset */}
                <div className="bg-[#191233]/80 border border-[#D4AF37]/20 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                    Solar Transitions
                  </span>
                  <div className="text-sm font-bold text-[#FDFBF7]">
                    Sunrise: {panchang.timings.sunrise}
                  </div>
                  <div className="text-xs text-[#D8C7A5]/80">
                    Sunset: {panchang.timings.sunset}
                  </div>
                </div>

                {/* Abhijit Muhurat */}
                <div className="bg-[#191233]/80 border border-emerald-500/30 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Abhijit Muhurat (Auspicious)</span>
                  </span>
                  <div className="text-sm font-bold text-emerald-300">
                    {panchang.timings.abhijitMuhurat}
                  </div>
                  <div className="text-[11px] text-[#D8C7A5]/70">
                    Optimal for new beginnings & contracts
                  </div>
                </div>

                {/* Rahu Kalam */}
                <div className="bg-[#191233]/80 border border-rose-500/30 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-rose-400 font-semibold uppercase tracking-wider flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Rahu Kalam (Avoid Starts)</span>
                  </span>
                  <div className="text-sm font-bold text-rose-300">
                    {panchang.timings.rahuKalam}
                  </div>
                  <div className="text-[11px] text-[#D8C7A5]/70">
                    Do not inaugurate major ventures
                  </div>
                </div>

                {/* Yamaganda & Gulika */}
                <div className="bg-[#191233]/80 border border-amber-500/30 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                    Secondary Inauspicious
                  </span>
                  <div className="text-xs font-semibold text-[#FDFBF7]">
                    Yamaganda: {panchang.timings.yamaganda}
                  </div>
                  <div className="text-xs text-[#D8C7A5]/80">
                    Gulika Kalam: {panchang.timings.gulikaKalam}
                  </div>
                </div>
              </div>
            </div>

            {/* Astronomical Meta */}
            <div className="bg-[#0F0B1E] border border-[#D4AF37]/20 rounded-xl p-4 flex flex-wrap items-center justify-between text-xs text-[#D8C7A5]/70 gap-3">
              <div>Ayanamsa: <strong className="text-[#D4AF37]">{panchang.ayanamsa.name} ({panchang.ayanamsa.formatted})</strong></div>
              <div>Sidereal Sun Longitude: <strong className="text-[#FDFBF7]">{panchang.sunLongitude}°</strong></div>
              <div>Sidereal Moon Longitude: <strong className="text-[#FDFBF7]">{panchang.moonLongitude}°</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
