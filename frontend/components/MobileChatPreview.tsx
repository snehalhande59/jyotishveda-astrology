'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import {
  MessageCircle,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronLeft,
  Send,
  Zap,
} from 'lucide-react';

interface ChatScenario {
  id: string;
  topicEn: string;
  topicMr: string;
  icon: string;
  userQuestionEn: string;
  userQuestionMr: string;
  astroAnswerEn: string;
  astroAnswerMr: string;
  remedyEn: string;
  remedyMr: string;
  userTime: string;
  astroTime: string;
}

const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: 'career',
    topicEn: 'Career & Job',
    topicMr: 'करिअर आणि नोकरी',
    icon: '💼',
    userQuestionEn: 'When will I get a promotion or job change? Feeling stuck for 2 years.',
    userQuestionMr: 'माझ्या नोकरीत पदोन्नती (Promotion) किंवा बदल कधी होईल? २ वर्षांपासून वाट पाहत आहे.',
    astroAnswerEn:
      'Namaste Snehal! Looking at your chart, Jupiter is entering your 10th house of career in May 2026. This creates a strong Gaj Kesari Yog for a major career breakthrough and salary hike.',
    astroAnswerMr:
      'नमस्ते स्नेहल! तुमच्या कुंडलीत मे २०२६ पासून १० व्या भावात गुरूचे शुभ गोचर सुरू होत आहे. करिअरमध्ये उत्तम पदोन्नती आणि अपेक्षित पगारवाढीचे प्रबळ योग आहेत.',
    remedyEn: 'Remedy: Chant "Om Brihaspataye Namah" on Thursdays and offer yellow flowers to Vishnu.',
    remedyMr: 'उपाय: दर गुरुवारी "ॐ बृहस्पतये नमः" जप करा आणि पिवळे फुल विष्णूला अर्पण करा.',
    userTime: '9:38 AM',
    astroTime: '9:39 AM',
  },
  {
    id: 'marriage',
    topicEn: 'Marriage & Love',
    topicMr: 'विवाह आणि जोडीदार',
    icon: '💍',
    userQuestionEn: 'When will I get married? What will my life partner be like?',
    userQuestionMr: 'माझे लग्न कधी ठरेल? माझा जोडीदार कसा असेल?',
    astroAnswerEn:
      'According to your 7th house and D9 Navamsha, an auspicious Vivah Yog is active between September 2026 and March 2027. Your spouse will be educated, caring, and from the IT or creative field.',
    astroAnswerMr:
      'तुमच्या कुंडलीतील ७ वा भाव आणि नवमांशानुसार, सप्टेंबर २०२६ ते मार्च २०२७ दरम्यान शुभ विवाहाचा काळ आहे. जोडीदार सुविद्य, समजूतदार आणि आयटी किंवा कला क्षेत्रातील असेल.',
    remedyEn: 'Remedy: Offer raw milk to Shiva on Mondays to strengthen Chandra & Venus alignment.',
    remedyMr: 'उपाय: सोमवारी शिवलिंगावर कच्चे दूध अर्पण करा, यामुळे चंद्र-शुक्र शुभ फळ देतील.',
    userTime: '9:40 AM',
    astroTime: '9:41 AM',
  },
  {
    id: 'finance',
    topicEn: 'Business & Wealth',
    topicMr: 'व्यवसाय आणि धनलाभ',
    icon: '💰',
    userQuestionEn: 'Is this the right time to start a new business venture?',
    userQuestionMr: 'नवीन व्यवसाय सुरू करण्यासाठी किंवा गुंतवणुकीसाठी हा काळ योग्य आहे का?',
    astroAnswerEn:
      'Mercury-Venus Mahadasha is starting shortly. Launching after the upcoming festive Muhurta will bring excellent profitability and long-term stability.',
    astroAnswerMr:
      'सध्या बुध आणि शुक्राची महादशा लाभदायक आहे. आगामी दिवाळीनंतर नवीन व्यवसाय सुरू केल्यास दीर्घकालीन स्थैर्य आणि भरघोस धनलाभ होईल.',
    remedyEn: 'Remedy: Keep a Kuber Yantra in North-East and light a ghee lamp on Fridays.',
    remedyMr: 'उपाय: ईशान्य कोपऱ्यात कुबेर यंत्र ठेवा आणि शुक्रवारी तुपाचा दिवा लावा.',
    userTime: '9:42 AM',
    astroTime: '9:43 AM',
  },
  {
    id: 'peace',
    topicEn: 'Mental Peace',
    topicMr: 'आरोग्य आणि मनःशांती',
    icon: '🧘',
    userQuestionEn: 'I feel anxious and lack mental peace lately. What should I do?',
    userQuestionMr: 'सतत चिंता आणि मानसिक अस्वस्थता वाटते. शांततेसाठी कोणते उपाय करावेत?',
    astroAnswerEn:
      'Transit Rahu is aspecting your Natal Moon causing temporary stress. This is passing soon. Wearing pure silver and deep meditation will restore peace immediately.',
    astroAnswerMr:
      'गोचरातील राहूची दृष्टी चंद्रावर असल्याने ही तात्पुरती अस्वस्थता आहे. चांदीचे कडे परिधान करा आणि सकाळी १० मिनिटे ध्यान केल्यास त्वरित मानसिक शांती लाभेल.',
    remedyEn: 'Remedy: Drink water in a pure silver tumbler and practice Pranayama at sunrise.',
    remedyMr: 'उपाय: चांदीच्या पात्रातून पाणी प्या आणि सूर्योदयाच्या वेळी प्राणायाम करा.',
    userTime: '9:44 AM',
    astroTime: '9:45 AM',
  },
];

