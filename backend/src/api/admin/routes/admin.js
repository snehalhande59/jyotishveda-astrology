module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/admin/login',
      handler: 'admin.login',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/me',
      handler: 'admin.getMe',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/dashboard-stats',
      handler: 'admin.getDashboardStats',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/users',
      handler: 'admin.getUsers',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/users/:id',
      handler: 'admin.getUserById',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/astrologers',
      handler: 'admin.getAstrologers',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/astrologers',
      handler: 'admin.createAstrologer',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/astrologers/:id',
      handler: 'admin.updateAstrologer',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/astrologers/:id',
      handler: 'admin.deleteAstrologer',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/bookings',
      handler: 'admin.getBookings',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/bookings/:id',
      handler: 'admin.getBookingById',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/bookings/:id',
      handler: 'admin.updateBooking',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/content/:contentType',
      handler: 'admin.getContent',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/content/:contentType',
      handler: 'admin.createContent',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/content/:contentType/:id',
      handler: 'admin.updateContent',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/content/:contentType/:id',
      handler: 'admin.deleteContent',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/reports/export',
      handler: 'admin.exportReport',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/change-password',
      handler: 'admin.changePassword',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
