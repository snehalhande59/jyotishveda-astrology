module.exports = ({ env }) => {
  const emailUser = env('EMAIL_USER');
  const emailPass = env('EMAIL_PASS');
  const emailHost = env('EMAIL_HOST', 'smtp.gmail.com');
  const emailPort = env.int('EMAIL_SMTP_PORT', 465);
  const emailSecure = env.bool('EMAIL_SMTP_SECURE', true);

  const googleClientId = env('GOOGLE_CLIENT_ID');
  const googleClientSecret = env('GOOGLE_CLIENT_SECRET');
  const frontendUrl = env('FRONTEND_URL', 'http://localhost:3001');
  const googleCallbackUrl = env('GOOGLE_CALLBACK_URL', `${frontendUrl}/connect/google/redirect`);

  const pluginsConfig = {
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET', 'superJwtSecret1234567890ForVedicAstrologyPlatform'),
        callback: {
          validate(callback, provider) {
            let uCallback;
            try {
              uCallback = new URL(callback);
            } catch {
              throw new Error('The callback is not a valid URL');
            }

            const allowedOrigins = [
              'http://localhost:3001',
              'http://127.0.0.1:3001',
              'https://jyotishveda-astrology.vercel.app',
              'https://jyotishveda-astrology-web.vercel.app',
              'https://jyotishveda.com',
              'https://www.jyotishveda.com',
              frontendUrl,
            ].filter(Boolean).map((url) => {
              try {
                return new URL(url).origin;
              } catch {
                return url;
              }
            });

            const isAllowed =
              allowedOrigins.includes(uCallback.origin) ||
              uCallback.hostname.endsWith('.vercel.app') ||
              (provider && provider.callback && (() => {
                try {
                  return uCallback.origin === new URL(provider.callback).origin;
                } catch {
                  return false;
                }
              })());

            if (!isAllowed) {
              throw new Error(`Forbidden callback origin: ${uCallback.origin}`);
            }
          },
        },
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
        callback: googleCallbackUrl,
        scope: ['email', 'profile'],
      },
    };
  }

  return pluginsConfig;
};

