'use strict';

const geocodingService = require('../../../services/geocoding-service');

module.exports = {
  async search(ctx) {
    const { q } = ctx.query;
    try {
      const results = await geocodingService.searchPlaces(q);
      return {
        data: results,
      };
    } catch (err) {
      ctx.log.error('Location search error:', err);
      return ctx.internalServerError('Failed to search locations');
    }
  },
};
