'use strict';

/**
 * AI Astrology Chat Controller
 */

module.exports = {
  async chat(ctx) {
    const { message, history, birthChart, language } = ctx.request.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return ctx.badRequest('Message parameter is required and cannot be empty.');
    }

    if (message.length > 2000) {
      return ctx.badRequest('Message is too long. Maximum allowed length is 2000 characters.');
    }

    try {
      const result = await strapi.service('api::ai.ai').generateAstrologyGuidance({
        message: message.trim(),
        history: Array.isArray(history) ? history : [],
        birthChart: birthChart && typeof birthChart === 'object' ? birthChart : null,
        language: language === 'mr' ? 'mr' : 'en',
      });

      return ctx.send(result);
    } catch (err) {
      strapi.log.error('[AI Controller] Error processing chat request:', err);
      return ctx.internalServerError('Failed to process astrology query.');
    }
  },
};
