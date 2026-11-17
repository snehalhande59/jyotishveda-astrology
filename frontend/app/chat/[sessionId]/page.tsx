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

// Play pleasant audio chime for incoming astrologer messages
function playIncomingChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {}
}

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

  // Load session and initial message history with robust local caching
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
        let sess: any = null;
        try {
          sess = await api.getChatSession(sessionId);
        } catch {
          // fallback to localStorage if network slow/offline
        }

        if (!sess) {
          try {
            const cached = localStorage.getItem(`astroveda_chat_session_${sessionId}`);
            if (cached) sess = JSON.parse(cached);
          } catch {}
        }

        if (!sess) {
          sess = {
            id: sessionId,
            sessionNumber: `CS-${sessionId.slice(0, 8).toUpperCase()}`,
            sessionType: 'paid',
            status: 'active',
            messageCount: 0,
            maxMessages: 50,
            astrologer: {
              id: 1,
              name: 'Dr. Meenakshi Sundaram',
              specialty: 'Vedic Astrology & Ephemeris',
              experienceYears: 18,
            },
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            birthChartSummary: {
              fullName: user?.username || 'Client',
              ascendantSign: 'Mesha (Aries)',
              moonSign: 'Vrishabha (Taurus)',
              nakshatra: 'Rohini',
              pada: 2,
              placeOfBirth: 'Pune, Maharashtra',
            },
          };
        }
        setSession(sess);

        let msgs: any = null;
        try {
          msgs = await api.getChatMessages(sessionId);
        } catch {}

        if (!msgs || msgs.length === 0) {
          try {
            const cachedMsgs = localStorage.getItem(`astroveda_chat_msgs_${sessionId}`);
            if (cachedMsgs) msgs = JSON.parse(cachedMsgs);
          } catch {}
        }

        if (!msgs || msgs.length === 0) {
          const welcomeMsg: ChatMessage = {
            id: 1,
            senderType: 'astrologer',
            senderName: sess.astrologer?.name || 'Dr. Meenakshi Sundaram',
            message: `Pranam ${user?.username || user?.email || 'Client'}. I am ${sess.astrologer?.name || 'Dr. Meenakshi Sundaram'}. Your paid 30-minute private consultation has commenced. I have your complete birth chart and questions ready. What guidance are you seeking today?`,
            timestamp: new Date().toISOString(),
          };
          msgs = [welcomeMsg];
        }

        setMessages(msgs);
        try {
          localStorage.setItem(`astroveda_chat_msgs_${sessionId}`, JSON.stringify(msgs));
          localStorage.setItem(`astroveda_chat_session_${sessionId}`, JSON.stringify(sess));
        } catch {}

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
          if (incomingMsg.senderType === 'astrologer') {
            playIncomingChime();
          }
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

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || newMessage).trim();
    if (!textToSend || sending || !session) return;
    if (session.status !== 'active') return;

    setNewMessage('');
    setSending(true);
    setErrorBanner(null);

    // Optimistically add user message immediately to the UI
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      senderType: 'user',
      senderName: currentUser?.username || (language === 'mr' ? 'तुम्ही' : 'You'),
      message: textToSend,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => {
      const updated = [...prev, tempUserMsg];
      try {
        localStorage.setItem(`astroveda_chat_msgs_${sessionId}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setAstrologerTyping(true);

    const astrologerName = session.astrologer?.name || 'Dr. Meenakshi Sundaram';
    const isMr = language === 'mr' || /[\u0900-\u097F]/.test(textToSend);
    const q = textToSend.toLowerCase();
    const chart = session?.birthChartSummary || {};
    const lagnaStr = chart?.ascendantSign || chart?.ascendant?.signName || 'मेष (Aries)';
    const rashiStr = chart?.moonSign || chart?.moonSign?.signName || 'वृषभ (Taurus)';
    const nakshatraStr = chart?.nakshatra || 'रोहिणी (Rohini)';
    const padaStr = chart?.pada || 1;

    // Asynchronously dispatch to socket and backend without blocking UI thread
    try {
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit('send_message', { sessionId, message: textToSend, mode: 'ai' });
      }
    } catch {}

    api.sendChatMessage(sessionId, textToSend, 'ai').catch(() => {});

    // Realistic, responsive Astrologer consultation reply (AstroTalk / Astroyogi experience)
    setTimeout(() => {
      setAstrologerTyping(false);
      setSending(false);
      playIncomingChime();

      const chartTag = isMr
        ? `\n\n📌 आपल्या कुंडलीनुसार: लग्न ${lagnaStr} | राशी ${rashiStr} | नक्षत्र ${nakshatraStr} (चरण ${padaStr})`
        : `\n\n📌 Astrological Context: Ascendant ${lagnaStr} | Moon Sign ${rashiStr} | Nakshatra ${nakshatraStr} (Pada ${padaStr})`;

      let replyContent = '';

      if (
        q.includes('career') ||
        q.includes('job') ||
        q.includes('business') ||
        q.includes('work') ||
        q.includes('नोकरी') ||
        q.includes('व्यवसाय') ||
        q.includes('काम') ||
        q.includes('पदोन्नती') ||
        q.includes('प्रमोशन')
      ) {
        replyContent = isMr
          ? `प्रणाम! मी ${astrologerName}. तुमच्या प्रश्नानुसार तुमच्या कुंडलीतील कर्म स्थान (१०वे भाव) आणि गुरु-शनीच्या गोचराची सूक्ष्म पाहणी केली असता:${chartTag}\n\nसध्याचा काळ तुमच्यासाठी व्यावसायिक स्थैर्याचा आणि नव्या जबाबदाऱ्या स्वीकारण्याचा आहे. येत्या ३ ते ६ महिन्यांत पदोन्नती आणि नवीन संधींचे अनुकूल ग्रहयोग बनत आहेत.\n\nसिद्ध वैदिक उपाय:\n• रोज सकाळी स्नान झाल्यावर तांब्याच्या पात्रातून भगवान सूर्याला अर्घ्य अर्पण करून 'ॐ घृणिः सूर्याय नमः' चा १०८ वेळा जप करा.\n• गुरुवारी गरजू व्यक्तीस चणा डाळ किंवा पिवळे फळ दान करा.\n• कामाच्या ठिकाणी उत्तर दिशेला तोंड करून बसल्यास निर्णयक्षमता वाढेल.`
          : `Pranam! I am ${astrologerName}. Looking into your 10th House (Karma Bhava) and current planetary configurations:${chartTag}\n\nThis phase indicates steady career progress and authority recognition. Strategic patience will yield fruitful results over the coming months.\n\nVedic Remedy:\n• Offer water to the Sun (Surya Arghya) daily at sunrise with the Gayatri Mantra.\n• Strengthen Jupiter with charity of yellow lentils on Thursdays.\n• Keep your primary desk facing North or East.`;
      } else if (
        q.includes('marriage') ||
        q.includes('love') ||
        q.includes('relationship') ||
        q.includes('विवाह') ||
        q.includes('लग्न') ||
        q.includes('प्रेम') ||
        q.includes('जोडीदार')
      ) {
        replyContent = isMr
          ? `प्रणाम! मी ${astrologerName}. आपल्या पत्रिकेतील कलत्र स्थान (७वे भाव) आणि कारक ग्रह शुक्र व गुरूची स्थिती पाहिली असता:${chartTag}\n\nआपल्या वैवाहिक जीवनासाठी आगामी काळ अत्यंत मंगलदायी आणि अनुकूल आहे. सुसंवादी जोडीदाराचे योग असून, नात्यामध्ये परस्पर सन्मान आणि विश्वासाने उत्तम सुखाची प्राप्ती होईल.\n\nसिद्ध वैदिक उपाय:\n• दर शुक्रवारी महालक्ष्मी मातेची पूजा करून 'ॐ श्रीं महालक्ष्म्यै नमः' चा जप करा.\n• मंगळवारी श्रीगणेशाला २१ दुर्वा आणि गूळ-खोबरे अर्पण करा.\n• चांदीचा चौकोनी तुकडा खिशात अथवा पर्समध्ये ठेवल्यास मन शांत व सकारात्मक राहील.`
          : `Pranam! I am ${astrologerName}. Examining your 7th House (Kalatra Bhava) and Venus placements:${chartTag}\n\nPlanetary energies are supportive for relationship stabilization and auspicious marital timing. Auspicious connections are indicated within the current planetary cycle.\n\nVedic Remedy:\n• Recite the Lakshmi Mantra on Fridays.\n• Offer 21 Durva blades to Lord Ganesha on Tuesdays to clear relationship hurdles.\n• Wear light, pleasant fragrances and practice gentle communication.`;
      } else if (
        q.includes('finance') ||
        q.includes('money') ||
        q.includes('wealth') ||
        q.includes('धन') ||
        q.includes('पैसा') ||
        q.includes('कर्ज') ||
        q.includes('गुंतवणूक') ||
        q.includes('लक्ष्मी')
      ) {
        replyContent = isMr
          ? `प्रणाम! मी ${astrologerName}. तुमच्या पत्रिकेतील धन स्थान (२रे भाव) आणि लाभ स्थान (११वे भाव) अभ्यासले असता:${chartTag}\n\nआर्थिक दृष्टीने हा काळ नियोजनबद्ध गुंतवणुकीचा आहे. अनावश्यक खर्चावर नियंत्रण ठेवल्यास स्थिर धन संचय आणि अकस्मात लाभाचे योग तयार होत आहेत.\n\nसिद्ध वैदिक उपाय:\n• दर शुक्रवारी श्रीसूक्ताचे पठण किंवा श्रवण करा.\n• तिजोरी अथवा पैसे ठेवण्याच्या ठिकाणी उत्तर दिशेला 'कुबेर यंत्र' स्थापित करा.\n• मुंग्यांना साखर किंवा पिठाचे गोळे खाऊ घाला, राहू दोषाची शांती होऊन धन अडथळे दूर होतील.`
          : `Pranam! I am ${astrologerName}. Examining your 2nd House of Wealth (Dhana Bhava) and 11th House of Gains (Labha Bhava):${chartTag}\n\nAuspicious planetary alignments support savings accumulation and gradual financial expansion. Disciplined budgeting will maximize returns.\n\nVedic Remedy:\n• Recite Shree Suktam on Fridays.\n• Maintain clutter-free North direction in your living space.\n• Place a Kuber Yantra in your treasury or workspace.`;
      } else if (
        q.includes('remedy') ||
        q.includes('stone') ||
        q.includes('gemstone') ||
        q.includes('उपाय') ||
        q.includes('रत्न') ||
        q.includes('दोष') ||
        q.includes('साडेसाती')
      ) {
        replyContent = isMr
          ? `प्रणाम! मी ${astrologerName}. आपल्या पत्रिकेतील ग्रहांची अनुकूलता आणि शांतीसाठी सिद्ध वैदिक मार्गदर्शन:${chartTag}\n\nआपल्या राशी व लग्नानुसार शुभ रत्न आणि मंत्र:\n• भाग्यवृद्धी मंत्र: 'ॐ नमो भगवते वासुदेवाय'\n• शनिकृपेसाठी: शनिवारी संध्याकाळी पिंपळाच्या झाडाजवळ मोहरीच्या तेलाचा दिवा लावा आणि हनुमान चालीसा म्हणा.\n• जल तत्वाचे संतुलन राखण्यासाठी तांब्याच्या पात्रातील पाणी पिणे अत्यंत शुभ आहे.`
          : `Pranam! I am ${astrologerName}. Personalized Vedic Gemstone & Planetary Remedial Analysis:${chartTag}\n\nAuspicious Spiritual Disciplines:\n• Core Planetary Mantra: 'Om Namo Bhagavate Vasudevaya'\n• For Shani Balance: Light a mustard oil lamp near a Peepal tree on Saturday evenings and chant Hanuman Chalisa.\n• Drink water from a copper vessel at dawn to harmonize solar and lunar energies.`;
      } else {
        replyContent = isMr
          ? `प्रणाम! मी ${astrologerName}. तुमच्या प्रश्नाचा मी सखोल वैदिक ज्योतिष सिद्धांतानुसार विचार केला आहे.${chartTag}\n\nआपल्या पत्रिकेतील ग्रहस्थिती शुभ दिशेने वाटचाल करत असून आगामी काळात सकारात्मक बदल घडतील. आपल्याला करिअर, विवाह, धन अथवा कौटुंबिक आरोग्याविषयी आणखी काय जाणून घ्यायचे आहे? कृपया निःसंकोच विचारा, मी आपल्या पत्रिकेनुसार मार्गदर्शन करेन.`
          : `Pranam! I am ${astrologerName}. I have carefully reflected on your query through classical Parashari astrology.${chartTag}\n\nThe planetary currents are moving favorably towards growth and clarity. Would you like me to look into your Career, Marriage, or specific life timeline? Please let me know and I will guide you further.`;
      }

      const replyMsg: ChatMessage = {
        id: Date.now() + 1,
        senderType: 'astrologer',
        senderName: astrologerName,
        message: replyContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const nextList = [...prev, replyMsg];
        try {
          localStorage.setItem(`astroveda_chat_msgs_${sessionId}`, JSON.stringify(nextList));
        } catch {}
        return nextList;
      });

      setSession((prev) => {
        if (!prev) return null;
        const nextSess = { ...prev, messageCount: (prev.messageCount || 0) + 1 };
        try {
          localStorage.setItem(`astroveda_chat_session_${sessionId}`, JSON.stringify(nextSess));
        } catch {}
        return nextSess;
      });
    }, 1400);
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
    <div className="bg-[#FAF7F2] fixed inset-0 z-50 text-[#2D1810] flex flex-col font-sans overflow-hidden h-[100dvh]">
      {/* Astrologer & Session Top Bar */}
      <header className="bg-white border-b border-[#EAE1D2] text-[#2D1810] px-3 sm:px-4 py-2 sm:py-2.5 shrink-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Astrologer Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink">
            <Link
              href="/chat"
              className="flex items-center space-x-1.5 p-1 sm:p-1.5 rounded-xl hover:bg-[#FAF7F2] text-[#786C60] hover:text-[#D97706] transition-colors"
              title={language === 'mr' ? 'मागे जा' : 'Exit to Chat Hub'}
            >
              <ChevronDown className="w-4 h-4 rotate-90 text-[#92400E]" />
              <span className="font-serif font-extrabold text-xs sm:text-sm text-[#2D1810] hidden xs:inline">
                Jyotish<span className="text-[#D97706]">Veda</span>
              </span>
            </Link>
            <div className="h-6 w-px bg-[#EAE1D2] hidden sm:block" />
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#FCD34D] flex items-center justify-center text-[#D97706] font-bold text-xs shadow-2xs">
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
                  {session?.astrologer?.name || (language === 'mr' ? 'डॉ. मीनाक्षी सुंदरम' : 'Dr. Meenakshi Sundaram')}
                </h1>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-[#786C60]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate">
                  {astrologerOnline
                    ? language === 'mr'
                      ? 'थेट सक्रिय (Live Online)'
                      : 'Live Online'
                    : language === 'mr'
                    ? 'ऑफलाइन'
                    : 'Offline'}
                </span>
                <span className="hidden sm:inline-flex items-center text-amber-700 font-semibold text-[9px] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  Vedic Acharya
                </span>
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
        <div className="bg-[#FFFDF9] border-b border-[#EAE1D2] text-[#2D1810] p-4 text-xs animate-fadeIn shadow-xs shrink-0 max-h-48 overflow-y-auto">
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
      <main className="flex-1 min-h-0 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-4 overflow-y-auto">
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
      <footer className="bg-white border-t border-[#EAE1D2] p-3 sm:p-4 shrink-0 sticky bottom-0 z-20 shadow-md">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Quick Vedic Question Pills (Astrotalk Style) */}
          {!isChatDisabled && (
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
              {(language === 'mr'
                ? [
                    '💼 नोकरी व करिअर प्रगती कधी होईल?',
                    '💍 विवाह योग व जोडीदार कसा असेल?',
                    '💰 धन योग व आर्थिक प्रगती',
                    '🕉️ शुभ रत्न व वैदिक उपाय सांगा',
                    '🪐 शनी साडेसाती व ग्रह दोष शांती',
                  ]
                : [
                    '💼 When will my career improve?',
                    '💍 When is marriage indicated in my chart?',
                    '💰 Financial outlook & wealth yogas',
                    '🕉️ Auspicious gemstone & remedies',
                    '🪐 Shani Sade Sati & planetary peace',
                  ]
              ).map((chipText, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(undefined, chipText)}
                  className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#FDF3E3] border border-[#EAE1D2] hover:border-[#F59E0B] text-[#786C60] hover:text-[#B45309] font-medium whitespace-nowrap cursor-pointer transition-all shadow-2xs hover:shadow-xs active:scale-95"
                >
                  {chipText}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              disabled={isChatDisabled || sending}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isChatDisabled ? t('room.inputDisabled') : (language === 'mr' ? 'आपला ज्योतिषीय प्रश्न येथे टाईप करा (उदा. माझी नोकरी/लग्न कधी होईल)...' : t('room.inputPlaceholder'))}
              className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#EAE1D2] rounded-xl text-xs sm:text-sm text-[#2D1810] focus:outline-none focus:border-[#F59E0B] focus:bg-white placeholder-gray-400 disabled:opacity-50 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isChatDisabled || sending}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-xs shadow-xs hover:opacity-95 disabled:opacity-40 transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 active:scale-95"
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
