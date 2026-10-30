'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth-otp/send',
      handler: 'auth-otp.sendOtp',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth-otp/verify',
      handler: 'auth-otp.verifyOtp',
      config: {
        auth: false,
      },
    },
  ],
};
