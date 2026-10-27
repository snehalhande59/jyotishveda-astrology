'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { openRazorpayModal } from '@/lib/razorpay';
import { Astrologer, User } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  MessageSquare,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Zap,
  Lock,
  ChevronRight,
  UserCheck,
  Calendar,
} from 'lucide-react';

export default function ChatHubPage() {
  const router = useRouter();
  const { language, t, formatNumber, formatCurrency, translateSign } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [eligibility, setEligibility] = useState<{
    eligibleForFreeIntro: boolean;
    reason: string;
    freeSessionUsed: boolean;
    hasKundli: boolean;
    latestKundli?: any;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState<number | string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<Record<number, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    async function loadData() {
      setLoading(true);
      try {
        const astros = await api.getAstrologers();
        setAstrologers(astros);

        if (user) {
          try {
            const elig = await api.getChatEligibility();
            setEligibility(elig);
          } catch (e) {
            console.warn('Chat eligibility check error:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load astrologers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle starting Free 5-minute session
  const handleStartFreeChat = async (astrologerId?: number) => {
    if (!currentUser) {
      router.push('/login?redirect=/chat');
      return;
    }

    if (eligibility && !eligibility.hasKundli) {
      alert(language === 'mr' ? 'कृपया आधी आपली जन्मकुंडली बनवा जेणेकरून आचार्य आपले ग्रहयोग तपासून अचूक मार्गदर्शन करू शकतील.' : 'Please calculate your Vedic Kundli first so our Acharya can analyze your chart during the chat.');
      router.push('/kundli');
      return;
    }

    setStartingChat(astrologerId || 'free');
    setErrorMessage(null);

    try {
      const res = await api.startFreeChatSession(astrologerId);
      if (res.sessionNumber) {
        router.push(`/chat/${res.sessionNumber}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'mr' ? 'मोफत सत्र सुरू करण्यात अडचण आली.' : 'Unable to start free session.'));
      setStartingChat(null);
    }
  };

  // Handle Paid Consultation via Razorpay
  const handleStartPaidConsultation = async (astrologer: Astrologer) => {
    if (!currentUser) {
      router.push('/login?redirect=/chat');
      return;
    }

    const duration = selectedDuration[astrologer.id] || 15;
    const ratePerMin = astrologer.perMinuteRate || Math.round((astrologer.consultationFee || 500) / 15);
    const totalAmount = Math.max(1, ratePerMin * duration);

    setStartingChat(astrologer.id);
    setErrorMessage(null);

    try {
      // 1. Create Consultation Booking in backend
      const booking = await api.createBooking({
        astrologerId: astrologer.id,
        date: new Date().toISOString().split('T')[0],
        timeSlot: 'Immediate Live Chat',
        topic: `Live Astrologer Consultation (${duration} mins)`,
        clientNotes: `Paid live consultation with ${astrologer.name}`,
      });

      const bookingId = booking?.id || 1;

      // 2. Create Razorpay Order
      const order = await api.createPaymentOrder(totalAmount, 'consultation', String(bookingId));

      // 3. Open Razorpay Checkout Modal
      await openRazorpayModal({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: language === 'mr' ? 'ज्योतिषवेदा सल्लामसलत' : 'JyotishVeda Consultation',
        description: `${duration} ${language === 'mr' ? 'मिनिटे सल्लामसलत' : 'Mins Consultation'} - ${astrologer.name}`,
        order_id: order.orderId,
        prefill: {
          name: currentUser.username,
          email: currentUser.email,
        },
        theme: {
          color: '#D4AF37',
        },
        handler: async (response) => {
          try {
            // 4. Verify payment on backend with crypto.timingSafeEqual
            const verification = await api.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              serviceType: 'consultation',
              referenceId: String(bookingId),
            });

            if (verification.success) {
              // 5. Start Paid Chat Session
              const paidSession = await api.startPaidChatSession(bookingId);
              router.push(`/chat/${paidSession.sessionNumber}`);
            } else {
              alert(language === 'mr' ? 'पेमेंट पडताळणी अयशस्वी झाली.' : 'Payment verification failed. Please contact support.');
              setStartingChat(null);
            }
          } catch (verErr: any) {
            alert(verErr.message || (language === 'mr' ? 'पेमेंट निश्चित करण्यात अडचण आली' : 'Error confirming payment'));
            setStartingChat(null);
          }
        },
        modal: {
          ondismiss: () => {
            setStartingChat(null);
          },
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'mr' ? 'पेमेंट सुरू करता आले नाही.' : 'Payment initiation failed.'));
      setStartingChat(null);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] pb-24 font-sans">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0F0B1E] via-[#150D2A] to-[#1E1138] text-[#FDFBF7] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#25184B] border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs text-[#F7DF94]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'mr' ? 'थेट वैदिक ज्योतिषी सल्लामसलत' : 'Direct Jyotish Scholar Consultations'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            {t('chat.headerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#D8C7A5] max-w-xl mx-auto">
            {t('chat.headerSubtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-900/80 border border-red-500 text-white text-xs flex items-center space-x-2 shadow-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-200" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Free First Chat Eligibility Card */}
        <div className="bg-[#150D2A] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-8 shadow-cosmic text-[#FDFBF7] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Sparkles className="w-64 h-64 text-[#D4AF37]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="bg-[#D4AF37] text-[#0F0B1E] text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full tracking-wider">
                  {t('chat.welcomeOffer')}
                </span>
                {eligibility?.eligibleForFreeIntro && (
                  <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('chat.eligibleBadge')}</span>
                  </span>
                )}
                {eligibility?.freeSessionUsed && (
                  <span className="text-amber-300 text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('chat.usedBadge')}</span>
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7DF94]">
                {t('chat.freeOfferTitle')}
              </h2>

              <p className="text-xs sm:text-sm text-[#D8C7A5]">
                {t('chat.freeOfferDesc')}
              </p>

              {/* Status Indicator */}
              {currentUser ? (
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#D8C7A5]/80">
                  {eligibility?.hasKundli ? (
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>
                        {t('chat.chartLinked')}: <strong>{eligibility.latestKundli?.fullName}</strong> ({translateSign(eligibility.latestKundli?.ascendantSign)} {language === 'mr' ? 'लग्न' : 'Ascendant'})
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{t('chat.noChart')}</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="pt-2 text-xs text-amber-300 flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('chat.signInPrompt')}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="shrink-0 flex flex-col space-y-2 w-full sm:w-auto">
              {!currentUser ? (
                <Link
                  href="/login?redirect=/chat"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm text-center shadow-gold hover:opacity-95 transition-all"
                >
                  {language === 'mr' ? 'मोफत चॅटसाठी साइन इन करा' : 'Sign In to Claim Free Chat'}
                </Link>
              ) : eligibility?.eligibleForFreeIntro ? (
                eligibility.hasKundli ? (
                  <button
                    onClick={() => handleStartFreeChat()}
                    disabled={startingChat !== null}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm shadow-gold hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{startingChat === 'free' ? t('chat.connecting') : t('chat.startFreeBtn')}</span>
                  </button>
                ) : (
                  <Link
                    href="/kundli"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-sm text-center shadow-gold hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t('chat.generateKundliToUnlock')}</span>
                  </Link>
                )
              ) : (
                <div className="text-right">
                  <span className="inline-block px-4 py-2 rounded-lg bg-[#25184B] border border-[#D4AF37]/30 text-xs text-[#D8C7A5]">
                    {language === 'mr' ? 'मोफत सुविधा वापरली गेली आहे. खालील आचार्यांसोबत सशुल्क सत्र निवडा.' : 'Introductory offer already used. Choose an astrologer below for paid consultation.'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Astrologers Directory */}
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/20">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#150D2A]">
                {t('chat.onlineScholars')}
              </h3>
              <p className="text-xs text-gray-500">
                {t('chat.onlineDesc')}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">
              <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-2" />
              <p className="text-xs">{t('common.loading')}</p>
            </div>
          ) : astrologers.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center text-gray-500 border border-[#D4AF37]/20">
              {language === 'mr' ? 'सध्या कोणतेही ज्योतिषी उपलब्ध नाहीत. कृपया थोड्या वेळाने पुन्हा पहा.' : 'No astrologers are currently listed. Please check back shortly.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {astrologers.map((astrologer) => {
                const currentDuration = selectedDuration[astrologer.id] || 15;
                const perMin = astrologer.perMinuteRate || 25;
                const packageCost = perMin * currentDuration;
                const isOnline = astrologer.isOnline !== false;

                return (
                  <div
                    key={astrologer.id}
                    className="bg-white rounded-2xl border border-[#D4AF37]/25 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                  >
                    {/* Online status indicator */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-[#150D2A] text-[#F7DF94] flex items-center justify-center font-serif text-xl font-bold border-2 border-[#D4AF37]">
                            {astrologer.name.charAt(0)}
                          </div>
                          {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-300/50" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-[#150D2A] leading-tight">
                            {astrologer.name}
                          </h4>
                          <span className="text-xs text-[#8C6D1F] font-medium block">
                            {astrologer.title || (language === 'mr' ? 'वैदिक ज्योतिषी आणि विद्वान' : 'Vedic Astrologer & Scholar')}
                          </span>
                          <span className="text-[11px] text-gray-500 block">
                            {formatNumber(astrologer.experienceYears || 10)}+ {language === 'mr' ? 'वर्षांचा अनुभव' : 'Years Experience'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-amber-500 justify-end">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold text-gray-900">{formatNumber(astrologer.rating || 4.9)}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">({formatNumber(astrologer.reviewCount || 120)}+ {language === 'mr' ? 'अभिप्राय' : 'reviews'})</span>
                      </div>
                    </div>

                    {/* Bio & Specialties */}
                    <div className="my-4 space-y-2">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {astrologer.bio || (language === 'mr' ? 'जन्मकुंडली विश्लेषण, करिअर मार्गदर्शन, विवाह जुळवणी व प्रश्न कुंडली तज्ज्ञ.' : 'Specializes in Vedic Kundli analysis, career transitions, Prashna Jyotish, and marriage compatibility.')}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {astrologer.specialties?.slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF6F0] border border-[#D4AF37]/30 text-[#8C6D1F]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-gray-500">
                        {t('astrologers.languages')}: <strong>{astrologer.languages?.join(', ') || 'मराठी, हिंदी, इंग्रजी'}</strong>
                      </div>
                    </div>

                    {/* Duration packages */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{t('chat.selectDuration')}:</span>
                        <span className="font-semibold text-[#8C6D1F]">
                          {formatCurrency(perMin)}/{t('chat.perMin')}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 text-xs">
                        {[15, 30, 45, 60].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setSelectedDuration({ ...selectedDuration, [astrologer.id]: mins })}
                            className={`py-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                              currentDuration === mins
                                ? 'bg-[#150D2A] text-[#F7DF94] border-[#D4AF37]'
                                : 'bg-[#FAF6F0] text-gray-700 border-gray-200 hover:border-[#D4AF37]/50'
                            }`}
                          >
                            <span className="block text-[11px] font-bold">{formatNumber(mins)}{t('common.mins')}</span>
                            <span className="block text-[9px] opacity-80">{formatCurrency(mins * perMin)}</span>
                          </button>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-1">
                        {/* Free button if eligible */}
                        {eligibility?.eligibleForFreeIntro && (
                          <button
                            onClick={() => handleStartFreeChat(astrologer.id)}
                            disabled={startingChat !== null}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF6F0] border border-[#D4AF37] text-[#8C6D1F] font-semibold text-xs hover:bg-[#F3EADB] transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{t('chat.startFreeBtn')}</span>
                          </button>
                        )}

                        {/* Paid Consultation Button */}
                        <button
                          onClick={() => handleStartPaidConsultation(astrologer)}
                          disabled={startingChat !== null}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs shadow hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>
                            {startingChat === astrologer.id
                              ? t('chat.initRazorpay')
                              : t('chat.chatPaidBtn', { mins: formatNumber(currentDuration), price: formatNumber(packageCost) })}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Guarantees Strip */}
        <div className="bg-white border border-[#D4AF37]/20 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37] shrink-0" />
            <div>
              <strong className="block text-gray-900 font-semibold">{t('chat.guaranteeConfidential')}</strong>
              <span>{t('chat.guaranteeConfidentialDesc')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Zap className="w-7 h-7 text-[#D4AF37] shrink-0" />
            <div>
              <strong className="block text-gray-900 font-semibold">{t('chat.guaranteeTiming')}</strong>
              <span>{t('chat.guaranteeTimingDesc')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-7 h-7 text-[#D4AF37] shrink-0" />
            <div>
              <strong className="block text-gray-900 font-semibold">{t('chat.guaranteeRazorpay')}</strong>
              <span>{t('chat.guaranteeRazorpayDesc')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
