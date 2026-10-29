'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { KundliChartData } from '@/lib/types';
import BirthDetailsForm, { BirthFormData } from '@/components/BirthDetailsForm';
import NorthIndianChart from '@/components/NorthIndianChart';
import SouthIndianChart from '@/components/SouthIndianChart';
import { useLanguage } from '@/context/LanguageContext';
import { MARATHI_BHAVAS, toDevanagariNumerals } from '@/lib/translations/astrology-terms';
import {
  Sparkles,
  Printer,
  Compass,
  Table,
  Layers,
  Clock,
  BookmarkPlus,
  MessageSquare,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function KundliPage() {
  const { language, t, translatePlanet, translateSign, translateDignityText, formatNumber } = useLanguage();
  const [chartData, setChartData] = useState<KundliChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [vargaTab, setVargaTab] = useState<'d1' | 'd9' | 'both'>('d1');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Load a sample or user's latest calculation on initial view
  useEffect(() => {
    async function initKundli() {
      setLoading(true);
      try {
        const latest = await api.getLatestKundli();
        if (latest && latest.chartData) {
          setChartData(latest.chartData);
          setLoading(false);
          return;
        }

        const sample = await api.generateKundli({
          fullName: 'Aryavarta Sharma',
          dateOfBirth: '1995-08-15',
          timeOfBirth: '10:30',
          placeOfBirth: 'New Delhi, India',
          latitude: 28.6139,
          longitude: 77.2090,
          timezoneOffset: 5.5,
          ayanamsa: 'Lahiri',
        });
        setChartData(sample.chartData);
      } catch (e) {
        console.warn('Initial calculation notice:', e);
      } finally {
        setLoading(false);
      }
    }
    initKundli();
  }, []);

  const handleGenerate = async (formData: BirthFormData) => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const res = await api.generateKundli(formData);
      setChartData(res.chartData);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Error generating Kundli');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!chartData) return;
    setSavingProfile(true);
    try {
      await api.saveBirthProfile({
        name: chartData.meta.fullName,
        dateOfBirth: chartData.meta.dateOfBirth,
        timeOfBirth: chartData.meta.timeOfBirth,
        placeOfBirth: chartData.meta.placeOfBirth,
        latitude: chartData.meta.latitude,
        longitude: chartData.meta.longitude,
        timezoneOffset: chartData.meta.timezoneOffsetHours,
        ayanamsa: chartData.meta.ayanamsa.name,
        chartData,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (e: any) {
      if (e.message?.includes('401') || e.message?.includes('auth') || e.message?.includes('unauthorized')) {
        alert(language === 'mr' ? 'जन्मकुंडली जतन करण्यासाठी कृपया साइन इन करा.' : 'Please sign in to save this birth profile to your account.');
      } else {
        alert(language === 'mr' ? 'स्थानिकरीत्या जतन केले गेले. साइन इन केल्यास सर्व उपकरणांवर दिसेल.' : 'Saved locally. Sign in to sync across devices.');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans print:bg-white print:p-0">
      {/* Header (Hidden in Print) */}
      <section className="print:hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{language === 'mr' ? 'चित्रापक्षीय लाहिरी अयनांश सायन-निरायण ग्रहगणित' : 'Chitrapaksha Lahiri Ayanamsa Sidereal Engine'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {t('kundli.headerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {t('kundli.headerSubtitle')}
          </p>
        </div>
      </section>

      {/* Print-Only Title Banner */}
      <div className="hidden print:block text-center py-6 border-b-2 border-[#D97706] mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#2D1810]">{t('kundli.printTitle')}</h1>
        <p className="text-xs text-[#786C60]">{t('kundli.printSubtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10 print:mt-0 print:space-y-6">
        {/* Form and Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Birth Details Input Form (Hidden on Print) */}
          <div className="lg:col-span-5 print:hidden">
            <BirthDetailsForm
              onSubmit={handleGenerate}
              isLoading={loading}
              buttonText={t('form.submit')}
              showGender={true}
            />
          </div>

          {/* Quick Summary Card */}
          <div className="lg:col-span-7 print:col-span-12">
            {chartData ? (
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
                <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[#F5EFE6] gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#92400E] tracking-wider bg-[#FFFBEB] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
                      {t('kundli.record')}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#2D1810] mt-1">
                      {chartData.meta.fullName}
                    </h2>
                    <p className="text-xs text-[#786C60] mt-1">
                      {chartData.meta.dateOfBirth} {language === 'mr' ? 'वेळ' : 'at'} {chartData.meta.timeOfBirth} • {chartData.meta.placeOfBirth}
                    </p>
                    <p className="text-[11px] text-[#786C60]/80 font-mono mt-0.5">
                      Lat: {chartData.meta.latitude.toFixed(4)}° | Lon: {chartData.meta.longitude.toFixed(4)}° | UTC {chartData.meta.timezoneOffsetHours >= 0 ? `+${chartData.meta.timezoneOffsetHours}` : chartData.meta.timezoneOffsetHours}h
                    </p>
                  </div>

                  {/* Actions (Hidden in Print) */}
                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-[#FFFBEB] border border-[#FDE68A] text-xs font-bold text-[#92400E] rounded-xl hover:bg-[#FEF3C7] transition-colors cursor-pointer shadow-xs"
                    >
                      {savedSuccess ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{t('kundli.saved')}</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>{t('kundli.saveProfile')}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handlePrint}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#EAE1D2] text-xs font-bold text-[#4A2E18] rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t('kundli.printPdf')}</span>
                    </button>

                    <Link
                      href="/chat"
                      className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 transition-opacity"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('kundli.askAstrologer')}</span>
                    </Link>
                  </div>
                </div>

                {/* 4 Core Vedic Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                  <div className="p-2.5 sm:p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] text-center shadow-2xs">
                    <span className="text-[10px] text-[#786C60] uppercase block font-semibold">{t('kundli.lagna')}</span>
                    <strong className="font-serif text-base text-[#2D1810] block mt-1">
                      {translateSign(chartData.ascendant.signName)}
                    </strong>
                    <span className="text-[10px] text-[#D97706] font-bold block">{chartData.ascendant.degreeFormatted}</span>
                    <span className="text-[9px] text-[#786C60]/70 block mt-0.5">
                      {chartData.ascendant.nakshatra} ({t('kundli.pada')} {formatNumber(chartData.ascendant.pada)})
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] text-center shadow-2xs">
                    <span className="text-[10px] text-[#786C60] uppercase block font-semibold">{t('kundli.rashi')}</span>
                    <strong className="font-serif text-base text-[#2D1810] block mt-1">
                      {translateSign(chartData.moonSign.signName)}
                    </strong>
                    <span className="text-[10px] text-[#D97706] font-bold block">{chartData.moonSign.signSanskrit}</span>
                    <span className="text-[9px] text-[#786C60]/70 block mt-0.5">{chartData.moonSign.degreeFormatted}</span>
                  </div>

                  <div className="p-2.5 sm:p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] text-center shadow-2xs">
                    <span className="text-[10px] text-[#786C60] uppercase block font-semibold">{t('kundli.nakshatra')}</span>
                    <strong className="font-serif text-base text-[#2D1810] block mt-1">
                      {chartData.moonSign.nakshatra}
                    </strong>
                    <span className="text-[10px] text-[#D97706] font-bold block">{t('kundli.pada')} {formatNumber(chartData.moonSign.pada)}</span>
                    <span className="text-[9px] text-[#786C60]/70 block mt-0.5">{t('kundli.lord')}: {translatePlanet(chartData.moonSign.nakshatraLord)}</span>
                  </div>

                  <div className="p-2.5 sm:p-3.5 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] text-center shadow-2xs">
                    <span className="text-[10px] text-[#786C60] uppercase block font-semibold">{t('kundli.sunSign')}</span>
                    <strong className="font-serif text-base text-[#2D1810] block mt-1">
                      {translateSign(chartData.sunSign.signName)}
                    </strong>
                    <span className="text-[10px] text-[#D97706] font-bold block">{chartData.sunSign.degreeFormatted}</span>
                    <span className="text-[9px] text-[#786C60]/70 block mt-0.5">{chartData.sunSign.nakshatra} ({t('kundli.pada')} {formatNumber(chartData.sunSign.pada)})</span>
                  </div>
                </div>

                {/* Calculation Details Banner */}
                <div className="text-xs text-[#78350F] bg-[#FFFBEB] p-3.5 rounded-xl border border-[#FDE68A] flex flex-wrap items-center justify-between gap-2">
                  <span><strong>{t('kundli.ayanamsa')}:</strong> {chartData.meta.ayanamsa.name} ({chartData.meta.ayanamsa.formatted})</span>
                  <span><strong>{t('kundli.julianDate')}:</strong> {chartData.meta.julianDate.toFixed(4)}</span>
                  <span><strong>{t('kundli.balanceDasha')}:</strong> {translatePlanet(chartData.dasha.balanceDashaPlanet)} (~{formatNumber(chartData.dasha.balanceYears)} {t('common.years')})</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-[#EAE1D2] text-center text-[#786C60]">
                {language === 'mr' ? 'आपली जन्मकुंडली तयार करण्यासाठी डाव्या बाजूला माहिती भरा.' : 'Enter your details on the left to calculate your sacred Vedic birth chart.'}
              </div>
            )}
          </div>
        </div>

        {/* Visual Charts: D-1 Lagna & D-9 Navamsha Tabs */}
        {chartData && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center pb-3 border-b border-[#EAE1D2] gap-3">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2D1810]">
                  {t('kundli.chartViews')}
                </h3>
                <p className="text-xs text-[#786C60]">
                  {t('kundli.chartViewsDesc')}
                </p>
              </div>

              {/* Chart Switchers (Hidden on print) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 print:hidden">
                {/* Varga Selector */}
                <div className="flex bg-[#FAF7F2] p-1 rounded-xl text-xs border border-[#EAE1D2]">
                  <button
                    onClick={() => setVargaTab('d1')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      vargaTab === 'd1' ? 'bg-[#F59E0B] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
                    }`}
                  >
                    {t('kundli.tabD1')}
                  </button>
                  <button
                    onClick={() => setVargaTab('d9')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      vargaTab === 'd9' ? 'bg-[#F59E0B] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
                    }`}
                  >
                    {t('kundli.tabD9')}
                  </button>
                  <button
                    onClick={() => setVargaTab('both')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      vargaTab === 'both' ? 'bg-[#F59E0B] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
                    }`}
                  >
                    {t('kundli.tabBoth')}
                  </button>
                </div>

                {/* North / South Style */}
                <div className="flex bg-[#FAF7F2] p-1 rounded-xl text-xs border border-[#EAE1D2]">
                  <button
                    onClick={() => setChartStyle('north')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      chartStyle === 'north' ? 'bg-[#D97706] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
                    }`}
                  >
                    {t('kundli.styleNorth')}
                  </button>
                  <button
                    onClick={() => setChartStyle('south')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      chartStyle === 'south' ? 'bg-[#D97706] text-white shadow-xs' : 'text-[#786C60] hover:text-[#2D1810]'
                    }`}
                  >
                    {t('kundli.styleSouth')}
                  </button>
                </div>
              </div>
            </div>

            {/* Render Selected Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* D-1 Lagna Chart */}
              {(vargaTab === 'd1' || vargaTab === 'both') && (
                <div className="flex justify-center">
                  {chartStyle === 'north' ? (
                    <NorthIndianChart
                      chartData={chartData}
                      houses={chartData.houses}
                      title={language === 'mr' ? 'लग्न कुंडली (डी-१ राशी जन्मकुंडली)' : 'Lagna Chart (D-1 Rashi Kundli)'}
                    />
                  ) : (
                    <SouthIndianChart chartData={chartData} />
                  )}
                </div>
              )}

              {/* D-9 Navamsha Chart */}
              {(vargaTab === 'd9' || vargaTab === 'both') && (
                <div className="flex justify-center">
                  {chartStyle === 'north' ? (
                    <NorthIndianChart
                      chartData={chartData}
                      houses={chartData.navamsaHouses || chartData.houses}
                      title={language === 'mr' ? 'नवमांश कुंडली (डी-९ धर्म व विवाह)' : 'Navamsha Chart (D-9 Dharma / Vivaha)'}
                    />
                  ) : (
                    <SouthIndianChart chartData={chartData} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed Planetary Positions & Dignities Table */}
        {chartData && (
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4 print:border-none print:p-0">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#F5EFE6] gap-2">
              <div className="flex items-center space-x-2 text-[#2D1810]">
                <Table className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-serif text-xl font-bold">{t('kundli.planetsTableTitle')}</h3>
              </div>
              <span className="text-[11px] text-[#786C60]">
                <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold mr-1">(R)</span> = {t('kundli.retrogradeBadge')}
              </span>
            </div>

            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#EAE1D2] bg-[#FAF7F2] text-[#4A2E18] font-bold">
                    <th className="py-3 px-3">{t('kundli.graha')}</th>
                    <th className="py-3 px-3">{t('kundli.motion')}</th>
                    <th className="py-3 px-3">{t('kundli.dignity')}</th>
                    <th className="py-3 px-3">{t('kundli.sign')}</th>
                    <th className="py-3 px-3">{t('kundli.degree')}</th>
                    <th className="py-3 px-3">{t('kundli.bhava')}</th>
                    <th className="py-3 px-3">{t('kundli.nakshatra')}</th>
                    <th className="py-3 px-3">{t('kundli.pada')}</th>
                    <th className="py-3 px-3">{t('kundli.navamshaSign')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6] text-[#2D1810]">
                  {chartData.planets.map((planet) => (
                    <tr key={planet.name} className="hover:bg-[#FFFDF9] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#2D1810]">
                        {translatePlanet(planet.name)}
                      </td>
                      <td className="py-2.5 px-3">
                        {planet.isRetrograde ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {language === 'mr' ? 'वक्री (R)' : 'Retrograde (R)'}
                          </span>
                        ) : (
                          <span className="text-[#786C60] text-[11px]">{t('kundli.direct')}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {planet.dignity === 'Exalted' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            {translateDignityText('Exalted')}
                          </span>
                        ) : planet.dignity === 'Debilitated' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                            {translateDignityText('Debilitated')}
                          </span>
                        ) : planet.dignity === 'Own Sign' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            {translateDignityText('Own Sign')}
                          </span>
                        ) : (
                          <span className="text-[#786C60] text-[11px]">{translateDignityText(planet.dignity || 'Neutral')}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-semibold">
                        {translateSign(planet.signName)}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#B45309]">
                        {planet.degreeFormatted}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#D97706]">
                        {language === 'mr' ? `भाव ${formatNumber(planet.houseNumber)}` : `H${planet.houseNumber}`}
                      </td>
                      <td className="py-2.5 px-3 text-[#4A2E18]">
                        {planet.nakshatraName} <span className="text-[#786C60] text-[10px]">({translatePlanet(planet.nakshatraLord)})</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold">
                        {formatNumber(planet.nakshatraPada)}
                      </td>
                      <td className="py-2.5 px-3 text-[#2D1810] font-medium">
                        {planet.navamshaSignName ? translateSign(planet.navamshaSignName) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 12 Bhavas (Houses) Breakdown */}
        {chartData && (
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4 print:border-none print:p-0">
            <div className="flex items-center space-x-2 text-[#2D1810]">
              <Layers className="w-5 h-5 text-[#D97706]" />
              <h3 className="font-serif text-xl font-bold">{t('kundli.bhavasTitle')}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.houses.map((house) => {
                const marathiInfo = MARATHI_BHAVAS[house.houseNumber];
                return (
                  <div key={house.houseNumber} className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] text-xs shadow-2xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#D97706]">
                        {language === 'mr' ? marathiInfo?.name || `भाव ${formatNumber(house.houseNumber)}` : `Bhava ${house.houseNumber}`}
                      </span>
                      <span className="text-[#786C60] font-semibold">{translateSign(house.signName)}</span>
                    </div>
                    {language === 'mr' && marathiInfo && (
                      <p className="text-[10px] text-[#786C60] mb-1">{marathiInfo.title}</p>
                    )}
                    <div className="text-[#6B5A4E]">
                      {t('kundli.bhavaLord')}: <strong className="text-[#2D1810]">{translatePlanet(house.ruler)}</strong>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#F5EFE6]">
                      <span className="text-[#786C60]">{t('kundli.occupants')}: </span>
                      <span className="font-bold text-[#2D1810]">
                        {house.occupants.length > 0
                          ? house.occupants.map((o) => translatePlanet(o)).join(', ')
                          : t('kundli.noneOccupants')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vimshottari Mahadasha Timeline */}
        {chartData && (
          <div className="bg-white text-[#2D1810] p-4 sm:p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-4 print:border-none print:p-0">
            <div className="flex items-center space-x-2 text-[#D97706]">
              <Clock className="w-5 h-5" />
              <h3 className="font-serif text-xl font-bold text-[#2D1810]">
                {t('kundli.dashaTitle')}
              </h3>
            </div>
            <p className="text-xs text-[#786C60]">
              {t('kundli.dashaDesc', {
                planet: translatePlanet(chartData.dasha.balanceDashaPlanet),
                years: formatNumber(chartData.dasha.balanceYears),
              })}
            </p>

            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#EAE1D2] bg-[#FAF7F2] text-[#4A2E18] font-bold">
                    <th className="py-2.5 px-4">{t('kundli.dashaLord')}</th>
                    <th className="py-2.5 px-4">{t('kundli.duration')}</th>
                    <th className="py-2.5 px-4">{t('kundli.startDate')}</th>
                    <th className="py-2.5 px-4">{t('kundli.endDate')}</th>
                    <th className="py-2.5 px-4">{t('kundli.periodType')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6] text-[#2D1810]">
                  {chartData.dasha.timeline.map((d, idx) => (
                    <tr key={idx} className="hover:bg-[#FFFDF9]">
                      <td className="py-2.5 px-4 font-bold text-[#2D1810]">
                        {translatePlanet(d.planet)}
                      </td>
                      <td className="py-2.5 px-4 font-medium">{formatNumber(d.durationYears)} {t('common.years')}</td>
                      <td className="py-2.5 px-4 font-mono text-[#786C60]">{d.startDate}</td>
                      <td className="py-2.5 px-4 font-mono text-[#786C60]">{d.endDate}</td>
                      <td className="py-2.5 px-4">
                        {d.isBalance ? (
                          <span className="text-[10px] text-amber-800 bg-[#FFFBEB] px-2.5 py-0.5 rounded-full border border-[#FDE68A] font-bold">
                            {t('kundli.birthBalance')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#786C60]">
                            {t('kundli.fullPeriod')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Next Step CTA Banner (Hidden in print) */}
        {chartData && (
          <div className="print:hidden bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-100">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs uppercase font-bold tracking-wider">{t('kundli.freeChatCta')}</span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-extrabold text-white">
                {t('kundli.freeChatQuestion')}
              </h4>
              <p className="text-xs text-amber-100 max-w-lg leading-relaxed">
                {t('kundli.freeChatDesc')}
              </p>
            </div>
            <Link
              href="/chat"
              className="px-6 py-3.5 bg-white text-[#92400E] font-serif font-bold text-sm rounded-xl shadow-md hover:bg-amber-50 transition-all shrink-0 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>{t('kundli.freeChatBtn')}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
