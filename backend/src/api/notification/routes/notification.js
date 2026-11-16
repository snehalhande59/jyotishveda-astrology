module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/notifications',
      handler: 'notification.find',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/notifications',
      handler: 'notification.create',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/notifications/:id/send',
      handler: 'notification.sendNow',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/notifications/:id',
      handler: 'notification.delete',
      config: { policies: [] },
    },
  ],
};
