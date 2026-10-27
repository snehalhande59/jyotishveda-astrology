module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/reports/me',
      handler: 'astrology-report.findMe',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/reports/generate',
      handler: 'astrology-report.generate',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/reports/:id',
      handler: 'astrology-report.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/reports',
      handler: 'astrology-report.find',
      config: {
        policies: [],
      },
    },
  ],
};
