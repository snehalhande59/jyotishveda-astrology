const { createCoreController } = require('@strapi/strapi').factories;
const vedicEngine = require('../../../services/vedic-engine');
const geocodingService = require('../../../services/geocoding-service');

module.exports = createCoreController('api::kundli.kundli', ({ strapi }) => ({
  async generate(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body.data || ctx.request.body;

    if (!body.fullName || !body.dateOfBirth || !body.timeOfBirth || !body.placeOfBirth) {
      return ctx.badRequest('Missing birth information (fullName, dateOfBirth, timeOfBirth, placeOfBirth)');
    }

    let lat = parseFloat(body.latitude);
    let lon = parseFloat(body.longitude);
    let tz = parseFloat(body.timezoneOffset) || 5.5;

    // Intelligent geocoding fallback: if coordinates are default Delhi or missing, but place is another city (e.g., Sangamner)
    const placeLower = (body.placeOfBirth || '').toLowerCase();
    const isDefaultCoords = (!lat || !lon || (Math.abs(lat - 28.6139) < 0.001 && Math.abs(lon - 77.2090) < 0.001));
    if (isDefaultCoords && !placeLower.includes('delhi')) {
      try {
        const places = await geocodingService.searchPlaces(body.placeOfBirth);
        if (places && places.length > 0) {
          const match = places[0];
          lat = match.latitude;
          lon = match.longitude;
          if (match.timezoneOffset) tz = match.timezoneOffset;
        }
      } catch (geoErr) {
        console.warn('Server location resolve notice:', geoErr.message);
      }
    }

    if (!lat) lat = 28.6139;
    if (!lon) lon = 77.2090;

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

    let boyBirth = body.boyBirth || body.groom || body.person2;
    let girlBirth = body.girlBirth || body.bride || body.person1;

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
        fullName: query.boyName || query.groomName || 'Groom',
        dateOfBirth: query.boyDate || query.boyDob,
        timeOfBirth: query.boyTime || '12:00',
        placeOfBirth: query.boyPlace || 'New Delhi',
        latitude: parseFloat(query.boyLat) || 28.6139,
        longitude: parseFloat(query.boyLon) || 77.2090,
        timezoneOffsetHours: parseFloat(query.boyTz) || 5.5,
      };
    }

    if (!girlBirth && (query.girlDate || query.girlDob)) {
      girlBirth = {
        fullName: query.girlName || query.brideName || 'Bride',
        dateOfBirth: query.girlDate || query.girlDob,
        timeOfBirth: query.girlTime || '12:00',
        placeOfBirth: query.girlPlace || 'New Delhi',
        latitude: parseFloat(query.girlLat) || 28.6139,
        longitude: parseFloat(query.girlLon) || 77.2090,
        timezoneOffsetHours: parseFloat(query.girlTz) || 5.5,
      };
    }

    if (!boyBirth || !girlBirth) {
      return ctx.badRequest('Both bride/girl and groom/boy birth details are required (with dateOfBirth)');
    }

    if (!boyBirth.dateOfBirth || !girlBirth.dateOfBirth) {
      return ctx.badRequest('Valid dateOfBirth (YYYY-MM-DD) is required for both individuals');
    }

    try {
      const result = vedicEngine.calculateCompatibilityReport(boyBirth, girlBirth);

      // Optionally persist saved matching report for authenticated user
      if (ctx.state.user && (body.saveReport || query.saveReport)) {
        try {
          const reportTitle = `Kundali Milan: ${girlBirth.fullName || 'Bride'} & ${boyBirth.fullName || 'Groom'}`;
          const savedReport = await strapi.entityService.create('api::astrology-report.astrology-report', {
            data: {
              title: reportTitle,
              reportType: 'marriage',
              birthDetails: { boyBirth, girlBirth },
              reportContent: result,
              user: ctx.state.user.id,
              isPurchased: false,
            },
          });
          result.savedReportId = savedReport.id;
        } catch (saveErr) {
          strapi.log.warn('Could not persist compatibility report to DB:', saveErr.message);
        }
      }

      return {
        data: result,
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
