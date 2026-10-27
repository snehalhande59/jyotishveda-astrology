module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/payments/my-orders',
      handler: 'payment.findMyOrders',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/payments/create-order',
      handler: 'payment.createOrder',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/payments/verify',
      handler: 'payment.verify',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/payments/webhook',
      handler: 'payment.webhook',
      config: {
        policies: [],
      },
    },
  ],
};
