'use strict';

module.exports = ({ env }) => {
  const emailUser = env('EMAIL_USER');
  const emailPass = env('EMAIL_PASS');
  const emailHost = env('EMAIL_HOST', 'smtp.gmail.com');
  const emailPort = env.int('EMAIL_SMTP_PORT', 465);
  const emailSecure = env.bool('EMAIL_SMTP_SECURE', true);

  const defaultFrontend = env('NODE_ENV') === 'production'
    ? 'https://jyotishveda-astrology.vercel.app'
    : 'http://localhost:3000';
  const frontendUrl = env('FRONTEND_URL', defaultFrontend);

  const knownOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003',
    'https://jyotishveda-astrology.vercel.app',
    'https://jyotishveda-astrology-web.vercel.app',
    'https://jyotishveda-astrology-ew4n3uxvh-snehalhande59s-projects.vercel.app',
    'https://jyotishveda.com',
    'https://www.jyotishveda.com',
    'https://jyotishveda-backend-0epp.onrender.com',
    // Dokploy deployment domains
    'https://jyotishveda-frontend-0o9pvi-4004bd-150-136-66-155.sslip.io',
    'https://jyotishveda-strapi-8f1717-150-136-44-53.sslip.io',
  ];

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
              ...knownOrigins,
              frontendUrl,
            ]
              .filter(Boolean)
              .map((url) => {
                try {
                  return new URL(url).origin;
                } catch {
                  return url;
                }
              });

            const isLocalhost =
              uCallback.hostname === 'localhost' ||
              uCallback.hostname === '127.0.0.1' ||
              /^192\.168\.\d{1,3}\.\d{1,3}$/.test(uCallback.hostname) ||
              /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(uCallback.hostname) ||
              /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(uCallback.hostname);

            const isAllowed =
              isLocalhost ||
              allowedOrigins.includes(uCallback.origin) ||
              uCallback.hostname.endsWith('.vercel.app') ||
              uCallback.hostname.endsWith('.onrender.com') ||
              uCallback.hostname.endsWith('.netlify.app') ||
              uCallback.hostname.endsWith('.pages.dev') ||
              uCallback.hostname.endsWith('.github.io') ||
              uCallback.hostname.endsWith('jyotishveda.com') ||
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

  // Configure Email Provider only when BOTH credentials are non-empty strings
  const hasEmail = emailUser && emailUser.trim().length > 0 && emailPass && emailPass.trim().length > 0;

  if (hasEmail) {
    // NOTE: requires @strapi/provider-email-nodemailer in package.json
    pluginsConfig.email = {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: emailHost,
          port: emailPort,
          secure: emailSecure,
          auth: {
            user: emailUser.trim(),
            pass: emailPass.trim(),
          },
        },
        settings: {
          defaultFrom: env('EMAIL_FROM', `JyotishVeda <${emailUser.trim()}>`),
          defaultReplyTo: env('EMAIL_REPLY_TO', emailUser.trim()),
        },
      },
    };
  } else {
    // Strapi requires at least a sendmail/fake provider when email plugin is loaded.
    // Use the built-in sendmail provider as a safe no-op fallback.
    pluginsConfig.email = {
      config: {
        provider: 'sendmail',
        settings: {
          defaultFrom: 'no-reply@jyotishveda.com',
          defaultReplyTo: 'no-reply@jyotishveda.com',
        },
      },
    };
  }

  return pluginsConfig;
};
