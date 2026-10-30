'use strict';

const vedicEngine = require('../../../services/vedic-engine');

async function callGeminiAstrology({ message, chartSummary, history = [] }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return {
      configured: false,
      reply: null,
      message: 'Google Gemini AI engine is not configured (GEMINI_API_KEY missing in backend/.env). Please configure the key for live astrological interpretations or consult our human Acharyas.',
    };
  }

  const ascSign = chartSummary?.ascendant?.signName || 'Aries';
  const moonSign = chartSummary?.moonSign?.signName || 'Taurus';
  const nakshatra = chartSummary?.moonSign?.nakshatra || 'Rohini';
  const dasha = chartSummary?.dasha?.balanceDashaPlanet || 'Jupiter';

  const systemInstruction = `You are JyotishVeda AI, an authentic Classical Vedic Astrologer based on Maharishi Parashara's Brihat Parasara Hora Sastra (BPHS) and Jaimini Sutras.
User's Authenticated Vedic Birth Coordinates:
- Ascendant (Lagna): ${ascSign}
- Moon Sign (Chandra Rashi): ${moonSign}
- Birth Star (Nakshatra): ${nakshatra}
- Current Mahadasha: ${dasha}

Guidelines:
1. Ground your answer in Classical Parashari and Jaimini Vedic Astrology.
2. Address the user's query directly and provide practical, spiritually constructive Vedic remedies (Mantras, Daan, disciplined lifestyle).
3. Do not invent contradictory astronomical data. Be compassionate, precise, and authentic.`;

  const contents = [];
  const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
  for (const h of recentHistory) {
    contents.push({
      role: h.senderType === 'user' ? 'user' : 'model',
      parts: [{ text: h.message }],
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.statusText}`);
  }

  const data = await res.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return {
    configured: true,
    reply: replyText,
  };
}

async function findChatSession(sessionId, populate = ['astrologer', 'user']) {
  if (!sessionId) return null;
  const isNumeric = /^\d+$/.test(String(sessionId));
  if (isNumeric) {
    const byId = await strapi.entityService.findOne('api::chat-session.chat-session', parseInt(sessionId, 10), { populate });
    if (byId) return byId;
  }
  const byNumber = await strapi.entityService.findMany('api::chat-session.chat-session', {
    filters: { sessionNumber: String(sessionId) },
    populate,
    limit: 1,
  });
  return byNumber && byNumber.length > 0 ? byNumber[0] : null;
}

// Concurrency guard to prevent race conditions during session creation
const activeCreationLocks = new Set();

module.exports = {
  async getEligibility(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return {
        data: {
          isAuthenticated: false,
          isEligible: true,
          eligibleForFreeIntro: true,
          requiresAuth: true,
          hasActiveSession: false,
          freeSessionUsed: false,
          remainingSeconds: 300,
          freeMinutes: 5,
          maxMessages: 10,
          reason: 'Sign in or create a free account to claim your 5-minute complimentary introductory Vedic consultation.',
          hasChart: false,
          hasKundli: false,
          latestKundli: null,
        },
      };
    }

    const now = Date.now();

    // Check all free intro sessions for this user
    const existingSessions = await strapi.entityService.findMany('api::chat-session.chat-session', {
      filters: {
        user: user.id,
        sessionType: 'free_intro',
      },
      populate: ['astrologer'],
      sort: { createdAt: 'desc' },
    });

    // Check if an unexpired active session currently exists
    let activeSession = null;
    if (existingSessions && existingSessions.length > 0) {
      for (const s of existingSessions) {
        const expiresTime = new Date(s.expiresAt).getTime();
        if (s.status === 'active' && expiresTime > now) {
          activeSession = s;
          break;
        } else if (s.status === 'active' && expiresTime <= now) {
          await strapi.entityService.update('api::chat-session.chat-session', s.id, {
            data: { status: 'expired', endedAt: s.endedAt || s.expiresAt },
          });
        }
      }
    }

    // Check user's chart existence
    const kundlis = await strapi.entityService.findMany('api::kundli.kundli', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
      limit: 1,
    });

    const birthProfiles = await strapi.entityService.findMany('api::birth-profile.birth-profile', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
      limit: 1,
    });

    const hasChart = Boolean((kundlis && kundlis.length > 0) || (birthProfiles && birthProfiles.length > 0));

    // Case 1: Active session in progress -> allow resume across refreshes
    if (activeSession) {
      const remainingSeconds = Math.max(0, Math.floor((new Date(activeSession.expiresAt).getTime() - now) / 1000));
      return {
        data: {
          isAuthenticated: true,
          isEligible: true,
          eligibleForFreeIntro: true,
          hasActiveSession: true,
          activeSession: {
            id: activeSession.id,
            sessionNumber: activeSession.sessionNumber,
            remainingSeconds,
            durationMinutes: activeSession.durationMinutes || 5,
            startedAt: activeSession.startedAt,
            expiresAt: activeSession.expiresAt,
            astrologer: activeSession.astrologer,
          },
          freeSessionUsed: false,
          remainingSeconds,
          freeMinutes: 5,
          maxMessages: activeSession.maxMessages || 10,
          reason: 'Active 5-minute complimentary consultation in progress.',
          hasChart,
          hasKundli: hasChart,
          latestKundli: kundlis && kundlis.length > 0 ? kundlis[0] : null,
        },
      };
    }

    // Case 2: User already completed/expired their free session
    const hasUsedIntro = existingSessions && existingSessions.length > 0;
    if (hasUsedIntro) {
      return {
        data: {
          isAuthenticated: true,
          isEligible: false,
          eligibleForFreeIntro: false,
          hasActiveSession: false,
          freeSessionUsed: true,
          remainingSeconds: 0,
          freeMinutes: 0,
          reason: 'Your complimentary 5-minute introductory Vedic consultation has already been used on this account. Please select an Acharya below for a paid consultation.',
          hasChart,
          hasKundli: hasChart,
          latestKundli: kundlis && kundlis.length > 0 ? kundlis[0] : null,
          consumedAt: existingSessions[0].startedAt,
        },
      };
    }

    // Case 3: Fresh user, eligible for 5-minute free intro
    return {
      data: {
        isAuthenticated: true,
        isEligible: true,
        eligibleForFreeIntro: true,
        hasActiveSession: false,
        freeSessionUsed: false,
        reason: 'Eligible for 5-minute complimentary introductory Vedic consultation',
        freeMinutes: 5,
        remainingSeconds: 300,
        maxMessages: 10,
        hasChart,
        hasKundli: hasChart,
        latestKundli: kundlis && kundlis.length > 0 ? kundlis[0] : null,
      },
    };
  },

  async startFreeSession(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required to start complimentary session');
    }

    // Anti-duplicate click / concurrency lock
    if (activeCreationLocks.has(user.id)) {
      return ctx.badRequest('Session initialization already in progress. Please wait a moment.');
    }
    activeCreationLocks.add(user.id);

    try {
      const now = Date.now();

      // 1. Check for existing sessions
      const existingSessions = await strapi.entityService.findMany('api::chat-session.chat-session', {
        filters: {
          user: user.id,
          sessionType: 'free_intro',
        },
        populate: ['astrologer'],
        sort: { createdAt: 'desc' },
      });

      if (existingSessions && existingSessions.length > 0) {
        // If there is an active session that has not expired yet, return it to resume!
        const active = existingSessions.find(
          (s) => s.status === 'active' && new Date(s.expiresAt).getTime() > now
        );
        if (active) {
          const remainingSeconds = Math.max(0, Math.floor((new Date(active.expiresAt).getTime() - now) / 1000));
          return {
            data: {
              ...active,
              remainingSeconds,
              resumed: true,
            },
          };
        }

        return ctx.badRequest('Free introductory consultation has already been used on this account. Please select an Acharya for a paid consultation.', {
          code: 'FREE_INTRO_CONSUMED',
          freeSessionUsed: true,
        });
      }

    // 2. Fetch user's latest Kundli or birth chart
    let chartSummary = null;
    const kundlis = await strapi.entityService.findMany('api::kundli.kundli', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
      limit: 1,
    });

    if (kundlis && kundlis.length > 0) {
      chartSummary = kundlis[0].chartData;
    } else {
      const profiles = await strapi.entityService.findMany('api::birth-profile.birth-profile', {
        filters: { user: user.id },
        sort: { createdAt: 'desc' },
        limit: 1,
      });
      if (profiles && profiles.length > 0 && profiles[0].chartData) {
        chartSummary = profiles[0].chartData;
      }
    }

    if (!chartSummary) {
      chartSummary = {
        meta: { fullName: user.username },
        ascendant: { signName: 'Mesha (Aries)' },
        moonSign: { signName: 'Vrishabha (Taurus)', nakshatra: 'Rohini', pada: 1 },
        dasha: { balanceDashaPlanet: 'Guru (Jupiter)' },
      };
    }

    // 3. Select astrologer
    const body = ctx.request.body || {};
    let astrologerId = body.astrologerId;
    if (!astrologerId) {
      const astrologers = await strapi.entityService.findMany('api::astrologer.astrologer', { limit: 1 });
      if (astrologers && astrologers.length > 0) {
        astrologerId = astrologers[0].id;
      }
    }

    const astrologer = astrologerId
      ? await strapi.entityService.findOne('api::astrologer.astrologer', astrologerId)
      : null;
    const astrologerName = astrologer?.name || 'Acharya Vidyadhar Shastri';

    const startDate = new Date();
    const durationMinutes = 5;
    const expiresAt = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
    const sessionNumber = `FREE-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const session = await strapi.entityService.create('api::chat-session.chat-session', {
      data: {
        sessionNumber,
        sessionType: 'free_intro',
        status: 'active',
        durationMinutes,
        maxMessages: 10,
        messageCount: 1,
        startedAt: startDate,
        expiresAt,
        birthChartSummary: chartSummary,
        user: user.id,
        astrologer: astrologerId || null,
      },
      populate: ['astrologer', 'user'],
    });

    // Opening greeting message
    const ascSign = chartSummary?.ascendant?.signName || 'Lagna';
    const moonSign = chartSummary?.moonSign?.signName || 'Chandra';
    const nakshatra = chartSummary?.moonSign?.nakshatra || 'Nakshatra';

    const welcomeMsg = `Namaste ${user.username}! Pranam. I am ${astrologerName}. I have loaded your Vedic birth chart (Lagna: ${ascSign}, Moon: ${moonSign}, Nakshatra: ${nakshatra}). You have a 5-minute complimentary introductory consultation. Please ask your primary query regarding your career, marriage, finance, or life path.`;

    await strapi.entityService.create('api::chat-message.chat-message', {
      data: {
        session: session.id,
        senderType: 'astrologer',
        senderName: astrologerName,
        message: welcomeMsg,
        timestamp: startDate,
        metadata: {
          chartSummary: {
            ascendant: ascSign,
            moonSign,
            nakshatra,
          },
        },
      },
    });

    return {
      data: {
        ...session,
        remainingSeconds: durationMinutes * 60,
      },
    };
    } finally {
      activeCreationLocks.delete(user.id);
    }
  },

  async startPaidSession(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { bookingId, astrologerId, durationMinutes } = ctx.request.body || {};

    let booking = null;
    let astrologer = null;
    let resolvedAstrologerId = astrologerId;
    let resolvedDuration = parseInt(durationMinutes, 10) || 15;

    // 1. Check if bookingId refers to an existing consultation-booking
    if (bookingId && !isNaN(Number(bookingId))) {
      booking = await strapi.entityService.findOne('api::consultation-booking.consultation-booking', Number(bookingId), {
        populate: ['astrologer', 'user', 'payment'],
      });
    }

    if (booking) {
      if (booking.user && booking.user.id !== user.id) {
        return ctx.forbidden('Access denied to this booking');
      }
      if (booking.status !== 'confirmed') {
        return ctx.badRequest('Consultation booking has not been paid or confirmed yet. Please complete checkout.');
      }
      resolvedAstrologerId = booking.astrologer?.id || resolvedAstrologerId;
      resolvedDuration = booking.durationMinutes || resolvedDuration;
      astrologer = booking.astrologer;
    } else {
      // Direct live chat consultation with astrologer
      const targetAstroId = astrologerId || bookingId;
      if (targetAstroId && !isNaN(Number(targetAstroId))) {
        astrologer = await strapi.entityService.findOne('api::astrologer.astrologer', Number(targetAstroId));
        if (astrologer) {
          resolvedAstrologerId = astrologer.id;
        }
      }
      if (!astrologer) {
        return ctx.badRequest('Valid astrologerId or bookingId is required to start a paid consultation session');
      }
    }

    // 2. Check if an unexpired active session already exists (idempotency / resume across reloads)
    const filterQuery = booking
      ? { booking: booking.id, status: 'active' }
      : { user: user.id, astrologer: resolvedAstrologerId, sessionType: 'paid_consultation', status: 'active' };

    const existing = await strapi.entityService.findMany('api::chat-session.chat-session', {
      filters: filterQuery,
      populate: ['astrologer', 'user'],
      sort: { createdAt: 'desc' },
      limit: 1,
    });

    const now = Date.now();
    if (existing && existing.length > 0) {
      const sess = existing[0];
      const expiresAt = new Date(sess.expiresAt).getTime();
      if (expiresAt > now) {
        const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
        return {
          data: {
            ...sess,
            remainingSeconds,
          },
        };
      }
    }

    // 3. Load user's latest birth chart summary for astrologer context
    let chartSummary = null;
    const kundlis = await strapi.entityService.findMany('api::kundli.kundli', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
      limit: 1,
    });

    if (kundlis && kundlis.length > 0) {
      chartSummary = kundlis[0].chartData;
    } else {
      const profiles = await strapi.entityService.findMany('api::birth-profile.birth-profile', {
        filters: { user: user.id },
        sort: { createdAt: 'desc' },
        limit: 1,
      });
      if (profiles && profiles.length > 0 && profiles[0].chartData) {
        chartSummary = profiles[0].chartData;
      }
    }

    const startDate = new Date();
    const expiresAt = new Date(startDate.getTime() + resolvedDuration * 60 * 1000);
    const sessionNumber = `PAID-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const astrologerName = astrologer?.name || 'Senior Acharya';

    const session = await strapi.entityService.create('api::chat-session.chat-session', {
      data: {
        sessionNumber,
        sessionType: 'paid_consultation',
        status: 'active',
        durationMinutes: resolvedDuration,
        maxMessages: 100,
        messageCount: 1,
        startedAt: startDate,
        expiresAt,
        booking: booking ? booking.id : null,
        payment: booking?.payment ? booking.payment.id : null,
        user: user.id,
        astrologer: resolvedAstrologerId,
        birthChartSummary: chartSummary,
      },
      populate: ['astrologer', 'user'],
    });

    const welcomeMsg = `Pranam ${user.username}. I am ${astrologerName}. Your paid ${resolvedDuration}-minute private consultation has commenced. I have your complete birth chart and questions ready. What guidance are you seeking today?`;

    await strapi.entityService.create('api::chat-message.chat-message', {
      data: {
        session: session.id,
        senderType: 'astrologer',
        senderName: astrologerName,
        message: welcomeMsg,
        timestamp: startDate,
      },
    });

    return {
      data: {
        ...session,
        remainingSeconds: resolvedDuration * 60,
      },
    };
  },

  async sendMessage(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { sessionId } = ctx.params;
    const { message, mode = 'human' } = ctx.request.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return ctx.badRequest('Message content is required');
    }

    const session = await findChatSession(sessionId, ['user', 'astrologer']);

    if (!session) {
      return ctx.notFound('Chat session not found');
    }

    if (session.user && session.user.id !== user.id) {
      return ctx.forbidden('Access denied to this chat session');
    }

    const now = Date.now();
    const expiresAt = new Date(session.expiresAt).getTime();

    // Check expiration
    if (now >= expiresAt || session.status === 'expired' || session.status === 'completed') {
      if (session.status === 'active') {
        await strapi.entityService.update('api::chat-session.chat-session', session.id, {
          data: { status: 'expired', endedAt: new Date() },
        });
      }
      return ctx.badRequest('This consultation session has expired. Please book a consultation to continue.');
    }

    // Check message limit
    if (session.messageCount >= session.maxMessages) {
      await strapi.entityService.update('api::chat-session.chat-session', session.id, {
        data: { status: 'completed', endedAt: new Date() },
      });
      return ctx.badRequest('You have reached the maximum message limit for this session.');
    }

    // 1. Save user message
    const userMsg = await strapi.entityService.create('api::chat-message.chat-message', {
      data: {
        session: session.id,
        senderType: 'user',
        senderName: user.username,
        message: message.trim(),
        timestamp: new Date(),
      },
    });

    let astrologerReply = null;
    let newCount = session.messageCount + 1;

    // 2. Handle AI mode vs Real Human Astrologer mode
    if (mode === 'ai') {
      try {
        const history = await strapi.entityService.findMany('api::chat-message.chat-message', {
          filters: { session: session.id },
          sort: { timestamp: 'desc' },
          limit: 6,
        });

        const aiResult = await callGeminiAstrology({
          message: message.trim(),
          chartSummary: session.birthChartSummary,
          history: history.reverse(),
        });

        if (aiResult.configured && aiResult.reply) {
          astrologerReply = await strapi.entityService.create('api::chat-message.chat-message', {
            data: {
              session: session.id,
              senderType: 'astrologer',
              senderName: 'JyotishVeda AI Assistant',
              message: aiResult.reply,
              timestamp: new Date(),
            },
          });
          newCount += 1;
        } else if (!aiResult.configured) {
          // Provide authentic configuration notice without faking
          astrologerReply = {
            id: `notice-${Date.now()}`,
            senderType: 'system',
            senderName: 'System Notice',
            message: aiResult.message,
            timestamp: new Date().toISOString(),
          };
        }
      } catch (aiErr) {
        console.warn('AI astrology generation notice:', aiErr.message);
      }
    } else {
      // Human consultation mode:
      // Real astrologer session: do NOT generate fake simulated answers!
      // The user message is persisted; the consultation is live.
      astrologerReply = null;
    }

    // Update message count and check completion
    const isCompleted = newCount >= session.maxMessages;
    await strapi.entityService.update('api::chat-session.chat-session', session.id, {
      data: {
        messageCount: newCount,
        status: isCompleted ? 'completed' : 'active',
        endedAt: isCompleted ? new Date() : null,
      },
    });

    const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

    return {
      data: {
        userMessage: userMsg,
        astrologerResponse: astrologerReply,
        astrologerReply,
        remainingSeconds,
        messageCount: newCount,
        maxMessages: session.maxMessages,
        isCompleted,
        status: 'delivered',
        astrologerName: session.astrologer?.name || 'Acharya Vidyadhar',
      },
    };
  },

  async getSession(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { sessionId } = ctx.params;
    const session = await findChatSession(sessionId, ['astrologer', 'user']);

    if (!session) {
      return ctx.notFound('Session not found');
    }

    if (session.user && session.user.id !== user.id) {
      return ctx.forbidden('Access denied');
    }

    const now = Date.now();
    const expiresAt = new Date(session.expiresAt).getTime();
    let status = session.status;

    if (status === 'active' && now >= expiresAt) {
      status = 'expired';
      await strapi.entityService.update('api::chat-session.chat-session', session.id, {
        data: { status: 'expired', endedAt: new Date() },
      });
    }

    const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));

    return {
      data: {
        ...session,
        status,
        remainingSeconds,
      },
    };
  },

  async getMessages(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { sessionId } = ctx.params;
    const session = await findChatSession(sessionId, ['user']);

    if (!session) {
      return ctx.notFound('Session not found');
    }

    if (session.user && session.user.id !== user.id) {
      return ctx.forbidden('Access denied');
    }

    const messages = await strapi.entityService.findMany('api::chat-message.chat-message', {
      filters: { session: session.id },
      sort: { timestamp: 'asc' },
    });

    return {
      data: messages,
    };
  },

  async endSession(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { sessionId } = ctx.params;
    const session = await findChatSession(sessionId, ['user']);

    if (!session) {
      return ctx.notFound('Session not found');
    }

    if (session.user && session.user.id !== user.id) {
      return ctx.forbidden('Access denied');
    }

    const updated = await strapi.entityService.update('api::chat-session.chat-session', session.id, {
      data: { status: 'completed', endedAt: new Date() },
    });

    return { data: updated };
  },

  async findMySessions(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const sessions = await strapi.entityService.findMany('api::chat-session.chat-session', {
      filters: { user: user.id },
      populate: ['astrologer'],
      sort: { createdAt: 'desc' },
      limit: 20,
    });

    return { data: sessions || [] };
  },
};