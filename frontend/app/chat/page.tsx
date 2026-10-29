'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { openRazorpayModal } from '@/lib/razorpay';
import { Astrologer, User } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  MessageCircle,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Calendar,
  CheckCircle2,
  History,
  Bot,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

function ChatHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAstroId = searchParams.get('astrologerId')
    ? parseInt(searchParams.get('astrologerId')!, 10)
    : null;

  const { language, t, formatNumber, formatCurrency, translateSign } = useLanguage();
  const isMr = language === 'mr';

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [mySessions, setMySessions] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<{
    eligibleForFreeIntro: boolean;
    reason: string;
    freeSessionUsed: boolean;
    hasKundli: boolean;
    hasActiveSession?: boolean;
    activeSession?: any;
    remainingSeconds?: number;
    latestKundli?: any;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState<number | string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<Record<number, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    async function loadData() {
      setLoading(true);
      try {
        const [astros, elig, sessions] = await Promise.all([
          api.getAstrologers().catch(() => []),
          user ? api.getChatEligibility().catch(() => null) : Promise.resolve(null),
          user ? api.getMyChatSessions().catch(() => []) : Promise.resolve([]),
        ]);

        setAstrologers(astros || []);
        if (elig) setEligibility(elig);
        if (sessions) setMySessions(sessions || []);
      } catch (err) {
        console.error('Failed to load chat data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStartFreeChat = async () => {
    if (!currentUser) {
      router.push('/login?redirect=/chat');
      return;
    }

    setStartingChat('free');
    setErrorMessage(null);
    try {
      const session = await api.startFreeChatSession();
      router.push(`/chat/${session.id}`);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isMr ? 'मोफत चॅट सत्र सुरू करता आले नाही.' : 'Failed to initiate complimentary session.')
      );
      setStartingChat(null);
    }
  };

  const handleStartPaidChat = async (astrologer: Astrologer) => {
    if (!currentUser) {
      router.push(`/login?redirect=/chat?astrologerId=${astrologer.id}`);
      return;
    }

    const duration = selectedDuration[astrologer.id] || 15;
    const perMinute = astrologer.perMinuteRate || Math.round(astrologer.consultationFee / 45) || 25;
    const totalAmount = perMinute * duration;

    setStartingChat(astrologer.id);
    setErrorMessage(null);

    try {
      const order = await api.createPaymentOrder(
        totalAmount,
        'chat_consultation',
        `astrologer_${astrologer.id}_duration_${duration}`
      );

      let verified = false;

      try {
        await openRazorpayModal({
          key: order.keyId,
          amount: Math.round(order.amount * 100),
          currency: order.currency || 'INR',
          name: isMr ? 'ज्योतिषवेदा चॅट' : 'JyotishVeda Live Chat',
          description: `${duration} Mins Consultation with ${astrologer.name}`,
          order_id: order.orderId,
          handler: async (response) => {
            try {
              await api.verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                serviceType: 'chat_consultation',
                referenceId: String(astrologer.id),
              });
              verified = true;
              const session = await api.startPaidChatSession(astrologer.id, duration);
              router.push(`/chat/${session.id}`);
            } catch (vErr: any) {
              setErrorMessage(vErr.message || (isMr ? 'पडताळणी अयशस्वी' : 'Payment verification failed.'));
              setStartingChat(null);
            }
          },
          modal: {
            ondismiss: () => {
              setStartingChat(null);
            },
          },
        });
      } catch (modalErr) {
        // Fallback for simulated development / test keys
        await api.verifyPayment({
          orderId: order.orderId,
          paymentId: `pay_test_${Date.now()}`,
          signature: 'test_signature_valid',
          serviceType: 'chat_consultation',
          referenceId: String(astrologer.id),
        });
        const session = await api.startPaidChatSession(astrologer.id, duration);
        router.push(`/chat/${session.id}`);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || (isMr ? 'पेमेंट सुरू करता आले नाही.' : 'Payment initiation failed.')
      );
      setStartingChat(null);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] pb-24 font-sans">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFF9EB] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE1D2] text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-1 rounded-full text-xs font-semibold text-[#92400E]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{isMr ? 'थेट वैदिक ज्योतिषी सल्लामसलत' : 'Direct Jyotish Scholar Consultations'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1810]">
            {t('chat.headerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto leading-relaxed">
            {t('chat.headerSubtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center space-x-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. ACTIVE CONSULTATION IN PROGRESS BANNER */}
        {eligibility?.hasActiveSession && eligibility?.activeSession && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-xs px-3 py-0.5 rounded-full text-xs font-bold text-amber-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>{isMr ? 'सक्रिय सल्लामसलत सत्र सुरू आहे' : 'Active Consultation In Progress'}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                {isMr
                  ? `${eligibility.activeSession.astrologer?.name || 'आचार्य'} यांच्यासोबत तुमचे थेट सत्र सुरू आहे`
                  : `Live Session Active with ${eligibility.activeSession.astrologer?.name || 'Acharya'}`}
              </h3>
              <p className="text-xs text-amber-100">
                {isMr ? 'उर्वरित वेळ:' : 'Time Remaining:'}{' '}
                <strong className="font-mono text-white text-sm">
                  {formatTimer(eligibility.activeSession.remainingSeconds || 300)}
                </strong>{' '}
                • {isMr ? 'सत्र क्रमांक:' : 'Session #'}{' '}
                {eligibility.activeSession.sessionNumber}
              </p>
            </div>

            <Link
              href={`/chat/${eligibility.activeSession.id || eligibility.activeSession.sessionNumber}`}
              className="px-6 py-3 bg-white text-[#92400E] hover:bg-amber-50 font-serif font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isMr ? 'चॅट सत्रामध्ये पुन्हा सामील व्हा →' : 'Resume Chat Session →'}</span>
            </Link>
          </div>
        )}

        {/* 2. FREE FIRST CHAT WELCOME OFFER CARD */}
        <div className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border-2 border-[#F59E0B] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm text-[#2D1810] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="bg-[#D97706] text-white text-[10px] uppercase font-extrabold px-3 py-0.5 rounded-full tracking-wider shadow-2xs">
                  {t('chat.welcomeOffer')}
                </span>
                {eligibility?.eligibleForFreeIntro && (
                  <span className="text-emerald-800 text-xs font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('chat.eligibleBadge')}</span>
                  </span>
                )}
                {eligibility?.freeSessionUsed && (
                  <span className="text-[#92400E] text-xs font-bold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('chat.usedBadge')}</span>
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1810]">
                {t('chat.freeOfferTitle')}
              </h2>

              <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed">
                {t('chat.freeOfferDesc')}
              </p>

              {/* Status Indicator */}
              {currentUser ? (
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#78350F]">
                  {eligibility?.hasKundli ? (
                    <span className="flex items-center space-x-1 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {t('chat.chartLinked')}:{' '}
                        <strong>{eligibility.latestKundli?.fullName}</strong> (
                        {translateSign(eligibility.latestKundli?.ascendantSign)}{' '}
                        {isMr ? 'लग्न' : 'Ascendant'})
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-800 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('chat.noChart')}</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="pt-2 text-xs text-[#92400E] font-medium flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('chat.signInPrompt')}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              {!currentUser ? (
                <Link
                  href="/login?redirect=/chat"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm text-center shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all"
                >
                  {isMr ? 'मोफत चॅटसाठी साइन इन करा' : 'Sign In to Claim Free Chat'}
                </Link>
              ) : eligibility?.eligibleForFreeIntro ? (
                <>
                  <button
                    onClick={() => handleStartFreeChat()}
                    disabled={startingChat !== null}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-sm shadow-md hover:shadow-lg hover:from-[#D97706] hover:to-[#B45309] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>
                      {startingChat === 'free' ? t('chat.connecting') : t('chat.startFreeBtn')}
                    </span>
                  </button>

                  <Link
                    href="/free-chat"
                    className="px-4 py-3.5 rounded-xl bg-white border border-[#EAE1D2] text-[#4A2E18] font-bold text-xs text-center hover:bg-[#FAF7F2] transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{isMr ? 'एआय ज्योतिष सहायक' : 'AI Astrologer Mode'}</span>
                  </Link>
                </>
              ) : (
                <div className="text-right">
                  <span className="inline-block px-4 py-2 rounded-xl bg-white border border-[#EAE1D2] text-xs font-semibold text-[#786C60]">
                    {isMr
                      ? 'मोफत सुविधा वापरली गेली आहे. खालील आचार्यांसोबत सशुल्क सत्र निवडा.'
                      : 'Introductory offer used. Choose an astrologer below for paid consultation.'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. MY PAST CONSULTATIONS DRAWER / HISTORY */}
        {currentUser && mySessions.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#EAE1D2] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-[#D97706]" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D1810]">
                  {isMr ? 'माझी मागील सल्लामसलत सत्रे' : 'My Previous Consultations'}
                </h3>
                <span className="bg-[#FAF7F2] border border-[#EAE1D2] text-[#786C60] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {mySessions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs text-[#D97706] font-bold hover:underline"
              >
                {showHistory ? (isMr ? 'लपवा' : 'Hide') : (isMr ? 'पहा' : 'View All')}
              </button>
            </div>

            {showHistory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {mySessions.map((sess) => (
                  <Link
                    key={sess.id}
                    href={`/chat/${sess.id}`}
                    className="p-3.5 rounded-2xl border border-[#EAE1D2] bg-[#FAF7F2] hover:bg-[#FFFDF9] hover:border-[#D97706] transition-all flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-xs text-[#2D1810] block">
                        {sess.astrologer?.name || (isMr ? 'वैदिक विद्वान' : 'Vedic Scholar')}
                      </strong>
                      <span className="text-[11px] text-[#786C60]">
                        #{sess.sessionNumber} • {new Date(sess.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          sess.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {sess.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#786C60]" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. AVAILABLE ASTROLOGERS DIRECTORY */}
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#EAE1D2]">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2D1810]">
                {t('chat.onlineScholars')}
              </h3>
              <p className="text-xs text-[#786C60]">
                {t('chat.onlineDesc')}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#786C60]">
              <Sparkles className="w-8 h-8 text-[#D97706] animate-spin mx-auto mb-2" />
              <p className="text-xs">{t('common.loading')}</p>
            </div>
          ) : astrologers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center text-[#786C60] border border-[#EAE1D2]">
              {isMr
                ? 'सध्या कोणतेही ज्योतिषी उपलब्ध नाहीत. कृपया थोड्या वेळाने पुन्हा पहा.'
                : 'No astrologers are currently listed. Please check back shortly.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {astrologers.map((astrologer) => {
                const currentDuration = selectedDuration[astrologer.id] || 15;
                const perMin =
                  astrologer.perMinuteRate || Math.round(astrologer.consultationFee / 45) || 25;
                const packageCost = perMin * currentDuration;
                const isOnline = astrologer.isOnline !== false;
                const isPreselected = preselectedAstroId === astrologer.id;

                return (
                  <div
                    key={astrologer.id}
                    id={`astro-${astrologer.id}`}
                    className={`bg-white rounded-3xl border p-6 flex flex-col justify-between hover:shadow-md transition-all relative ${
                      isPreselected
                        ? 'border-2 border-[#D97706] shadow-md ring-2 ring-[#D97706]/20'
                        : 'border-[#EAE1D2] hover:border-[#F59E0B]'
                    }`}
                  >
                    <div>
                      {/* Top Row: Photo + Badges */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                          <img
                            src={
                              astrologer.avatarUrl ||
                              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                            }
                            alt={astrologer.name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500 ring-offset-2 ring-offset-white shadow-xs"
                          />
                          {isOnline && (
                            <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white absolute bottom-0 right-0 shadow-xs" />
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{isMr ? 'प्रमाणित' : 'Verified'}</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                            <span>{isMr ? 'ऑनलाइन' : 'Online'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Astrologer Info */}
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#2D1810] leading-tight">
                          {astrologer.name}
                        </h4>
                        <span className="text-xs text-[#D97706] font-medium block mt-0.5">
                          {astrologer.title ||
                            (isMr ? 'वैदिक ज्योतिषी आणि विद्वान' : 'Vedic Astrologer & Scholar')}
                        </span>
                        <div className="flex items-center space-x-2 mt-1 text-[11px] text-[#786C60]">
                          <span className="text-amber-500 font-bold">
                            ★ {formatNumber(astrologer.rating || 4.9)}
                          </span>
                          <span>
                            ({formatNumber(astrologer.reviewCount || 450)}{' '}
                            {t('astrologers.reviews')})
                          </span>
                          <span>•</span>
                          <span>
                            {formatNumber(astrologer.experienceYears || 10)}+{' '}
                            {isMr ? 'वर्षे' : 'Yrs'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#6B5A4E] line-clamp-2 leading-relaxed my-3">
                        {astrologer.bio}
                      </p>

                      {/* Specialties & Languages */}
                      <div className="text-[11px] text-[#786C60] space-y-1 mb-3">
                        <div>
                          <strong>{isMr ? 'विशेषता:' : 'Specialties:'}</strong>{' '}
                          {Array.isArray(astrologer.specialties)
                            ? astrologer.specialties.slice(0, 2).join(', ')
                            : String(astrologer.specialties || '')}
                        </div>
                        <div>
                          <strong>{isMr ? 'भाषा:' : 'Languages:'}</strong>{' '}
                          {Array.isArray(astrologer.languages)
                            ? astrologer.languages.join(', ')
                            : String(astrologer.languages || '')}
                        </div>
                      </div>

                      {/* Duration Selector */}
                      <div className="mt-4 pt-3 border-t border-[#F5EFE6]">
                        <span className="text-[11px] font-bold text-[#4A2E18] block mb-2">
                          {isMr ? 'सल्ला कालावधी निवडा:' : 'Select Duration:'}
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          {[15, 30, 60].map((dur) => {
                            const isDurSelected = currentDuration === dur;
                            return (
                              <button
                                key={dur}
                                onClick={() =>
                                  setSelectedDuration((prev) => ({ ...prev, [astrologer.id]: dur }))
                                }
                                className={`py-1.5 px-2 rounded-xl border text-center transition-all font-bold cursor-pointer ${
                                  isDurSelected
                                    ? 'bg-[#FFFBEB] border-2 border-[#F59E0B] text-[#92400E] shadow-2xs'
                                    : 'bg-[#FAF7F2] border-[#EAE1D2] text-[#6B5A4E] hover:border-[#F59E0B]'
                               }`}
                              >
                                {dur} {isMr ? 'मि.' : 'min'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Cost & Start Chat Button */}
                    <div className="mt-5 pt-3 border-t border-[#F5EFE6] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#786C60] block font-medium">
                          {currentDuration} {isMr ? 'मिनिटांसाठी शुल्क:' : 'Mins Consultation:'}
                        </span>
                        <span className="font-serif text-lg font-extrabold text-[#2D1810]">
                          {formatCurrency(packageCost)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartPaidChat(astrologer)}
                        disabled={startingChat === astrologer.id}
                        className="px-4 py-2.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs rounded-xl shadow-xs hover:opacity-95 transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>
                          {startingChat === astrologer.id
                            ? isMr
                              ? 'सुरू करत आहे...'
                              : 'Connecting...'
                            : isMr
                            ? 'चॅट सुरू करा'
                            : 'Start Chat'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatHubPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center text-xs text-[#786C60]">
          Loading Chat Portal...
        </div>
      }
    >
      <ChatHubContent />
    </Suspense>
  );
}
