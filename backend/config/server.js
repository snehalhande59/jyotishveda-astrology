module.exports = ({ env }) => {
  const isProd = env('NODE_ENV') === 'production';
  const defaultPublicUrl = isProd
    ? 'https://jyotishveda-backend-0epp.onrender.com'
    : 'http://localhost:1337';

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: env('PUBLIC_URL', env('STRAPI_URL', env('RENDER_EXTERNAL_URL', defaultPublicUrl))),
    proxy: {
      koa: env.bool('IS_PROXIED', true),
    },
    app: {
      keys: env.array('APP_KEYS', ['vedicAppKeySecret1', 'vedicAppKeySecret2', 'vedicAppKeySecret3', 'vedicAppKeySecret4']),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};
