'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Astrologer, AstrologyService } from '@/lib/types';
import PaymentModal from '@/components/PaymentModal';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  UserCheck,
  Star,
  Globe,
  Award,
  Video,
  FileText,
  Loader2,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function BookingContent() {
  const { t, language, formatNumber, formatCurrency } = useLanguage();
  const searchParams = useSearchParams();
  const astrologerIdParam = searchParams.get('astrologerId');

  // Directory and service state
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [services, setServices] = useState<AstrologyService[]>([]);
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);

  // Status & loading states
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(true);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [astrologerNotFoundId, setAstrologerNotFoundId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM');
  const [topic, setTopic] = useState<string>('Detailed Kundli & Life Forecast');
  const [notes, setNotes] = useState<string>('');

  // Payment & confirmation state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // 1. Load active astrologers & available services from Strapi 5 backend
  useEffect(() => {
    async function loadData() {
      setIsLoadingDirectory(true);
      setDirectoryError(null);
      setAstrologerNotFoundId(null);

      try {
        // Fetch verified astrologers; decouple services so services failure never blocks astrologers
        const [astroList, serviceList] = await Promise.all([
          api.getAstrologers(),
          api.getServices().catch(() => []),
        ]);

        setAstrologers(astroList);
        setServices(serviceList);

        if (astroList.length === 0) {
          setDirectoryError(
            language === 'mr'
              ? 'सध्या कोणतेही ज्योतिषी उपलब्ध नाहीत. कृपया नंतर पुन्हा प्रयत्न करा.'
              : 'No verified astrologers are currently available in the directory. Please check back shortly.'
          );
          setIsLoadingDirectory(false);
          return;
        }

        // Match requested astrologerIdParam
        if (astrologerIdParam) {
          const matched = astroList.find(
            (a) =>
              String(a.id) === astrologerIdParam ||
              (a as any).documentId === astrologerIdParam ||
              (a as any).slug === astrologerIdParam
          );

          if (matched) {
            setSelectedAstrologer(matched);
            setAstrologerNotFoundId(null);
          } else {
            // Attempt direct fetch by id or documentId before reporting not found
            try {
              const directAstro = await api.getAstrologerById(astrologerIdParam);
              if (directAstro) {
                setSelectedAstrologer(directAstro);
                setAstrologerNotFoundId(null);
                setAstrologers((prev) => [directAstro, ...prev.filter((x) => x.id !== directAstro.id)]);
                return;
              }
            } catch (err) {
              console.warn('Direct astrologer lookup notice:', err);
            }

            // Do NOT silently replace with another astrologer; report invalid ID
            setAstrologerNotFoundId(astrologerIdParam);
            setSelectedAstrologer(null);
          }
        } else {
          // Default to first verified astrologer if no param provided
          setSelectedAstrologer(astroList[0]);
        }
      } catch (err: any) {
        console.error('Failed to load astrologers/services:', err);
        setDirectoryError(
          err.message ||
            (language === 'mr'
              ? 'ज्योतिषी सूची लोड करताना त्रुटी आली. कृपया इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.'
              : 'Failed to connect to the astrology directory backend. Please verify your connection and refresh.')
        );
      } finally {
        setIsLoadingDirectory(false);
      }
    }

    loadData();
  }, [astrologerIdParam, language]);

  // Standard time slots if astrologer doesn't have custom ones
  const standardTimeSlots = [
    '10:00 AM - 10:30 AM',
    '11:00 AM - 11:30 AM',
    '02:00 PM - 02:30 PM',
    '04:00 PM - 04:30 PM',
    '05:30 PM - 06:00 PM',
    '07:00 PM - 07:30 PM',
  ];

  const availableSlots =
    selectedAstrologer?.availableSlots && selectedAstrologer.availableSlots.length > 0
      ? selectedAstrologer.availableSlots
      : standardTimeSlots;

  // 2. Validate and initiate booking
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedAstrologer) {
      setFormError(
        language === 'mr' ? 'कृपया सल्लामसलतीसाठी ज्योतिषी निवडा.' : 'Please select an astrologer to continue.'
      );
      return;
    }

    // Validate date: cannot be in the past
    if (!date || date < todayStr) {
      setFormError(
        language === 'mr'
          ? 'कृपया आजची किंवा भविष्यातील वैध तारीख निवडा.'
          : 'Please select a valid consultation date (today or in the future).'
      );
      return;
    }

    if (!timeSlot || timeSlot.trim().length === 0) {
      setFormError(
        language === 'mr' ? 'कृपया वेळेचा स्लॉट निवडा.' : 'Please choose a valid consultation time slot.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Create initial pending booking on the backend
      const res = await api.createBooking({
        astrologerId: selectedAstrologer.id,
        date,
        timeSlot,
        topic,
        clientNotes: notes,
      });

      setPendingBooking(res);
      setShowPaymentModal(true);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setFormError(
        err.message ||
          (language === 'mr'
            ? 'अपॉइंटमेंट स्लॉट बुक करताना त्रुटी आली. कृपया दुसरा स्लॉट निवडा.'
            : 'Failed to reserve appointment slot. The slot may already be reserved or an API error occurred.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Payment verification completion handler
  const handlePaymentSuccess = (paymentRecord: any) => {
    setShowPaymentModal(false);
    setConfirmedBooking({
      id: pendingBooking?.id || paymentRecord?.referenceId || 'BK-VERIFIED',
      bookingNumber: pendingBooking?.bookingNumber || `BK-${Date.now().toString(36).toUpperCase()}`,
      astrologer: selectedAstrologer,
      date,
      timeSlot,
      topic,
      fee: selectedAstrologer?.consultationFee || 999,
      durationMinutes: 30,
      meetingLink: pendingBooking?.meetingLink || 'https://meet.google.com/vedic-session',
      payment: paymentRecord,
    });
  };

  // Loading directory spinner
  if (isLoadingDirectory) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-[#D97706] animate-spin mb-4" />
        <h2 className="font-serif text-lg font-bold text-[#2D1810]">
          {language === 'mr' ? 'ज्योतिषी आणि सेवा तपशील लोड होत आहेत...' : 'Loading Astrologer & Service Details...'}
        </h2>
        <p className="text-xs text-[#786C60] mt-1 max-w-sm">
          {language === 'mr'
            ? 'स्ट्रॅपी ५ बॅकएंडवरून सत्यापित ज्योतिषी डेटा आणत आहे.'
            : 'Fetching verified Vedic astrology records from the Strapi 5 backend.'}
        </p>
      </div>
    );
  }

  // Directory load error
  if (directoryError) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16 px-4 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2D1810]">
          {language === 'mr' ? 'डेटा लोड अयशस्वी' : 'Failed to Load Booking Portal'}
        </h2>
        <p className="text-xs sm:text-sm text-red-700 bg-red-50 p-4 rounded-2xl border border-red-200">
          {directoryError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-[#D97706] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#B45309]"
        >
          {language === 'mr' ? 'पुन्हा प्रयत्न करा' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t('booking.badge') || '1-on-1 Confidential Vedic Session'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {t('booking.title') || 'Book an Astrologer Consultation'}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {t('booking.subtitle') ||
              'Connect live with India’s leading Vedic scholars. Schedule your private appointment with instant order confirmation.'}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Invalid Astrologer ID Alert Banner */}
        {astrologerNotFoundId && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-900 space-y-3">
            <div className="flex items-center space-x-2.5 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                {language === 'mr'
                  ? `ज्योतिषी आयडी "${astrologerNotFoundId}" आमच्या नोंदणीकृत सूचीमध्ये आढळला नाही.`
                  : `Astrologer ID "${astrologerNotFoundId}" was not found in our directory.`}
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {language === 'mr'
                ? 'कृपया खालील आमच्या सक्रिय आणि सत्यापित ज्योतिषांमधून निवडा:'
                : 'Please select one of our verified astrologers currently registered in the database below:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              {astrologers.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setSelectedAstrologer(a);
                    setAstrologerNotFoundId(null);
                  }}
                  className="px-3 py-2 bg-white border border-amber-300 hover:border-amber-600 rounded-xl text-left text-xs font-semibold text-amber-950 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between"
                >
                  <span className="truncate">{a.name}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono shrink-0 ml-1">
                    ID: {a.id}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed Booking View */}
        {confirmedBooking ? (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-[#FDE68A] shadow-md text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
                Booking Reference: {confirmedBooking.bookingNumber}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1810] pt-2">
                {language === 'mr' ? 'सल्लामसलत सत्र निश्चित झाले!' : 'Consultation Confirmed & Paid!'}
              </h2>
              <p className="text-xs sm:text-sm text-[#786C60] max-w-md mx-auto">
                {language === 'mr'
                  ? `आपले १-ऑन-१ खाजगी सत्र ${confirmedBooking.astrologer?.name} यांच्यासोबत निश्चित झाले आहे.`
                  : `Your confidential 1-on-1 session with ${confirmedBooking.astrologer?.name} is confirmed.`}
              </p>
            </div>

            {/* Session Card */}
            <div className="p-5 bg-[#FFFDF9] rounded-2xl border border-[#EAE1D2] text-xs text-[#4A2E18] text-left space-y-2.5">
              <div className="flex justify-between border-b border-[#F5EFE6] pb-2">
                <span className="text-[#786C60]">{language === 'mr' ? 'तारीख व वेळ:' : 'Date & Time:'}</span>
                <span className="font-bold text-[#2D1810]">
                  {confirmedBooking.date} at {confirmedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#F5EFE6] pb-2">
                <span className="text-[#786C60]">{language === 'mr' ? 'कालावधी:' : 'Duration:'}</span>
                <span className="font-bold text-[#2D1810]">30 Minutes Video / Audio Call</span>
              </div>
              <div className="flex justify-between border-b border-[#F5EFE6] pb-2">
                <span className="text-[#786C60]">{language === 'mr' ? 'विषय:' : 'Topic:'}</span>
                <span className="font-bold text-[#2D1810]">{confirmedBooking.topic}</span>
              </div>
              <div className="flex justify-between border-b border-[#F5EFE6] pb-2">
                <span className="text-[#786C60]">{language === 'mr' ? 'सशुल्क रक्कम:' : 'Amount Paid:'}</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {formatCurrency(confirmedBooking.fee)} (Verified)
                </span>
              </div>
              {confirmedBooking.payment?.paymentId && (
                <div className="flex justify-between text-[11px] text-[#786C60]">
                  <span>Razorpay Payment ID:</span>
                  <span className="font-mono">{confirmedBooking.payment.paymentId}</span>
                </div>
              )}
              {confirmedBooking.meetingLink && (
                <div className="pt-2">
                  <span className="block text-[#786C60] mb-1">{language === 'mr' ? 'सत्र लिंक:' : 'Meeting Link:'}</span>
                  <a
                    href={confirmedBooking.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline font-mono break-all"
                  >
                    {confirmedBooking.meetingLink}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard/bookings"
                className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95"
              >
                {language === 'mr' ? 'माझे बुकिंग्ज पहा' : 'View In My Bookings'}
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-[#FAF7F2] border border-[#EAE1D2] text-xs font-bold text-[#4A2E18] rounded-xl hover:bg-[#FFFDF9]"
              >
                {language === 'mr' ? 'मुख्यपृष्ठावर परत जा' : 'Return Home'}
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-[#EAE1D2] shadow-sm space-y-8"
          >
            {/* Step 1: Astrologer Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider">
                  {language === 'mr' ? '१. वैदिक ज्योतिषी निवडा' : '1. Select Your Vedic Astrologer'}
                </label>
                <span className="text-[11px] text-[#786C60]">
                  {astrologers.length} {language === 'mr' ? 'सत्यापित ज्योतिषी उपलब्ध' : 'verified scholars available'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                {astrologers.map((astro) => {
                  const isSelected = selectedAstrologer?.id === astro.id;
                  return (
                    <div
                      key={astro.id}
                      onClick={() => {
                        setSelectedAstrologer(astro);
                        setAstrologerNotFoundId(null);
                        setFormError(null);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFFBEB] border-2 border-[#F59E0B] shadow-xs ring-1 ring-[#F59E0B]/20'
                          : 'bg-[#FAF7F2] border-[#EAE1D2] hover:border-[#F59E0B]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={
                            astro.avatarUrl ||
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={astro.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500 ring-offset-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold text-[#2D1810] truncate">{astro.name}</h4>
                          <span className="text-[10px] text-amber-600 font-bold flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                            <span>{formatNumber(astro.rating)} ({astro.reviewCount || 0})</span>
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-[#EAE1D2]/60 pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-[#786C60] font-medium">{astro.experienceYears} yrs exp</span>
                        <span className="text-[#D97706] font-bold font-mono">
                          {formatCurrency(astro.consultationFee)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Astrologer Full Details Card */}
            {selectedAstrologer && (
              <div className="bg-[#FFFDF9] border border-[#EAE1D2] rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F5EFE6] pb-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={
                        selectedAstrologer.avatarUrl ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={selectedAstrologer.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#D97706] ring-offset-2 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-serif text-base font-bold text-[#2D1810]">
                          {selectedAstrologer.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ID: {selectedAstrologer.id}
                        </span>
                      </div>
                      <p className="text-xs text-[#D97706] font-medium">{selectedAstrologer.title}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-[#786C60] mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{selectedAstrologer.experienceYears} Years Experience</span>
                        </span>
                        {selectedAstrologer.languages && selectedAstrologer.languages.length > 0 && (
                          <span className="flex items-center space-x-1">
                            <Globe className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>{selectedAstrologer.languages.join(', ')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end bg-[#FAF7F2] sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#786C60]">Consultation Fee (30 Min)</span>
                    <span className="font-serif text-xl font-extrabold text-[#B45309]">
                      {formatCurrency(selectedAstrologer.consultationFee)}
                    </span>
                  </div>
                </div>

                {selectedAstrologer.bio && (
                  <p className="text-xs text-[#6B5A4E] leading-relaxed italic">
                    "{selectedAstrologer.bio}"
                  </p>
                )}

                {selectedAstrologer.specialties && selectedAstrologer.specialties.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[#4A2E18] mr-1">
                      {language === 'mr' ? 'विशेषज्ञता:' : 'Specialties:'}
                    </span>
                    {selectedAstrologer.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Date & Slot Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? '२. सल्लामसलतीची तारीख:' : '2. Consultation Date:'}</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setFormError(null);
                  }}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                  required
                />
                <span className="text-[10px] text-[#786C60] mt-1 block">
                  {language === 'mr' ? 'आज किंवा पुढील कोणतीही तारीख निवडा' : 'Choose today or any upcoming date'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? '३. वेळेचा स्लॉट निवडा:' : '3. Appointment Slot (30 mins):'}</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => {
                    setTimeSlot(e.target.value);
                    setFormError(null);
                  }}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                >
                  {availableSlots.map((slot, sIdx) => (
                    <option key={sIdx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#786C60] mt-1 block">
                  Indian Standard Time (IST / UTC+5:30)
                </span>
              </div>
            </div>

            {/* Step 3: Topic & Guidance Service */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{language === 'mr' ? '४. सल्लामसलत विषय किंवा सेवा:' : '4. Consultation Focus / Topic:'}</span>
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                >
                  {services && services.length > 0 ? (
                    services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title} {s.category ? `(${s.category.toUpperCase()})` : ''}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Detailed Kundli & Life Forecast">Detailed Kundli & Life Forecast</option>
                      <option value="Career, Job Promotion & Business Transit">Career, Job Promotion & Business Transit</option>
                      <option value="Marriage Compatibility & Vivaha Yog">Marriage Compatibility & Vivaha Yog</option>
                      <option value="Wealth, Finance & Investment Timing">Wealth, Finance & Investment Timing</option>
                      <option value="Health, Longevity & Planetary Remedies">Health, Longevity & Planetary Remedies</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2E18] mb-2">
                  {language === 'mr' ? '५. विशिष्ट प्रश्न किंवा जन्म तपशील (ऐच्छिक):' : '5. Specific Inquiries or Notes (Optional):'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'mr'
                      ? 'उदा. मला माझ्या नवीन नोकरीच्या बदलाच्या वेळेबद्दल आणि रत्न शांतीबद्दल विचारायचे आहे.'
                      : 'e.g., Inquiring about dasha transit for overseas relocation, job transition timing, or specific gemstone guidance.'
                  }
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Price Summary & Submit CTA */}
            <div className="pt-4 border-t border-[#F5EFE6] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] text-[#786C60] block font-bold uppercase tracking-wider">
                  {language === 'mr' ? 'एकूण देय रक्कम (३० मिनिटे सत्र)' : 'Total Payable (30-Min Session)'}
                </span>
                <span className="font-serif text-2xl font-extrabold text-[#2D1810]">
                  {formatCurrency(selectedAstrologer ? selectedAstrologer.consultationFee : 999)}
                </span>
                <span className="text-[10px] text-emerald-700 block font-medium">
                  ✓ Verified Server-Side Rate • 100% Secure Checkout
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedAstrologer}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'mr' ? 'ऑर्डर तयार करत आहे...' : 'Reserving Appointment...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {language === 'mr'
                        ? 'सत्र बुक करा आणि पेमेंटकडे जा'
                        : `Proceed to Pay ${formatCurrency(selectedAstrologer?.consultationFee || 999)}`}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Razorpay Test / Live Payment Modal */}
      {selectedAstrologer && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          serviceTitle={`Consultation with ${selectedAstrologer.name}`}
          amount={selectedAstrologer.consultationFee}
          serviceType="consultation"
          referenceId={pendingBooking ? String(pendingBooking.id) : String(selectedAstrologer.id)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center text-xs text-[#786C60]">
          Loading booking portal...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
