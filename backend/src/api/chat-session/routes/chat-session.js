'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/chat/eligibility',
      handler: 'chat-session.getEligibility',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/chat/start-free-session',
      handler: 'chat-session.startFreeSession',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/chat/start-paid-session',
      handler: 'chat-session.startPaidSession',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/chat/sessions/:sessionId',
      handler: 'chat-session.getSession',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/chat/sessions/:sessionId/messages',
      handler: 'chat-session.sendMessage',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/chat/sessions/:sessionId/messages',
      handler: 'chat-session.getMessages',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/chat/sessions/:sessionId/end',
      handler: 'chat-session.endSession',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/chat/my-sessions',
      handler: 'chat-session.findMySessions',
      config: {
        policies: [],
      },
    },
  ],
};
