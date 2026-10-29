const { createCoreController } = require('@strapi/strapi').factories;
const vedicEngine = require('../../../services/vedic-engine');

module.exports = createCoreController('api::kundli.kundli', ({ strapi }) => ({
  async generate(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body.data || ctx.request.body;

    if (!body.fullName || !body.dateOfBirth || !body.timeOfBirth || !body.placeOfBirth) {
      return ctx.badRequest('Missing birth information (fullName, dateOfBirth, timeOfBirth, placeOfBirth)');
    }

    const lat = parseFloat(body.latitude) || 28.6139;
    const lon = parseFloat(body.longitude) || 77.2090;

    const chartData = vedicEngine.calculateKundli({
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      timeOfBirth: body.timeOfBirth,
      placeOfBirth: body.placeOfBirth,
      latitude: lat,
      longitude: lon,
      timezoneOffsetHours: parseFloat(body.timezoneOffset) || 5.5,
      ayanamsaType: body.ayanamsa || 'Lahiri',
    });

    const entry = await strapi.entityService.create('api::kundli.kundli', {
      data: {
        fullName: body.fullName,
        dateOfBirth: body.dateOfBirth,
        timeOfBirth: body.timeOfBirth,
        placeOfBirth: body.placeOfBirth,
        latitude: lat,
        longitude: lon,
        ayanamsa: body.ayanamsa || 'Lahiri',
        ascendantSign: chartData.ascendant.signName,
        moonSign: chartData.moonSign.signName,
        nakshatra: chartData.moonSign.nakshatra,
        pada: chartData.moonSign.pada,
        chartData,
        user: user ? user.id : null,
      },
    });

    return {
      data: {
        id: entry.id,
        ...entry,
        chartData,
      },
    };
  },

  async calculateCompatibility(ctx) {
    const body = ctx.request?.body || {};
    const query = ctx.query || {};

    let boyBirth = body.boyBirth;
    let girlBirth = body.girlBirth;

    // Support JSON objects passed in query string or flat query params
    if (!boyBirth && query.boyBirth) {
      try {
        boyBirth = typeof query.boyBirth === 'string' ? JSON.parse(query.boyBirth) : query.boyBirth;
      } catch {}
    }
    if (!girlBirth && query.girlBirth) {
      try {
        girlBirth = typeof query.girlBirth === 'string' ? JSON.parse(query.girlBirth) : query.girlBirth;
      } catch {}
    }

    if (!boyBirth && (query.boyDate || query.boyDob)) {
      boyBirth = {
        fullName: query.boyName || 'Boy',
        dateOfBirth: query.boyDate || query.boyDob,
        timeOfBirth: query.boyTime || '12:00',
        placeOfBirth: query.boyPlace || 'New Delhi',
        latitude: parseFloat(query.boyLat) || 28.6139,
        longitude: parseFloat(query.boyLon) || 77.2090,
      };
    }

    if (!girlBirth && (query.girlDate || query.girlDob)) {
      girlBirth = {
        fullName: query.girlName || 'Girl',
        dateOfBirth: query.girlDate || query.girlDob,
        timeOfBirth: query.girlTime || '12:00',
        placeOfBirth: query.girlPlace || 'New Delhi',
        latitude: parseFloat(query.girlLat) || 28.6139,
        longitude: parseFloat(query.girlLon) || 77.2090,
      };
    }

    if (!boyBirth || !girlBirth) {
      return ctx.badRequest('Both boyBirth and girlBirth details are required (with dateOfBirth)');
    }

    if (!boyBirth.dateOfBirth || !girlBirth.dateOfBirth) {
      return ctx.badRequest('Valid dateOfBirth (YYYY-MM-DD) is required for both boy and girl');
    }

    try {
      const boyChart = vedicEngine.calculateKundli({
        fullName: boyBirth.fullName || 'Boy',
        dateOfBirth: boyBirth.dateOfBirth,
        timeOfBirth: boyBirth.timeOfBirth || '12:00',
        placeOfBirth: boyBirth.placeOfBirth || 'New Delhi',
        latitude: parseFloat(boyBirth.latitude) || 28.6139,
        longitude: parseFloat(boyBirth.longitude) || 77.2090,
      });

      const girlChart = vedicEngine.calculateKundli({
        fullName: girlBirth.fullName || 'Girl',
        dateOfBirth: girlBirth.dateOfBirth,
        timeOfBirth: girlBirth.timeOfBirth || '12:00',
        placeOfBirth: girlBirth.placeOfBirth || 'New Delhi',
        latitude: parseFloat(girlBirth.latitude) || 28.6139,
        longitude: parseFloat(girlBirth.longitude) || 77.2090,
      });

      const matching = vedicEngine.calculateGunaMilan(
        boyChart.planets[1].longitude,
        girlChart.planets[1].longitude
      );

      return {
        data: {
          boyChart: {
            ascendant: boyChart.ascendant,
            moonSign: boyChart.moonSign,
          },
          girlChart: {
            ascendant: girlChart.ascendant,
            moonSign: girlChart.moonSign,
          },
          gunaMilan: matching,
        },
      };
    } catch (err) {
      return ctx.badRequest('Failed to calculate compatibility: ' + (err.message || 'Invalid parameters'));
    }
  },

  async calculatePanchang(ctx) {
    const input = {
      ...(ctx.query || {}),
      ...(ctx.request?.body || {}),
    };
    const date = input.date || new Date().toISOString().split('T')[0];
    const time = input.time || '06:00';
    const latitude = parseFloat(input.latitude) || 28.6139;
    const longitude = parseFloat(input.longitude) || 77.2090;
    const timezoneOffsetHours = parseFloat(input.timezoneOffset ?? input.timezoneOffsetHours) || 5.5;

    try {
      const panchang = vedicEngine.calculatePanchang({
        date,
        time,
        latitude,
        longitude,
        timezoneOffsetHours,
      });

      return { data: panchang };
    } catch (err) {
      return ctx.badRequest('Failed to calculate Panchang: ' + (err.message || 'Invalid parameters'));
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const entry = await strapi.entityService.findOne('api::kundli.kundli', id);
    if (!entry) {
      return ctx.notFound('Kundli record not found');
    }
    return { data: entry };
  },

  async findMyLatest(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }
    const entries = await strapi.entityService.findMany('api::kundli.kundli', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
      limit: 1,
    });
    if (!entries || entries.length === 0) {
      return { data: null };
    }
    return { data: entries[0] };
  },
}));
