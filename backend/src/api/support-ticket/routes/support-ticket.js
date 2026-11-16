module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/support-tickets',
      handler: 'support-ticket.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/support-tickets/:id',
      handler: 'support-ticket.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/support-tickets',
      handler: 'support-ticket.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/support-tickets/:id',
      handler: 'support-ticket.update',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/support-tickets/:id/reply',
      handler: 'support-ticket.addReply',
      config: { policies: [] },
    },
  ],
};
