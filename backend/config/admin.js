module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'adminSecretVedicPlatform2026SecureKey789'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'apiTokenSaltVedicPlatform2026Key456'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'transferTokenSaltVedicPlatform2026Key123'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});