export default function MobileChatPreview() {
  const { language } = useLanguage();
  const isMr = language === 'mr';

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [showAstroTyping, setShowAstroTyping] = useState(false);
  const [showAstroReply, setShowAstroReply] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scenario = CHAT_SCENARIOS[activeScenarioIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play animation sequence whenever active scenario changes
  useEffect(() => {
    setShowAstroTyping(false);
    setShowAstroReply(false);

    // 1. Astrologer starts typing after 800ms
    const typeTimer = setTimeout(() => {
      setShowAstroTyping(true);
    }, 800);

    // 2. Astrologer shows reply after 2000ms
    const replyTimer = setTimeout(() => {
      setShowAstroTyping(false);
      setShowAstroReply(true);
    }, 2200);

    return () => {
      clearTimeout(typeTimer);
      clearTimeout(replyTimer);
    };
  }, [activeScenarioIndex]);

  // Auto-cycle through scenarios every 9 seconds if autoplay is active
  useEffect(() => {
    if (!isAutoPlaying) return;

    timerRef.current = setInterval(() => {
      setActiveScenarioIndex((prev) => (prev + 1) % CHAT_SCENARIOS.length);
    }, 9000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  const selectScenario = (index: number) => {
    setActiveScenarioIndex(index);
    setIsAutoPlaying(false); // Stop autoplay on user interaction
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] border border-[#EAE1D2] rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FDE68A]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FED7AA]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* =========================================================
              LEFT COLUMN: Information, Badges & Interactive Topic Selector
             ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header pill badge */}
            <div className="inline-flex items-center space-x-2 bg-[#FEF3C7] border border-[#FDE68A] px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-[#92400E]">
                {isMr ? 'थेट १-ऑन-१ ज्योतिष संवाद' : 'Live 1-on-1 Astrologer Consultation'}
              </span>
              <span className="text-[11px] bg-[#D97706] text-white font-extrabold px-2 py-0.5 rounded-full">
                {isMr ? '५ मि. मोफत' : '5 Mins Free'}
              </span>
            </div>

            {/* Main Section Title */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D1810] tracking-tight leading-tight">
                {isMr ? (
                  <>
                    आपल्या समस्या विचारा, <span className="text-[#D97706]">सखोल मार्गदर्शन</span> मिळवा
                  </>
                ) : (
                  <>
                    Ask Any Question, Get <span className="text-[#D97706]">Instant Vedic Clarity</span>
                  </>
                )}
              </h2>
              <p className="text-sm sm:text-base text-[#6B5A4E] mt-3 leading-relaxed max-w-2xl">
                {isMr
                  ? 'नोकरी, लग्न, व्यवसाय किंवा आरोग्य — तुमच्या जन्मकुंडलीतील ग्रहस्थितीनुसार प्रमाणित ज्योतिषांकडून त्वरित अचूक उत्तरे आणि प्रभावी वैदिक तोडगे मिळवा.'
                  : 'Get instant answers for your career, relationship, finance, and wellness directly from verified Vedic scholars strictly using Lahiri Sidereal ephemeris.'}
              </p>
            </div>

            {/* Interactive Topic Chips */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#785D46] uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{isMr ? 'विषय निवडून लाईव्ह डेमो पाहा:' : 'Click to preview real consultation:'}</span>
                </span>
                {!isAutoPlaying && (
                  <button
                    onClick={() => setIsAutoPlaying(true)}
                    className="text-[11px] font-semibold text-[#D97706] hover:underline flex items-center space-x-1"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isMr ? 'ऑटो-प्ले सुरू करा' : 'Auto-play demo'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {CHAT_SCENARIOS.map((item, idx) => {
                  const isActive = activeScenarioIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectScenario(idx)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isActive
                          ? 'bg-[#FFFBEB] border-[#D97706] shadow-sm ring-2 ring-[#D97706]/20'
                          : 'bg-white border-[#EAE1D2] hover:border-[#F59E0B] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span className="text-xl mb-1">{item.icon}</span>
                      <span
                        className={`text-xs font-bold ${
                          isActive ? 'text-[#92400E]' : 'text-[#4A2E18]'
                        }`}
                      >
                        {isMr ? item.topicMr : item.topicEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#2D1810] block">
                    {isMr ? '१००% अचूक लाहिरी कुंडली' : 'Pure Lahiri Sidereal Accuracy'}
                  </strong>
                  <span className="text-[#786C60]">
                    {isMr ? 'शास्त्रोक्त गणिती आकडेमोड' : 'Strict astronomical calculations'}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <strong className="text-[#2D1810] block">
                    {isMr ? '१००% सुरक्षित व गोपनीय' : '100% Private & Confidential'}
                  </strong>
                  <span className="text-[#786C60]">
                    {isMr ? 'एंड-टू-एंड एनक्रिप्टेड चॅट' : 'Encrypted direct 1-on-1 session'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/chat"
                className="px-6 py-3.5 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 group"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isMr ? 'आताच मोफत चॅट सुरू करा' : 'Start Free Chat Consultation'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/astrologers"
                className="px-5 py-3.5 bg-white border border-[#EAE1D2] hover:border-[#D97706] text-[#4A2E18] hover:text-[#92400E] font-bold text-sm rounded-xl shadow-xs transition-all flex items-center space-x-2"
              >
                <Clock className="w-4 h-4 text-[#D97706]" />
                <span>{isMr ? 'सर्व ५०+ ज्योतिषी पाहा' : 'Browse All Astrologers'}</span>
              </Link>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Pixel-Perfect Mobile Phone Mockup
             ========================================================= */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[350px] sm:max-w-[380px] bg-[#1C1917] rounded-[48px] p-3 shadow-2xl border-4 border-[#292524] relative">
              {/* Dynamic Island / Speaker Notch */}
              <div className="w-28 h-4 bg-black rounded-full mx-auto mb-2.5 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#262626] mr-2" />
                <div className="w-2 h-2 rounded-full bg-[#1e293b]" />
              </div>

              {/* Inner Smartphone Screen */}
              <div className="bg-[#FAF7F2] rounded-[36px] overflow-hidden flex flex-col h-[560px] border border-[#E7E5E4] shadow-inner relative">
                {/* 1. STATUS BAR */}
                <div className="px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold text-[#1C1917] select-none bg-[#FAF7F2]">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1.5">
                    {/* Cellular signal bars */}
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 17h2v4H2zm4-4h2v8H6zm4-4h2v12h-2zm4-4h2v16h-2zm4-4h2v20h-2z" />
                    </svg>
                    {/* Battery icon */}
                    <div className="w-5 h-2.5 border border-current rounded-xs p-0.5 flex items-center">
                      <div className="w-3 h-full bg-current rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* 2. CHAT APP HEADER (Matches User Uploaded Screenshot Exactly!) */}
                <div className="px-3.5 py-2.5 bg-white border-b border-[#EAE1D2] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <button className="text-[#4A2E18] hover:text-black p-0.5">
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Astrologer Avatar with emerald active ring */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500 overflow-hidden bg-amber-100 flex items-center justify-center">
                        <Image
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                          alt="Astro Heena"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>

                    {/* Astrologer Name, Verified Check, Subtitle */}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1">
                        <h4 className="font-bold text-sm text-[#1C1917] truncate leading-tight">
                          Astro Heena
                        </h4>
                        {/* Verified green check badge */}
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#786C60] leading-tight">
                        <span className="text-emerald-600 font-medium">{isMr ? 'ऑनलाइन' : 'online'}</span>{' '}
                        · <span className="font-semibold text-[#2D1810]">₹18</span>/min
                      </p>
                    </div>
                  </div>

                  {/* Call Action Button (Yellow circular matching image) */}
                  <Link
                    href="/booking"
                    className="w-9 h-9 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#1C1917] flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-95"
                    title={isMr ? 'कॉल करा' : 'Call Astrologer'}
                  >
                    <Phone className="w-4 h-4 fill-current" />
                  </Link>
                </div>

                {/* 3. CHAT BODY WITH ANIMATED MESSAGES */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FAF7F2]">
                  {/* Timestamp Pill */}
                  <div className="flex justify-center my-1">
                    <span className="px-3 py-0.5 rounded-full bg-[#EAE1D2]/60 text-[10px] font-medium text-[#786C60]">
                      {isMr ? `आज · ${scenario.userTime}` : `Today · ${scenario.userTime}`}
                    </span>
                  </div>

                  {/* USER MESSAGE (Right Aligned, Yellow/Amber Bubble) */}
                  <div className="flex flex-col items-end space-y-1">
                    <div className="max-w-[85%] bg-[#FEF3C7] border border-[#FDE68A] text-[#2D1810] p-3 rounded-2xl rounded-tr-xs shadow-2xs text-xs leading-relaxed">
                      {isMr ? scenario.userQuestionMr : scenario.userQuestionEn}
                    </div>
                    <span className="text-[10px] text-[#A89887] pr-1 flex items-center space-x-1">
                      <span>{scenario.userTime}</span>
                      <span className="text-emerald-600 font-bold">✓✓</span>
                    </span>
                  </div>

                  {/* ASTROLOGER TYPING INDICATOR (Animated 3 bouncing dots) */}
                  {showAstroTyping && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-amber-100 shrink-0">
                        <Image
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
                          alt="Heena"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="bg-white border border-[#EAE1D2] px-3.5 py-2.5 rounded-2xl rounded-tl-xs shadow-2xs flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-bounce" />
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-bounce"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-bounce"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ASTROLOGER REPLY (Left Aligned, White Card Bubble) */}
                  {showAstroReply && (
                    <div className="flex items-start space-x-2 animate-fadeIn">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-amber-100 shrink-0 mt-0.5">
                        <Image
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
                          alt="Heena"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="space-y-2 max-w-[88%]">
                        <div className="bg-white border border-[#EAE1D2] text-[#2D1810] p-3 rounded-2xl rounded-tl-xs shadow-2xs text-xs leading-relaxed">
                          {isMr ? scenario.astroAnswerMr : scenario.astroAnswerEn}
                        </div>

                        {/* Vedic Remedy Highlight Pill */}
                        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-2.5 rounded-xl text-[11px] text-[#92400E] font-medium leading-snug flex items-start space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                          <span>{isMr ? scenario.remedyMr : scenario.remedyEn}</span>
                        </div>

                        <span className="text-[10px] text-[#A89887] pl-1 block">
                          {scenario.astroTime}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. CHAT INPUT BAR WITH CTA BUTTON */}
                <div className="p-2.5 bg-white border-t border-[#EAE1D2] space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      disabled
                      placeholder={
                        isMr ? 'आपला प्रश्न येथे टाइप करा...' : 'Type your question here...'
                      }
                      className="flex-1 bg-[#FAF7F2] border border-[#EAE1D2] px-3.5 py-2 rounded-full text-xs text-[#2D1810] placeholder:text-[#A89887] outline-none"
                    />
                    <Link
                      href="/chat"
                      className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs hover:bg-[#B45309] transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 -ml-0.5" />
                    </Link>
                  </div>

                  {/* Direct Link to chat room */}
                  <Link
                    href="/chat"
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isMr ? 'हेनाजींशी थेट चॅट सुरू करा' : 'Start Live Chat with Heena'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
