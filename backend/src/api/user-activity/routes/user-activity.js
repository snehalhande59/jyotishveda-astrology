module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-activities/track',
      handler: 'user-activity.track',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/user-activities/heartbeat',
      handler: 'user-activity.heartbeat',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/user-activities/live-users',
      handler: 'user-activity.getLiveUsers',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/user-activities/analytics',
      handler: 'user-activity.getAnalytics',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/user-activities',
      handler: 'user-activity.find',
      config: {
        policies: [],
      },
    },
  ],
};
