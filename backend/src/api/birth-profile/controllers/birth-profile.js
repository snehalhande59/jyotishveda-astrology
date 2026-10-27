const { createCoreController } = require('@strapi/strapi').factories;
const vedicEngine = require('../../../services/vedic-engine');

module.exports = createCoreController('api::birth-profile.birth-profile', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body.data || ctx.request.body;

    if (!body.fullName || !body.dateOfBirth || !body.timeOfBirth || !body.placeOfBirth) {
      return ctx.badRequest('Missing required birth details: fullName, dateOfBirth, timeOfBirth, placeOfBirth');
    }

    const lat = parseFloat(body.latitude) || 28.6139; // Default New Delhi if not resolved
    const lon = parseFloat(body.longitude) || 77.2090;

    // Generate accurate sidereal chart data
    const chartData = vedicEngine.calculateKundli({
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      timeOfBirth: body.timeOfBirth,
      placeOfBirth: body.placeOfBirth,
      latitude: lat,
      longitude: lon,
      timezoneOffsetHours: parseFloat(body.timezoneOffset) || 5.5,
    });

    const entryData = {
      ...body,
      latitude: lat,
      longitude: lon,
      chartData,
      user: user ? user.id : null,
    };

    const entry = await strapi.entityService.create('api::birth-profile.birth-profile', {
      data: entryData,
    });

    return { data: entry };
  },

  async findMe(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to view your birth profiles');
    }

    const entries = await strapi.entityService.findMany('api::birth-profile.birth-profile', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
    });

    return { data: entries };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    const entry = await strapi.entityService.findOne('api::birth-profile.birth-profile', id, {
      populate: ['user'],
    });

    if (!entry) {
      return ctx.notFound('Birth profile not found');
    }

    // If profile is associated with a user, ensure only that user or an admin can access it
    if (entry.user && (!user || (user.id !== entry.user.id && user.role?.name !== 'Admin'))) {
      return ctx.forbidden('Access denied to this private birth profile');
    }

    return { data: entry };
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Authentication required to delete a profile');
    }

    const entry = await strapi.entityService.findOne('api::birth-profile.birth-profile', id, {
      populate: ['user'],
    });

    if (!entry) {
      return ctx.notFound('Birth profile not found');
    }

    if (entry.user && entry.user.id !== user.id && user.role?.name !== 'Admin') {
      return ctx.forbidden('You can only delete your own birth profiles');
    }

    await strapi.entityService.delete('api::birth-profile.birth-profile', id);
    return { data: { success: true, id } };
  },
}));
