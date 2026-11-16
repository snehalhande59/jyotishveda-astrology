'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { getSocket } from '@/lib/socket';
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
  Wifi,
  WifiOff,
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
  const [astrologerTyping, setAstrologerTyping] = useState(false);
  const [astrologerOnline, setAstrologerOnline] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, astrologerTyping, scrollToBottom]);

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
        setErrorBanner(
          err.message ||
            (language === 'mr'
              ? 'चॅट सत्र लोड करता आले नाही.'
              : 'Unable to load chat session.')
        );
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId, router, language]);

  // Real-Time Socket.IO Integration
  useEffect(() => {
    if (!sessionId || !currentUser) return;

    let socket: any = null;
    try {
      socket = getSocket();
      setSocketConnected(socket.connected);

      const onConnect = () => {
        setSocketConnected(true);
        socket.emit('join_session', { sessionId }, (res: any) => {
          if (res?.success) {
            console.log('⚡ [Socket.IO] Joined room for session:', sessionId);
          }
        });
      };

      const onDisconnect = () => {
        setSocketConnected(false);
      };

      const onNewMessage = (incomingMsg: any) => {
        if (!incomingMsg) return;
        setMessages((prev) => {
          // Deduplicate message by id or unique timestamp+content
          const exists = prev.some(
            (m) =>
              (m.id && incomingMsg.id && m.id === incomingMsg.id) ||
              (m.timestamp === incomingMsg.timestamp && m.message === incomingMsg.message)
          );
          if (exists) return prev;
          return [...prev, incomingMsg];
        });
        setAstrologerTyping(false);
      };

      const onUserTyping = (data: { senderName: string; isTyping: boolean }) => {
        if (data.senderName !== currentUser?.username) {
          setAstrologerTyping(Boolean(data.isTyping));
        }
      };

      const onUserStatus = (data: { role: string; status: string }) => {
        if (data.role === 'astrologer') {
          setAstrologerOnline(data.status === 'online');
        }
      };

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('new_message', onNewMessage);
      socket.on('user_typing', onUserTyping);
      socket.on('user_status', onUserStatus);

      if (socket.connected) {
        onConnect();
      }

      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('new_message', onNewMessage);
        socket.off('user_typing', onUserTyping);
        socket.off('user_status', onUserStatus);
      };
    } catch (socketErr) {
      console.warn('Socket.IO connection notice:', socketErr);
    }
  }, [sessionId, currentUser]);

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

  // Resilient fallback HTTP polling (every 6 seconds if active)
  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const pollInterval = setInterval(async () => {
      try {
        const msgs = await api.getChatMessages(sessionId);
        if (msgs && msgs.length > messages.length) {
          setMessages(msgs);
        }
      } catch (e) {
        // silent fallback poll fail
      }
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [sessionId, session, messages.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    try {
      const socket = getSocket();
      socket.emit('typing', { sessionId, isTyping: true });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        try {
          socket.emit('typing', { sessionId, isTyping: false });
        } catch {}
      }, 2000);
    } catch {}
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !session) return;
    if (session.status !== 'active') return;

    const userText = newMessage.trim();
    setNewMessage('');
    setSending(true);
    setErrorBanner(null);

    // Optimistically add user message immediately to the UI
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      senderType: 'user',
      senderName: currentUser?.username || (language === 'mr' ? 'तुम्ही' : 'You'),
      message: userText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      // 1. Try sending via Socket.IO for real-time speed
      let sentViaSocket = false;
      try {
        const socket = getSocket();
        if (socket && socket.connected) {
          socket.emit(
            'send_message',
            { sessionId, message: userText, mode: session.sessionType === 'free_intro' ? 'ai' : 'human' },
            (ack: any) => {
              if (ack?.success && ack?.astrologerResponse) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === ack.astrologerResponse.id)) return prev;
                  return [...prev, ack.astrologerResponse];
                });
              }
            }
          );
          sentViaSocket = true;
        }
      } catch {}

      // 2. Also ensure REST persistence / fallback if socket is disconnected
      if (!sentViaSocket) {
        const res = await api.sendChatMessage(sessionId, userText);
        const astrologerMsg = res?.astrologerResponse || (res as any)?.astrologerReply;
        if (astrologerMsg) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === astrologerMsg.id)) return prev;
            return [...prev, astrologerMsg];
          });
        }
      }

      setSession((prev) => (prev ? { ...prev, messageCount: prev.messageCount + 1 } : null));
    } catch (err: any) {
      setErrorBanner(
        err.message ||
          (language === 'mr'
            ? 'संदेश पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा.'
            : 'Message delivery failed. Please retry.')
      );
    } finally {
      setSending(false);
    }
  };

  const handleEndSession = async () => {
    if (
      !confirm(
        language === 'mr'
          ? 'आपण ही ज्योतिष सल्लामसलत समाप्त करू इच्छिता?'
          : 'Are you sure you want to end this astrological consultation?'
      )
    )
      return;
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
    <div className="bg-[#FAF7F2] min-h-screen text-[#2D1810] flex flex-col font-sans">
      {/* Astrologer & Session Top Bar */}
      <header className="bg-white border-b border-[#EAE1D2] text-[#2D1810] px-3 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Astrologer Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink">
            <Link
              href="/chat"
              className="text-xs text-[#786C60] hover:text-[#D97706] transition-colors p-1"
              title={language === 'mr' ? 'मागे जा' : 'Go back'}
            >
              <MessageSquare className="w-4 h-4" />
            </Link>
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] font-bold text-xs shadow-2xs">
                {session?.astrologer?.name?.charAt(0) || 'A'}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  astrologerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
                title={astrologerOnline ? 'Online' : 'Offline'}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="font-serif text-xs sm:text-sm font-bold text-[#2D1810] truncate max-w-[140px] sm:max-w-[200px]">
                  {session?.astrologer?.name || (language === 'mr' ? 'ज्योतिष आचार्य' : 'Vedic Scholar')}
                </h1>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-[#786C60]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate">
                  {astrologerOnline
                    ? language === 'mr'
                      ? 'थेट सक्रिय'
                      : 'Live Online'
                    : language === 'mr'
                    ? 'ऑफलाइन'
                    : 'Offline'}
                </span>
                {socketConnected && (
                  <span className="hidden sm:inline-flex items-center text-emerald-600 font-semibold text-[9px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Realtime
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Session Badges & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Timer Pill */}
            {timeLeftSeconds !== null && (
              <div
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-mono font-bold transition-colors ${
                  timeLeftSeconds <= 60
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : timeLeftSeconds <= 180
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                }`}
              >
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D97706]" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            {/* Chart toggle */}
            <button
              onClick={() => setShowChartDrawer(!showChartDrawer)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#FAF7F2] border border-[#EAE1D2] text-[11px] sm:text-xs font-bold text-[#4A2E18] rounded-xl hover:border-[#F59E0B] flex items-center space-x-1 cursor-pointer"
            >
              <span>{language === 'mr' ? 'कुंडली' : 'Chart'}</span>
              {showChartDrawer ? (
                <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              )}
            </button>

            {/* End session */}
            {session?.status === 'active' && (
              <button
                onClick={handleEndSession}
                className="text-[11px] sm:text-xs text-rose-700 hover:text-rose-900 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 cursor-pointer transition-colors"
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
        <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] text-[#2D1810] p-4 text-xs animate-fadeIn shadow-xs">
          <div className="max-w-5xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-[#2D1810] font-bold">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>
                  {t('room.chartDrawer')}: {session.birthChartSummary.fullName || currentUser?.username}
                </span>
              </span>
              <span className="text-[#D97706] font-mono text-[11px]">
                {language === 'mr' ? 'लाहिरी अयनांश' : 'Lahiri Ephemeris'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-white p-2.5 rounded-xl border border-[#EAE1D2]">
                <span className="text-[10px] text-[#786C60] block font-semibold">{t('kundli.lagna')}</span>
                <strong className="text-[#2D1810]">
                  {translateSign(session.birthChartSummary.ascendantSign || session.birthChartSummary.ascendant?.signName || 'Mesha')}
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAE1D2]">
                <span className="text-[10px] text-[#786C60] block font-semibold">{t('kundli.rashi')}</span>
                <strong className="text-[#2D1810]">
                  {translateSign(session.birthChartSummary.moonSign || session.birthChartSummary.moonSign?.signName || 'Vrishabha')}
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAE1D2]">
                <span className="text-[10px] text-[#786C60] block font-semibold">{t('kundli.nakshatra')}</span>
                <strong className="text-[#2D1810]">
                  {session.birthChartSummary.nakshatra || 'Rohini'} ({t('kundli.pada')}{' '}
                  {formatNumber(session.birthChartSummary.pada || 1)})
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAE1D2]">
                <span className="text-[10px] text-[#786C60] block font-semibold">{t('form.birthPlace')}</span>
                <strong className="text-[#2D1810] truncate block">
                  {session.birthChartSummary.placeOfBirth || session.birthChartSummary.place || 'India'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4 overflow-y-auto">
        {/* Error message */}
        {errorBanner && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Free message limit pill */}
        {session?.sessionType === 'free_intro' && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[11px] p-3 rounded-2xl flex items-center justify-between shadow-2xs">
            <span className="flex items-center space-x-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{t('room.freeLimitPill')}</span>
            </span>
            <span className="font-bold text-[#B45309]">
              {t('room.usedQuestions', {
                count: formatNumber(session.messageCount),
                max: formatNumber(session.maxMessages || 10),
              })}
            </span>
          </div>
        )}

        {/* Messages List */}
        {loading ? (
          <div className="py-20 text-center text-[#786C60]">
            <Sparkles className="w-6 h-6 text-[#D97706] animate-spin mx-auto mb-2" />
            <p className="text-xs">{t('chat.connecting')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center text-[#786C60] text-xs">
            {language === 'mr'
              ? 'अद्याप कोणतेही संदेश नाहीत. सुरू करण्यासाठी खाली आपला पहिला प्रश्न विचारा!'
              : 'No messages yet. Send your first question below to begin!'}
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.senderType === 'user';
            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center space-x-1 text-[10px] text-[#786C60] px-1">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span>•</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-br-none'
                      : 'bg-white text-[#2D1810] border border-[#EAE1D2] rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}

        {/* Real-time Astrologer Typing Indicator */}
        {astrologerTyping && (
          <div className="flex items-start space-y-1 animate-fadeIn">
            <div className="bg-white border border-[#EAE1D2] rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center space-x-2 text-xs text-[#786C60]">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-[#D97706] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#D97706] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#D97706] rounded-full animate-bounce" />
              </div>
              <span className="text-[11px] font-medium text-[#786C60]">
                {language === 'mr' ? 'आचार्य टायपिंग करत आहेत...' : 'Acharya is typing...'}
              </span>
            </div>
          </div>
        )}

        {/* Sending indicator */}
        {sending && !astrologerTyping && (
          <div className="flex items-start space-y-1">
            <div className="bg-white border border-[#EAE1D2] rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center space-x-2 text-xs text-[#786C60]">
              <Sparkles className="w-4 h-4 text-[#D97706] animate-spin" />
              <span>{t('room.thinking')}</span>
            </div>
          </div>
        )}

        {/* Concluded / Expired State Banner */}
        {isChatDisabled && (
          <div className="my-6 p-6 sm:p-8 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#FDE68A] rounded-3xl text-center space-y-3 text-[#2D1810] shadow-sm animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] flex items-center justify-center mx-auto shadow-2xs">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2D1810]">{t('room.concludedTitle')}</h3>
            <p className="text-xs text-[#6B5A4E] max-w-md mx-auto leading-relaxed">
              {isExpired ? t('room.concludedDesc') : t('room.concludedQuestions')}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/chat"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-serif font-bold text-xs shadow-xs hover:opacity-95"
              >
                {t('room.bookPaidCta')}
              </Link>
              <Link
                href="/kundli"
                className="px-4 py-2.5 rounded-xl bg-white border border-[#EAE1D2] text-[#4A2E18] text-xs font-bold hover:bg-[#FAF7F2]"
              >
                {t('room.viewKundliCta')}
              </Link>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Message Input Footer */}
      <footer className="bg-white border-t border-[#EAE1D2] p-3 sm:p-4 sticky bottom-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              disabled={isChatDisabled || sending}
              onChange={handleInputChange}
              placeholder={isChatDisabled ? t('room.inputDisabled') : t('room.inputPlaceholder')}
              className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs sm:text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white placeholder-gray-400 disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isChatDisabled || sending}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-xs shadow-xs hover:opacity-95 disabled:opacity-40 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <span>{t('room.sendBtn')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-1.5 flex justify-between items-center text-[10px] text-[#786C60] px-1">
            <span>{t('room.encryptedNotice')}</span>
            <span>
              {language === 'mr'
                ? 'वैदिक सिद्धांतांवर आधारित आणि सुरक्षित'
                : 'All responses grounded in Vedic principles'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
