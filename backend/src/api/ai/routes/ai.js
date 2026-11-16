'use strict';

/**
 * AI Astrology Routes
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/ai/chat',
      handler: 'ai.chat',
      config: {
        policies: [],
        auth: false, // Accessible to all authenticated and public seekers seeking divine guidance
      },
    },
  ],
};
