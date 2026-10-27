module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET', 'superJwtSecret1234567890ForVedicAstrologyPlatform'),
    },
  },
});
