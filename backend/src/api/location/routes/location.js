'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/location/search',
      handler: 'location.search',
      config: {
        policies: [],
      },
    },
  ],
};
