module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/bookings/me',
      handler: 'consultation-booking.findMe',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/bookings',
      handler: 'consultation-booking.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/bookings/:id',
      handler: 'consultation-booking.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/bookings',
      handler: 'consultation-booking.find',
      config: {
        policies: [],
      },
    },
  ],
};
