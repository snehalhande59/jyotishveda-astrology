module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/birth-profiles/me',
      handler: 'birth-profile.findMe',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/birth-profiles',
      handler: 'birth-profile.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/birth-profiles',
      handler: 'birth-profile.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/birth-profiles/:id',
      handler: 'birth-profile.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/birth-profiles/:id',
      handler: 'birth-profile.delete',
      config: {
        policies: [],
      },
    },
  ],
};
