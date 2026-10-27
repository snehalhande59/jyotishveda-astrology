'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { ChatSession, ChatMessage, User } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  Send,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Calendar,
} from 'lucide-react';

export default function ActiveChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const { language, t, formatNumber, translateSign, translatePlanet } = useLanguage();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const [showChartDrawer, setShowChartDrawer] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load session and initial message history
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push(`/login?redirect=/chat/${sessionId}`);
      return;
    }
    setCurrentUser(user);

    async function fetchSessionData() {
      setLoading(true);
      try {
        const sess = await api.getChatSession(sessionId);
        setSession(sess);

        const msgs = await api.getChatMessages(sessionId);
        setMessages(msgs || []);

        // Compute remaining time
        if (sess.expiresAt) {
          const diffMs = new Date(sess.expiresAt).getTime() - Date.now();
          const secs = Math.max(0, Math.floor(diffMs / 1000));
          setTimeLeftSeconds(secs);
        }
      } catch (err: any) {
        setErrorBanner(err.message || (language === 'mr' ? 'चॅट सत्र लोड करता आले नाही.' : 'Unable to load chat session.'));
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId, router, language]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeftSeconds === null) return;

    if (timeLeftSeconds <= 0) {
      if (session && session.status === 'active') {
        setSession({ ...session, status: 'expired' });
      }
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev === null || prev <= 1) {
          if (session && session.status === 'active') {
            setSession({ ...session, status: 'expired' });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timeLeftSeconds, session]);

  // Periodic polling for incoming messages if active
  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const pollInterval = setInterval(async () => {
      try {
        const msgs = await api.getChatMessages(sessionId);
        if (msgs && msgs.length > messages.length) {
          setMessages(msgs);
        }
      } catch (e) {
        // silent poll fail
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [sessionId, session, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !session) return;
    if (session.status !== 'active') return;

    const userText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      senderType: 'user',
      senderName: currentUser?.username || (language === 'mr' ? 'तुम्ही' : 'You'),
      message: userText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.sendChatMessage(sessionId, userText);
      const astrologerMsg = res?.astrologerResponse || (res as any)?.astrologerReply;
      if (astrologerMsg) {
        setMessages((prev) => [...prev, astrologerMsg]);
      }
      // Update session message count
      setSession((prev) => (prev ? { ...prev, messageCount: prev.messageCount + 1 } : null));
    } catch (err: any) {
      setErrorBanner(err.message || (language === 'mr' ? 'संदेश पाठवता आला नाही.' : 'Message delivery failed.'));
    } finally {
      setSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!confirm(language === 'mr' ? 'आपण ही ज्योतिष सल्लामसलत समाप्त करू इच्छिता?' : 'Are you sure you want to end this astrological consultation?')) return;
    try {
      await api.endChatSession(sessionId);
      setSession((prev) => (prev ? { ...prev, status: 'completed' } : null));
      setTimeLeftSeconds(0);
    } catch (e: any) {
      alert(e.message || (language === 'mr' ? 'सत्र समाप्त करताना त्रुटी आली.' : 'Error ending session'));
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return language === 'mr' ? formatNumber(formatted) : formatted;
  };

  const isExpired = session?.status === 'expired' || (timeLeftSeconds !== null && timeLeftSeconds <= 0);
  const isMessageLimitReached = session?.maxMessages ? session.messageCount >= session.maxMessages : false;
  const isChatDisabled = isExpired || isMessageLimitReached || session?.status === 'completed';

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A1423] flex flex-col font-sans">
      {/* Astrologer & Session Top Bar */}
      <header className="bg-[#150D2A] border-b border-[#D4AF37]/30 text-[#FDFBF7] px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Astrologer Info */}
          <div className="flex items-center space-x-3">
            <Link
              href="/chat"
              className="text-[#D8C7A5] hover:text-[#D4AF37] text-xs flex items-center space-x-1 pr-2 border-r border-[#D4AF37]/20"
            >
              <span>{t('room.backToAll')}</span>
            </Link>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#25184B] border border-[#D4AF37] text-[#F7DF94] flex items-center justify-center font-bold text-sm">
                {session?.astrologer?.name ? session.astrologer.name.charAt(0) : 'A'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#150D2A]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#F7DF94]">
                  {session?.astrologer?.name || (language === 'mr' ? 'वैदिक ज्योतिष आचार्य' : 'Vedic Jyotish Acharya')}
                </h2>
                <span className="text-[10px] bg-[#25184B] border border-[#D4AF37]/30 text-[#D4AF37] px-2 py-0.5 rounded-full">
                  {session?.sessionType === 'free_intro' ? t('room.freeIntroBadge') : t('room.paidBadge')}
                </span>
              </div>
              <p className="text-[11px] text-[#D8C7A5]/70">
                {t('room.sessionNum')} #{session?.sessionNumber} • {t('room.scholarVerified')}
              </p>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center space-x-3">
            {/* Live Timer Pill */}
            {timeLeftSeconds !== null && (
              <div
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${
                  timeLeftSeconds <= 60
                    ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse'
                    : timeLeftSeconds <= 180
                    ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                    : 'bg-[#25184B] border-[#D4AF37]/50 text-[#F7DF94]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            {/* Chart toggle */}
            <button
              onClick={() => setShowChartDrawer(!showChartDrawer)}
              className="px-2.5 py-1.5 bg-[#25184B] border border-[#D4AF37]/30 text-[11px] text-[#D8C7A5] rounded-lg hover:text-[#D4AF37] flex items-center space-x-1 cursor-pointer"
            >
              <span>{language === 'mr' ? 'कुंडली' : 'Chart'}</span>
              {showChartDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* End session */}
            {session?.status === 'active' && (
              <button
                onClick={handleEndSession}
                className="text-xs text-rose-300 hover:text-rose-100 px-2 py-1 rounded border border-rose-500/30 hover:bg-rose-950/40 cursor-pointer"
                title={language === 'mr' ? 'सल्लामसलत समाप्त करा' : 'End Consultation'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Chart Drawer (Collapsible) */}
      {showChartDrawer && session?.birthChartSummary && (
        <div className="bg-[#1C1438] border-b border-[#D4AF37]/30 text-[#FDFBF7] p-4 text-xs animate-fadeIn">
          <div className="max-w-5xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-[#F7DF94] font-semibold">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t('room.chartDrawer')}: {session.birthChartSummary.fullName}</span>
              </span>
              <span>{language === 'mr' ? 'लाहिरी अयनांश' : 'Lahiri Ephemeris'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-[#120B24] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[10px] text-[#D8C7A5]/60 block">{t('kundli.lagna')}</span>
                <strong className="text-white">{translateSign(session.birthChartSummary.ascendantSign)}</strong>
              </div>
              <div className="bg-[#120B24] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[10px] text-[#D8C7A5]/60 block">{t('kundli.rashi')}</span>
                <strong className="text-white">{translateSign(session.birthChartSummary.moonSign)}</strong>
              </div>
              <div className="bg-[#120B24] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[10px] text-[#D8C7A5]/60 block">{t('kundli.nakshatra')}</span>
                <strong className="text-white">
                  {session.birthChartSummary.nakshatra} ({t('kundli.pada')} {formatNumber(session.birthChartSummary.pada)})
                </strong>
              </div>
              <div className="bg-[#120B24] p-2 rounded border border-[#D4AF37]/20">
                <span className="text-[10px] text-[#D8C7A5]/60 block">{t('form.birthPlace')}</span>
                <strong className="text-white truncate block">{session.birthChartSummary.placeOfBirth}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4 overflow-y-auto">
        {/* Error message */}
        {errorBanner && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Free message limit pill */}
        {session?.sessionType === 'free_intro' && (
          <div className="bg-[#150D2A] border border-[#D4AF37]/30 text-[#D8C7A5] text-[11px] p-2.5 rounded-xl flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t('room.freeLimitPill')}</span>
            </span>
            <span className="font-bold text-[#F7DF94]">
              {t('room.usedQuestions', {
                count: formatNumber(session.messageCount),
                max: formatNumber(session.maxMessages || 10),
              })}
            </span>
          </div>
        )}

        {/* Messages List */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <Sparkles className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto mb-2" />
            <p className="text-xs">{t('chat.connecting')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            {language === 'mr' ? 'अद्याप कोणतेही संदेश नाहीत. सुरू करण्यासाठी खाली आपला पहिला प्रश्न विचारा!' : 'No messages yet. Send your first question below to begin!'}
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.senderType === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center space-x-1 text-[10px] text-gray-400 px-1">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-[#191033] to-[#25154B] text-[#FDFBF7] border border-[#D4AF37]/30 rounded-br-none'
                      : 'bg-white text-gray-800 border border-[#D4AF37]/25 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing / Thinking indicator */}
        {sending && (
          <div className="flex items-start space-y-1">
            <div className="bg-white border border-[#D4AF37]/30 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center space-x-2 text-xs text-gray-500">
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
              <span>{t('room.thinking')}</span>
            </div>
          </div>
        )}

        {/* Concluded / Expired State Banner */}
        {isChatDisabled && (
          <div className="my-6 p-6 bg-[#150D2A] border-2 border-[#D4AF37] rounded-2xl text-center space-y-3 text-[#FDFBF7] shadow-cosmic animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-[#25184B] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#F7DF94]">
              {t('room.concludedTitle')}
            </h3>
            <p className="text-xs text-[#D8C7A5] max-w-md mx-auto">
              {isExpired ? t('room.concludedDesc') : t('room.concludedQuestions')}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/chat"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] text-[#0F0B1E] font-serif font-bold text-xs shadow-gold hover:opacity-95"
              >
                {t('room.bookPaidCta')}
              </Link>
              <Link
                href="/kundli"
                className="px-4 py-2.5 rounded-xl bg-[#25184B] border border-[#D4AF37]/40 text-[#D8C7A5] text-xs hover:text-white"
              >
                {t('room.viewKundliCta')}
              </Link>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Message Input Footer */}
      <footer className="bg-white border-t border-[#D4AF37]/25 p-3 sm:p-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              disabled={isChatDisabled || sending}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isChatDisabled ? t('room.inputDisabled') : t('room.inputPlaceholder')}
              className="flex-1 px-4 py-3 bg-[#FAF6F0] border border-[#D4AF37]/40 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder-gray-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isChatDisabled || sending}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3C64F] to-[#A67C1E] text-[#0F0B1E] font-bold text-xs shadow hover:opacity-95 disabled:opacity-40 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <span>{t('room.sendBtn')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-1.5 flex justify-between items-center text-[10px] text-gray-400 px-1">
            <span>{t('room.encryptedNotice')}</span>
            <span>{language === 'mr' ? 'पराशर सिद्धान्तावर आधारित' : 'All responses grounded in Vedic principles'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
