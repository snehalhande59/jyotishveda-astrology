module.exports = ({ env }) => {
  const customFrontendUrl = env('FRONTEND_URL', '');
  const extraOrigins = env('CORS_ORIGINS', '');

  // Pre-configured list of known production and local origins
  const staticOrigins = [
    'https://jyotishveda-astrology.vercel.app',
    'https://jyotishveda-astrology-web.vercel.app',
    'https://jyotishveda.vercel.app',
    'https://jyotishveda.com',
    'https://www.jyotishveda.com',
    'https://jyotishveda-backend-0epp.onrender.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003',
  ];

  // Append any env-defined origins
  [customFrontendUrl, extraOrigins].forEach((envVal) => {
    if (envVal) {
      envVal.split(',').forEach((u) => {
        const trimmed = u.trim();
        if (trimmed && !staticOrigins.includes(trimmed)) {
          staticOrigins.push(trimmed);
        }
      });
    }
  });

  // Allowed regex patterns for dynamic origins
  const allowedPatterns = [
    // All Vercel deployments (production, previews, branch deploys)
    /^https:\/\/[a-zA-Z0-9_.-]+\.vercel\.app$/,
    // Localhost on any port
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
    // Private LAN IPs for local testing on mobile devices over Wi-Fi
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    // Custom domain variants
    /^https:\/\/(.*\.)?jyotishveda\.com$/,
  ];

  const isOriginAllowed = (origin) => {
    if (!origin) return false;
    if (staticOrigins.includes(origin)) return true;
    return allowedPatterns.some((pattern) => pattern.test(origin));
  };

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:', 'http:'],
            'img-src': [
              "'self'",
              'data:',
              'blob:',
              'market-assets.strapi.io',
              'res.cloudinary.com',
              'images.unsplash.com',
            ],
            'media-src': ["'self'", 'data:', 'blob:'],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin(ctx) {
          const reqOrigin = ctx.get('Origin');
          if (!reqOrigin) {
            return '*';
          }
          if (isOriginAllowed(reqOrigin)) {
            return reqOrigin;
          }
          return '';
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        headers: [
          'Content-Type',
          'Authorization',
          'Origin',
          'Accept',
          'X-Requested-With',
          'Cache-Control',
          'Pragma',
          'Expires',
        ],
        credentials: true,
        keepHeadersOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
