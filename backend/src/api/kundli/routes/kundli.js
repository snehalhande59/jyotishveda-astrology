module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/kundli/generate',
      handler: 'kundli.generate',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/kundli/panchang',
      handler: 'kundli.calculatePanchang',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/kundli/panchang',
      handler: 'kundli.calculatePanchang',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/kundli/compatibility',
      handler: 'kundli.calculateCompatibility',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/kundli/compatibility',
      handler: 'kundli.calculateCompatibility',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/kundli/me/latest',
      handler: 'kundli.findMyLatest',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/kundli/:id',
      handler: 'kundli.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/kundli',
      handler: 'kundli.find',
      config: {
        policies: [],
      },
    },
  ],
};
