'use strict';

module.exports = {
  async track(ctx) {
    try {
      const {
        eventType,
        serviceName,
        serviceCategory,
        keyword,
        targetSlug,
        userEmail: clientEmail,
        username: clientUsername,
        metadata,
      } = ctx.request.body || {};

      if (!eventType) {
        return ctx.badRequest('eventType is required');
      }

      // Check authenticated user if present
      let user = ctx.state.user;
      if (!user && ctx.request.header.authorization) {
        try {
          const token = ctx.request.header.authorization.replace(/^Bearer\s+/i, '');
          const decoded = await strapi.plugin('users-permissions').service('jwt').verify(token);
          if (decoded && decoded.id) {
            user = await strapi.entityService.findOne('plugin::users-permissions.user', decoded.id);
          }
        } catch (e) {
          // Token verification silent fail
        }
      }

      const email = user ? user.email : clientEmail || null;
      const username = user ? user.username : clientUsername || null;
      const isGuest = !email;

      const ipAddress = ctx.request.ip || ctx.ip || '127.0.0.1';
      const userAgent = ctx.request.header['user-agent'] || '';

      const record = await strapi.entityService.create('api::user-activity.user-activity', {
        data: {
          eventType: String(eventType).slice(0, 100),
          serviceName: serviceName ? String(serviceName).slice(0, 200) : null,
          serviceCategory: serviceCategory ? String(serviceCategory).slice(0, 100) : null,
          keyword: keyword ? String(keyword).slice(0, 255) : null,
          targetSlug: targetSlug ? String(targetSlug).slice(0, 255) : null,
          userEmail: email ? String(email).slice(0, 255) : null,
          username: username ? String(username).slice(0, 255) : null,
          isGuest,
          ipAddress: String(ipAddress).slice(0, 64),
          userAgent: String(userAgent).slice(0, 500),
          metadata: metadata || null,
        },
      });

      return { success: true, id: record.id };
    } catch (err) {
      strapi.log.error('Track activity error:', err);
      return ctx.internalServerError('Failed to log activity event');
    }
  },

  async getAnalytics(ctx) {
    try {
      const { range = '7days', startDate: qStart, endDate: qEnd } = ctx.query;

      const now = new Date();
      let startDate = new Date();

      if (range === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (range === 'yesterday') {
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
      } else if (range === '7days') {
        startDate.setDate(now.getDate() - 7);
      } else if (range === '30days') {
        startDate.setDate(now.getDate() - 30);
      } else if (range === 'custom' && qStart) {
        startDate = new Date(qStart);
      } else {
        startDate.setDate(now.getDate() - 7);
      }

      const endFilterDate = range === 'custom' && qEnd ? new Date(qEnd) : now;

      // Query database
      const activities = await strapi.entityService.findMany('api::user-activity.user-activity', {
        filters: {
          createdAt: {
            $gte: startDate.toISOString(),
            $lte: endFilterDate.toISOString(),
          },
        },
        sort: { createdAt: 'desc' },
        limit: 5000,
      });

      // Aggregate metrics
      const searchKeywords = {};
      const freeToolsUsed = {};
      const astrologersViewed = {};
      const paidServicesViewed = {};
      const dailyCounts = {};
      let guestCount = 0;
      let registeredCount = 0;
      let totalSearches = 0;

      for (const act of activities) {
        if (act.isGuest) guestCount++;
        else registeredCount++;

        const dayKey = act.createdAt ? act.createdAt.split('T')[0] : 'Unknown';
        dailyCounts[dayKey] = (dailyCounts[dayKey] || 0) + 1;

        if (act.eventType === 'search' && act.keyword) {
          totalSearches++;
          const kw = act.keyword.trim().toLowerCase();
          searchKeywords[kw] = (searchKeywords[kw] || 0) + 1;
        }

        if (act.serviceCategory === 'free_tool' && act.serviceName) {
          freeToolsUsed[act.serviceName] = (freeToolsUsed[act.serviceName] || 0) + 1;
        }

        if (act.serviceCategory === 'astrologer' && act.serviceName) {
          astrologersViewed[act.serviceName] = (astrologersViewed[act.serviceName] || 0) + 1;
        }

        if (act.serviceCategory === 'paid_service' && act.serviceName) {
          paidServicesViewed[act.serviceName] = (paidServicesViewed[act.serviceName] || 0) + 1;
        }
      }

      // Convert to sorted lists
      const toSortedArray = (map, limit = 10) =>
        Object.entries(map)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);

      return {
        success: true,
        data: {
          range,
          totalEvents: activities.length,
          totalSearches,
          guestCount,
          registeredCount,
          topKeywords: toSortedArray(searchKeywords, 15),
          mostUsedFreeTools: toSortedArray(freeToolsUsed, 10),
          mostViewedAstrologers: toSortedArray(astrologersViewed, 10),
          mostViewedPaidServices: toSortedArray(paidServicesViewed, 10),
          dailyTimeline: Object.entries(dailyCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date)),
          recentEvents: activities.slice(0, 50),
        },
      };
    } catch (err) {
      strapi.log.error('Analytics aggregation error:', err);
      return ctx.internalServerError('Failed to fetch analytics');
    }
  },

  async find(ctx) {
    try {
      const { page = 1, pageSize = 25, eventType, serviceCategory, userEmail } = ctx.query;
      const filters = {};
      if (eventType) filters.eventType = eventType;
      if (serviceCategory) filters.serviceCategory = serviceCategory;
      if (userEmail) filters.userEmail = { $containsi: userEmail };

      const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      const limit = parseInt(pageSize, 10);

      const [items, total] = await Promise.all([
        strapi.entityService.findMany('api::user-activity.user-activity', {
          filters,
          sort: { createdAt: 'desc' },
          start: offset,
          limit,
        }),
        strapi.entityService.count('api::user-activity.user-activity', { filters }),
      ]);

      return {
        data: items,
        meta: {
          pagination: {
            page: parseInt(page, 10),
            pageSize: limit,
            pageCount: Math.ceil(total / limit) || 1,
            total,
          },
        },
      };
    } catch (err) {
      strapi.log.error('Activity list error:', err);
      return ctx.internalServerError('Failed to list activities');
    }
  },

  async heartbeat(ctx) {
    try {
      const { sessionId, userEmail, path } = ctx.request.body || {};
      const ipAddress = ctx.request.ip || ctx.ip || '127.0.0.1';

      await strapi.entityService.create('api::user-activity.user-activity', {
        data: {
          eventType: 'heartbeat',
          serviceName: path || 'home',
          serviceCategory: 'heartbeat',
          targetSlug: sessionId || ipAddress,
          userEmail: userEmail || null,
          isGuest: !userEmail,
          ipAddress: String(ipAddress).slice(0, 64),
          userAgent: String(ctx.request.header['user-agent'] || '').slice(0, 500),
        },
      });

      return { success: true, timestamp: Date.now() };
    } catch (err) {
      return { success: true };
    }
  },

  async getLiveUsers(ctx) {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      const recentEvents = await strapi.entityService.findMany('api::user-activity.user-activity', {
        filters: {
          createdAt: { $gte: fiveMinutesAgo },
        },
        limit: 500,
        sort: { createdAt: 'desc' },
      });

      // Deduplicate sessions
      const activeSessions = new Map();
      const pageCounts = {};

      for (const ev of recentEvents) {
        const key = ev.userEmail || ev.targetSlug || ev.ipAddress;
        if (!activeSessions.has(key)) {
          activeSessions.set(key, {
            id: key,
            isGuest: ev.isGuest,
            email: ev.userEmail || 'Guest Client',
            path: ev.serviceName || '/',
            lastSeen: ev.createdAt,
          });
        }
        const p = ev.serviceName || '/';
        pageCounts[p] = (pageCounts[p] || 0) + 1;
      }

      return {
        success: true,
        data: {
          activeCount: Math.max(activeSessions.size, 1),
          registeredActive: Array.from(activeSessions.values()).filter((s) => !s.isGuest).length,
          guestActive: Array.from(activeSessions.values()).filter((s) => s.isGuest).length,
          sessions: Array.from(activeSessions.values()).slice(0, 20),
          pageBreakdown: Object.entries(pageCounts)
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count),
        },
      };
    } catch (err) {
      strapi.log.error('Live users error:', err);
      return ctx.internalServerError('Failed to fetch live users');
    }
  },
};
