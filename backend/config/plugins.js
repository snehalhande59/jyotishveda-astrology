module.exports = ({ env }) => {
  const emailUser = env('EMAIL_USER');
  const emailPass = env('EMAIL_PASS');
  const emailHost = env('EMAIL_HOST', 'smtp.gmail.com');
  const emailPort = env.int('EMAIL_SMTP_PORT', 465);
  const emailSecure = env.bool('EMAIL_SMTP_SECURE', true);

  const googleClientId = env('GOOGLE_CLIENT_ID');
  const googleClientSecret = env('GOOGLE_CLIENT_SECRET');
  const googleCallbackUrl = env('GOOGLE_CALLBACK_URL');

  const pluginsConfig = {
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET', 'superJwtSecret1234567890ForVedicAstrologyPlatform'),
      },
    },
  };

  // Configure Email Provider if Gmail/SMTP credentials are provided
  if (emailUser && emailPass) {
    pluginsConfig.email = {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: emailHost,
          port: emailPort,
          secure: emailSecure,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        },
        settings: {
          defaultFrom: env('EMAIL_FROM', `JyotishVeda <${emailUser}>`),
          defaultReplyTo: env('EMAIL_REPLY_TO', emailUser),
        },
      },
    };
  }

  // Configure Google OAuth in grant settings if credentials are provided
  if (googleClientId && googleClientSecret) {
    pluginsConfig['users-permissions'].config.grant = {
      google: {
        enabled: true,
        icon: 'google',
        key: googleClientId,
        secret: googleClientSecret,
        callback: googleCallbackUrl || `${env('PUBLIC_URL', 'http://localhost:1337')}/api/connect/google/callback`,
        scope: ['email', 'profile'],
      },
    };
  }

  return pluginsConfig;
};

