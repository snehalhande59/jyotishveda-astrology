module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/admin/login',
      handler: 'admin.login',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/me',
      handler: 'admin.getMe',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/dashboard-stats',
      handler: 'admin.getDashboardStats',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/users',
      handler: 'admin.getUsers',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/users/:id',
      handler: 'admin.getUserById',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/astrologers',
      handler: 'admin.getAstrologers',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/astrologers',
      handler: 'admin.createAstrologer',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/astrologers/:id',
      handler: 'admin.updateAstrologer',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/astrologers/:id',
      handler: 'admin.deleteAstrologer',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/bookings',
      handler: 'admin.getBookings',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/bookings/:id',
      handler: 'admin.getBookingById',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/bookings/:id',
      handler: 'admin.updateBooking',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/content/:contentType',
      handler: 'admin.getContent',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/content/:contentType',
      handler: 'admin.createContent',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/admin/content/:contentType/:id',
      handler: 'admin.updateContent',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/content/:contentType/:id',
      handler: 'admin.deleteContent',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/reports/export',
      handler: 'admin.exportReport',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/change-password',
      handler: 'admin.changePassword',
      config: {
        policies: [],
      },
    },
  ],
};
