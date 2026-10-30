'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { User, Astrologer } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  MessageSquare,
  Sparkles,
  Clock,
  Send,
  AlertCircle,
  Bot,
  User as UserIcon,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
  Compass,
} from 'lucide-react';

export default function FreeChatPage() {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<any>(null);

  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const [mode, setMode] = useState<'human' | 'ai'>('human');

  // Birth Details state if chart missing
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1995-05-15');
  const [tob, setTob] = useState('08:30');
  const [place, setPlace] = useState('Mumbai, Maharashtra');

  // Active Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 mins
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      setLoading(false);
      return;
    }

    setFullName(currentUser.username || '');

    // Check free chat eligibility and fetch astrologers
    Promise.all([
      api.getChatEligibility().catch((e) => {
        console.warn('Eligibility check failed:', e);
        return {
          eligibleForFreeIntro: true,
          reason: 'Eligible for 5-minute complimentary introductory consultation.',
          hasKundli: true,
          freeMinutes: 5,
          hasActiveSession: false,
          activeSession: null,
          remainingSeconds: 300,
        };
      }),
      api.getAstrologers().catch(() => []),
    ])
      .then(([el, astroList]) => {
        setEligibility(el);
        setAstrologers(astroList || []);
        if (astroList && astroList.length > 0) {
          setSelectedAstrologer(astroList[0]);
        }

        // Auto-resume active session across page refreshes
        if (el?.hasActiveSession && el?.activeSession) {
          const act = el.activeSession;
          const sId = act.sessionNumber || String(act.id);
          setSessionId(sId);
          setSessionActive(true);
          setSecondsRemaining(act.remainingSeconds || el.remainingSeconds || 300);
          if (act.astrologer) {
            setSelectedAstrologer(act.astrologer);
          }
          // Fetch persistent messages from backend for this active session
          api.getChatMessages(sId).then((msgs) => {
            if (msgs && msgs.length > 0) {
              setMessages(msgs);
            }
          }).catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!sessionActive || sessionCompleted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSessionCompleted(true);
          setSessionActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, sessionCompleted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartSession = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'human') {
        const res = await api.startFreeChatSession(selectedAstrologer?.id);
        setSessionId(res.sessionNumber || String(res.id));
        setSessionActive(true);
        setSecondsRemaining((res.durationMinutes || 5) * 60);

        // Fetch initial messages from session
        try {
          const msgs = await api.getChatMessages(res.sessionNumber || String(res.id));
          if (msgs && msgs.length > 0) {
            setMessages(msgs);
          } else {
            setMessages([
              {
                id: 'init-1',
                senderType: 'astrologer',
                senderName: selectedAstrologer?.name || 'Acharya Vidyadhar',
                message: `Namaste ${user?.username}! Pranam. I have your Vedic birth details ready. You have 5 minutes of complimentary consultation. What guidance are you seeking today?`,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } catch {
          setMessages([
            {
              id: 'init-1',
              senderType: 'astrologer',
              senderName: selectedAstrologer?.name || 'Acharya Vidyadhar',
              message: `Namaste ${user?.username}! Pranam. I have your Vedic birth details ready. You have 5 minutes of complimentary consultation. What guidance are you seeking today?`,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } else {
        // AI Mode
        setSessionId(`AI-FREE-${Date.now()}`);
        setSessionActive(true);
        setSecondsRemaining(300);
        setMessages([
          {
            id: 'ai-init',
            senderType: 'ai',
            senderName: 'JyotishVeda AI Assistant',
            message: `Namaste ${user?.username}! I am your AI Astrological Assistant grounded in classical Parashari principles. How may I illuminate your planetary alignments today?`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err: any) {
      console.error('Failed to start session:', err);
      const msg = err.message || 'Unable to start free session. Please try again.';
      if (msg.includes('already been used') || msg.includes('FREE_INTRO_CONSUMED')) {
        setEligibility((prev) => ({
          ...(prev || {
            hasKundli: false,
            freeMinutes: 0,
            hasActiveSession: false,
            activeSession: null,
            remainingSeconds: 0,
          }),
          eligibleForFreeIntro: false,
          freeSessionUsed: true,
          reason: msg,
        }));
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending || !sessionActive) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Optimistically add user message
    const userMsg = {
      id: `usr-${Date.now()}`,
      senderType: 'user',
      senderName: user?.username || 'You',
      message: userText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      if (mode === 'human') {
        const replyRes = await api.sendChatMessage(sessionId!, userText);
        if (replyRes.astrologerResponse || (replyRes as any).astrologerReply) {
          const rep = replyRes.astrologerResponse || (replyRes as any).astrologerReply;
          setMessages((prev) => [...prev, rep]);
        }
        if (replyRes.remainingSeconds !== undefined) {
          setSecondsRemaining(replyRes.remainingSeconds);
        }
        if (replyRes.isCompleted) {
          setSessionCompleted(true);
          setSessionActive(false);
        }
      } else {
        // AI Route
        const aiRes = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            history: messages.map((m) => ({
              sender: m.senderType === 'user' ? 'user' : 'model',
              message: m.message,
            })),
            birthChart: {
              fullName,
              dob,
              tob,
              place,
            },
            language,
          }),
        });

        const aiData = await aiRes.json();
        if (!aiData.configured) {
          setAiConfigured(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              senderType: 'system',
              senderName: 'Configuration Notice',
              message: 'Google Gemini AI engine is not configured (GEMINI_API_KEY missing in environment). You can switch to our learned human Acharyas for personalized consultation.',
              timestamp: new Date().toISOString(),
            },
          ]);
        } else if (aiData.success && aiData.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              senderType: 'ai',
              senderName: 'JyotishVeda AI Assistant',
              message: aiData.reply,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setErrorMsg('Failed to deliver message. Please retry.');
    } finally {
      setIsSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    const confirmEnd = window.confirm(
      language === 'mr'
        ? 'तुम्हाला नक्की हे मोफत सल्लामसलत सत्र समाप्त करायचे आहे का?'
        : 'Are you sure you want to end this consultation session?'
    );
    if (!confirmEnd) return;

    try {
      if (mode === 'human') {
        await api.endChatSession(sessionId);
      }
    } catch (e) {
      console.warn('End session notice:', e);
    }
    setSessionActive(false);
    setSessionCompleted(true);
    setSecondsRemaining(0);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. SIGN IN REQUIRED VIEW
  if (!user && !loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#EAE1D2] p-8 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center mx-auto text-[#D97706]">
            <Sparkles className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-2xl font-extrabold text-[#2D1810]">
            {isMr ? 'मोफत ५-मिनिटे संप्रेषण' : 'First Chat Free (5 Mins)'}
          </h1>

          <p className="text-xs text-[#786C60] leading-relaxed">
            {isMr
              ? 'तुमच्या मोफत संप्रेषणाचा लाभ घेण्यासाठी कृपया प्रथम तुमच्या खात्यात लॉग इन करा.'
              : 'Please sign in to your JyotishVeda account to check eligibility and connect with a verified Vedic Acharya.'}
          </p>

          <div className="pt-2 space-y-2">
            <Link
              href="/login?redirect=/free-chat"
              className="block w-full py-3.5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md transition-all"
            >
              {isMr ? 'साइन इन करा' : 'Sign In to Claim Free Chat'}
            </Link>
            <Link
              href="/register?redirect=/free-chat"
              className="block w-full py-3 rounded-2xl bg-white border border-[#EAE1D2] hover:bg-[#FAF7F2] text-[#2D1810] font-semibold text-xs transition-all"
            >
              {isMr ? 'नवीन खाते तयार करा' : 'Create New Account'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE CHAT INTERFACE
  if (sessionActive || sessionCompleted) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans flex flex-col">
        {/* Chat Header Bar */}
        <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-2.5 sm:py-3 px-3 sm:px-6 sticky top-16 z-30 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] font-bold text-sm flex-shrink-0">
                {mode === 'ai' ? <Bot className="w-4 h-4 sm:w-5 sm:h-5" /> : <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <div className="min-w-0">
                <strong className="block text-xs sm:text-sm text-[#2D1810] truncate">
                  {mode === 'ai' ? 'JyotishVeda AI Assistant' : selectedAstrologer?.name || 'Acharya Vidyadhar'}
                </strong>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{mode === 'ai' ? (isMr ? 'एआय ज्योतिष सहायक' : 'AI Astrologer') : (isMr ? 'सक्रिय सत्र' : 'Live Free Session')}</span>
                </span>
              </div>
            </div>

            {/* Actions & Countdown Timer */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 ml-auto flex-shrink-0">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-[#FFFBEB] border border-[#FDE68A] px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D97706]" />
                <span className={`font-mono text-[11px] sm:text-xs font-extrabold ${secondsRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-[#92400E]'}`}>
                  {formatTimer(secondsRemaining)}
                </span>
              </div>

              {sessionActive && !sessionCompleted && (
                <button
                  type="button"
                  onClick={handleEndSession}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] sm:text-xs font-bold transition-colors"
                >
                  {isMr ? 'समाप्त करा' : 'End Chat'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-4 overflow-y-auto">
          {sessionCompleted && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl text-center text-xs text-[#785D46]">
              <strong className="block font-bold text-[#92400E] mb-1">
                {isMr ? 'तुमचे मोफत ५-मिनिटांचे सत्र पूर्ण झाले आहे' : 'Your 5-Minute Free Introductory Session is Complete'}
              </strong>
              <span>{isMr ? 'सखोल मार्गदर्शनासाठी कृपया आमच्या अनुभवी आचार्यांशी सशुल्क सल्लामसलत बुक करा.' : 'To continue deep chart analysis, book a private 15 or 30-minute consultation with our verified scholars.'}</span>
              <div className="mt-3">
                <Link
                  href="/astrologers"
                  className="inline-block px-5 py-2 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold"
                >
                  {isMr ? 'आचार्य निवडा' : 'Book Acharya Consultation'}
                </Link>
              </div>
            </div>
          )}

          {messages.map((m, idx) => {
            const isUser = m.senderType === 'user';
            const isAi = m.senderType === 'ai';
            return (
              <div
                key={m.id || idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-gray-400 mb-1 px-1">
                  {m.senderName || (isUser ? 'You' : 'Astrologer')}
                </span>
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-[#D97706] text-white rounded-tr-none'
                      : isAi
                      ? 'bg-white text-[#2D1810] border border-[#FDE68A] rounded-tl-none'
                      : 'bg-white text-[#2D1810] border border-[#EAE1D2] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Message Footer */}
        {!sessionCompleted && (
          <div className="bg-[#FFFDF9] border-t border-[#EAE1D2] p-4 sticky bottom-0 z-30">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-2">
              <input
                type="text"
                placeholder={isMr ? 'तुमचा प्रश्न येथे विचारा (उदा. नोकरी, विवाह, भाग्य)...' : 'Type your astrological query (e.g. career growth, marriage timing)...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSending || !sessionActive}
                className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#EAE1D2] rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-[#D97706]/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending || !sessionActive}
                className="p-3 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white rounded-2xl shadow-md transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // 3. ELIGIBILITY & CONFIGURATION SETUP VIEW
  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] font-sans pb-24">
      {/* Header */}
      <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span>{isMr ? 'पहिला संवाद १००% मोफत' : '100% Complimentary First Consultation'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1810]">
            {isMr ? 'पहिली ५-मिनिटे मोफत संप्रेषण' : 'First Chat Free — Live Astrologer Guidance'}
          </h1>

          <p className="text-xs sm:text-sm text-[#786C60] max-w-xl mx-auto">
            {isMr
              ? 'तुमच्या जन्म तपशीलांवर आधारित थेट वैदिक आचार्यांशी किंवा एआय सहायकाशी मोफत संवाद साधा.'
              : 'Connect directly with verified Vedic scholars or our AI Jyotish Assistant to evaluate your primary life query.'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Eligibility Verification Card */}
        {eligibility && !eligibility.eligibleForFreeIntro ? (
          <div className="bg-white rounded-3xl border-2 border-[#FDE68A] p-6 sm:p-10 shadow-md text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-700 shadow-xs">
              <Sparkles className="w-7 h-7 text-[#D97706]" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#92400E] bg-[#FFFBEB] px-3 py-1 rounded-full font-bold border border-[#FDE68A]">
                {isMr ? 'सत्र स्थिती: वापरले गेले' : 'Status: Introductory Offer Claimed'}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1810] pt-1">
                {isMr ? 'आपले मोफत प्रास्ताविक सत्र पूर्ण झाले आहे' : 'Complimentary Introductory Session Claimed'}
              </h2>
              <p className="text-xs sm:text-sm text-[#786C60] max-w-lg mx-auto leading-relaxed">
                {eligibility.reason ||
                  (isMr
                    ? 'या खात्यावर ५-मिनिटांचे मोफत प्रास्ताविक सत्र आधीच वापरले गेले आहे. सखोल कुंडली मार्गदर्शनासाठी कृपया आमच्या अनुभवी आचार्यांसोबत सशुल्क सत्र निवडा.'
                    : 'Your one-time 5-minute complimentary consultation has already been used on this account. Connect with our verified Vedic scholars below for a personalized in-depth consultation.')}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/astrologers"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white text-xs font-bold shadow-md transition-all text-center"
              >
                {isMr ? 'आचार्य निवडा आणि सशुल्क चॅट सुरू करा' : 'Explore Astrologers & Paid Consultations'}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMode('ai');
                  setEligibility((prev) => ({ ...(prev || {}), eligibleForFreeIntro: true }));
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#EAE1D2] hover:bg-[#FAF7F2] text-[#4A2E18] text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5"
              >
                <Bot className="w-4 h-4 text-[#D97706]" />
                <span>{isMr ? 'विनामूल्य एआय ज्योतिष सहायक वापरा' : 'Switch to Free AI Astrologer Mode'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#EAE1D2] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Consultation Mode Selection */}
            <div>
              <label className="block text-xs font-bold text-[#5C4535] uppercase tracking-wider mb-2">
                {isMr ? 'सल्लामसलत पद्धत निवडा' : 'Select Consultation Mode'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setMode('human')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    mode === 'human'
                      ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E] shadow-sm'
                      : 'bg-white border-[#EAE1D2] text-[#4A2E18] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <UserIcon className="w-5 h-5 text-[#D97706] mb-1.5" />
                  <strong className="block text-sm">{isMr ? 'वैदिक आचार्य' : 'Human Astrologer'}</strong>
                  <span className="text-[11px] text-gray-500">{isMr ? 'थेट अनुभवी ज्योतिष विद्वान' : 'Live chat with verified Acharyas'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('ai')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    mode === 'ai'
                      ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E] shadow-sm'
                      : 'bg-white border-[#EAE1D2] text-[#4A2E18] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Bot className="w-5 h-5 text-[#D97706] mb-1.5" />
                  <strong className="block text-sm">{isMr ? 'एआय ज्योतिष सहायक' : 'AI Astrologer'}</strong>
                  <span className="text-[11px] text-gray-500">{isMr ? 'तात्काळ उत्तरे (Parashari)' : 'Instant real-time responses'}</span>
                </button>
              </div>
            </div>

            {/* Human Astrologer Selection */}
            {mode === 'human' && astrologers.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#5C4535] uppercase tracking-wider mb-2">
                  {isMr ? 'उपलब्ध आचार्य निवडा' : 'Select Verified Acharya'}
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {astrologers.map((astro) => (
                    <div
                      key={astro.id}
                      onClick={() => setSelectedAstrologer(astro)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedAstrologer?.id === astro.id
                          ? 'bg-[#FFFBEB] border-[#D97706] shadow-sm'
                          : 'bg-white border-[#EAE1D2] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-[#EAE1D2]">
                          <img
                            src={astro.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
                            alt={astro.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <strong className="text-xs text-[#2D1810] block">{astro.name}</strong>
                          <span className="text-[11px] text-gray-500">{astro.specialties?.slice(0, 2).join(', ')} • {astro.experienceYears}y exp</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#D97706]">
                        {selectedAstrologer?.id === astro.id ? (isMr ? 'निवडले' : 'Selected') : (isMr ? 'निवडा' : 'Select')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Birth Details Form */}
            <div className="space-y-3 pt-2 border-t border-[#F3ECE1]">
              <label className="block text-xs font-bold text-[#5C4535] uppercase tracking-wider">
                {isMr ? 'तुमचे जन्म तपशील (अचूक गणनेसाठी आवश्यक)' : 'Confirm Birth Coordinates for Reading'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-[#786C60] mb-1">{isMr ? 'नाव' : 'Name'}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#786C60] mb-1">{isMr ? 'जन्म तारीख' : 'Date of Birth'}</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#786C60] mb-1">{isMr ? 'जन्म वेळ' : 'Time of Birth'}</label>
                  <input
                    type="time"
                    required
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#786C60] mb-1">{isMr ? 'जन्म शहर' : 'Place of Birth'}</label>
                  <input
                    type="text"
                    required
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Start CTA */}
            <button
              type="button"
              onClick={handleStartSession}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#2D1810] font-serif font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isMr ? 'मोफत ५-मिनिटे संवाद सुरू करा' : 'Start Free 5-Min Chat Consultation'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
