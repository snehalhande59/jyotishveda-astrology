'use strict';

const vedicEngine = require('../../../services/vedic-engine');

function generateAstrologerReply(userMessage, chartSummary, astrologerName = 'Acharya Vidyadhar') {
  const msg = (userMessage || '').toLowerCase();
  const asc = chartSummary?.ascendant?.signName || 'Lagna';
  const moon = chartSummary?.moonSign?.signName || 'Chandra';
  const nak = chartSummary?.moonSign?.nakshatra || 'Nakshatra';
  const dasha = chartSummary?.dasha?.balanceDashaPlanet || 'Governing';

  if (msg.includes('career') || msg.includes('job') || msg.includes('promotion') || msg.includes('business')) {
    return `Observing your ${asc} Lagna and 10th House (Karma Bhava): You have favorable planetary currents under the ${dasha} Dasha influence. A significant career breakthrough or promotion window opens up when Jupiter transits your 10th or 11th house. Focus on consistent effort, and offer Arghya to Surya at sunrise for professional advancement.`;
  }

  if (msg.includes('marriage') || msg.includes('love') || msg.includes('relationship') || msg.includes('spouse') || msg.includes('partner')) {
    return `Looking at your 7th House (Kalatra Bhava) and Venus placements from ${moon} Rashi: Marital harmony is protected when mutual communication is clear. The ${dasha} Dasha indicates positive relationship events, especially during favorable Jupiter-Venus aspects. Reciting the Shukra Beej Mantra on Fridays will harmonize any minor discord.`;
  }

  if (msg.includes('money') || msg.includes('wealth') || msg.includes('finance') || msg.includes('investment') || msg.includes('debt')) {
    return `Evaluating your 2nd House (Dhana Bhava) and 11th House (Labha Bhava): Your chart indicates sustained wealth accumulation capabilities. Periods of high planetary strength favor disciplined investments. Avoid speculative risks during Rahu Kaalam, and consider worshipping Mahalakshmi on Fridays for financial stability.`;
  }

  if (msg.includes('gemstone') || msg.includes('rudraksha') || msg.includes('remedy') || msg.includes('remedies') || msg.includes('mantra')) {
    return `As per your ${asc} Lagna and birth constellation ${nak}: Your functional benefic planet is supportive. Wearing a consecrated 5-Mukhi Rudraksha or the gemstone of your 9th Lord (Bhagyesh) after proper Pran Pratishtha will strengthen your planetary vitality.`;
  }

  return `In Vedic astrology, your ${asc} Ascendant with Moon in ${moon} (${nak}) grants you keen spiritual intuition and resilience. Under the current ${dasha} planetary period, your karmic efforts will yield meaningful rewards. Keep your focus steady and maintain daily spiritual balance. Feel free to ask more specifics regarding any area of your life.`;
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

module.exports = {
  async getEligibility(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required to check free chat eligibility');
    }

    // Check if user has already consumed any free intro chat session
    const existingSessions = await strapi.entityService.findMany('api::chat-session.chat-session', {
      filters: {
        user: user.id,
        sessionType: 'free_intro',
      },
      limit: 1,
    });

    const isEligible = !existingSessions || existingSessions.length === 0;

    // Check if user has generated a birth chart
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

    return {
      data: {
        isEligible,
        eligibleForFreeIntro: isEligible,
        freeSessionUsed: !isEligible,
        reason: isEligible
          ? 'Eligible for 5-minute complimentary introductory Vedic consultation'
          : 'First free introductory consultation has already been consumed on this account.',
        freeMinutes: 5,
        maxMessages: 10,
        hasChart,
        hasKundli: hasChart,
        latestKundli: kundlis && kundlis.length > 0 ? kundlis[0] : null,
        consumedAt: !isEligible ? existingSessions[0].startedAt : null,
      },
    };
  },

  async startFreeSession(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    // 1. Strict backend eligibility verification (never rely on frontend)
    const existingSessions = await strapi.entityService.findMany('api::chat-session.chat-session', {
      filters: {
        user: user.id,
        sessionType: 'free_intro',
      },
      limit: 1,
    });

    if (existingSessions && existingSessions.length > 0) {
      return ctx.badRequest('Free introductory consultation has already been used on this account. Please select an Acharya for a paid consultation.');
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

    // Default chart summary if not yet calculated
    if (!chartSummary) {
      chartSummary = {
        meta: { fullName: user.username },
        ascendant: { signName: 'Mesha (Aries)' },
        moonSign: { signName: 'Vrishabha (Taurus)', nakshatra: 'Rohini', pada: 1 },
        dasha: { balanceDashaPlanet: 'Guru (Jupiter)' },
      };
    }

    // 3. Select astrologer (prefer selected astrologer or online Acharya)
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

    const now = new Date();
    const durationMinutes = 5;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
    const sessionNumber = `FREE-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const session = await strapi.entityService.create('api::chat-session.chat-session', {
      data: {
        sessionNumber,
        sessionType: 'free_intro',
        status: 'active',
        durationMinutes,
        maxMessages: 10,
        messageCount: 1,
        startedAt: now,
        expiresAt,
        birthChartSummary: chartSummary,
        user: user.id,
        astrologer: astrologerId || null,
      },
      populate: ['astrologer', 'user'],
    });

    // Create introductory opening message from astrologer
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
        timestamp: now,
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
  },

  async startPaidSession(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { bookingId, astrologerId } = ctx.request.body || {};
    if (!bookingId) {
      return ctx.badRequest('bookingId is required to start a paid consultation session');
    }

    const booking = await strapi.entityService.findOne('api::consultation-booking.consultation-booking', bookingId, {
      populate: ['astrologer', 'user', 'payment'],
    });

    if (!booking) {
      return ctx.notFound('Booking not found');
    }

    if (booking.user && booking.user.id !== user.id) {
      return ctx.forbidden('Access denied to this booking');
    }

    // Verify booking is confirmed/paid
    if (booking.status !== 'confirmed') {
      return ctx.badRequest('Consultation booking has not been paid or confirmed yet. Please complete checkout.');
    }

    // Check if session already active for this booking
    const existing = await strapi.entityService.findMany('api::chat-session.chat-session', {
      filters: { booking: booking.id },
      populate: ['astrologer', 'user'],
      limit: 1,
    });

    if (existing && existing.length > 0) {
      const sess = existing[0];
      const now = Date.now();
      const expiresAt = new Date(sess.expiresAt).getTime();
      const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
      return {
        data: {
          ...sess,
          remainingSeconds,
        },
      };
    }

    const now = new Date();
    const duration = booking.durationMinutes || 30;
    const expiresAt = new Date(now.getTime() + duration * 60 * 1000);
    const sessionNumber = `PAID-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const astrologerName = booking.astrologer?.name || 'Senior Acharya';

    const session = await strapi.entityService.create('api::chat-session.chat-session', {
      data: {
        sessionNumber,
        sessionType: 'paid_consultation',
        status: 'active',
        durationMinutes: duration,
        maxMessages: 100,
        messageCount: 1,
        startedAt: now,
        expiresAt,
        booking: booking.id,
        payment: booking.payment ? booking.payment.id : null,
        user: user.id,
        astrologer: booking.astrologer ? booking.astrologer.id : astrologerId || null,
      },
      populate: ['astrologer', 'user'],
    });

    const welcomeMsg = `Pranam ${user.username}. I am ${astrologerName}. Your paid ${duration}-minute private consultation has commenced. I have your complete birth chart and questions ready. What guidance are you seeking today?`;

    await strapi.entityService.create('api::chat-message.chat-message', {
      data: {
        session: session.id,
        senderType: 'astrologer',
        senderName: astrologerName,
        message: welcomeMsg,
        timestamp: now,
      },
    });

    return {
      data: {
        ...session,
        remainingSeconds: duration * 60,
      },
    };
  },

  async sendMessage(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { sessionId } = ctx.params;
    const { message } = ctx.request.body || {};

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

    // 2. Generate and save personalized Astrologer reply
    const astrologerName = session.astrologer?.name || 'Acharya Vidyadhar';
    const replyText = generateAstrologerReply(message.trim(), session.birthChartSummary, astrologerName);

    const replyMsg = await strapi.entityService.create('api::chat-message.chat-message', {
      data: {
        session: session.id,
        senderType: 'astrologer',
        senderName: astrologerName,
        message: replyText,
        timestamp: new Date(Date.now() + 500),
      },
    });

    // Update message count
    const updatedCount = session.messageCount + 2;
    const isCompleted = updatedCount >= session.maxMessages;

    await strapi.entityService.update('api::chat-session.chat-session', session.id, {
      data: {
        messageCount: updatedCount,
        status: isCompleted ? 'completed' : 'active',
        endedAt: isCompleted ? new Date() : null,
      },
    });

    const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

    return {
      data: {
        userMessage: userMsg,
        astrologerResponse: replyMsg,
        astrologerReply: replyMsg,
        remainingSeconds,
        messageCount: updatedCount,
        maxMessages: session.maxMessages,
        isCompleted,
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
};
