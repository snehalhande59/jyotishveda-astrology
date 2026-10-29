const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::consultation-booking.consultation-booking', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body.data || ctx.request.body;

    if (!body.astrologerId || !body.date || !body.timeSlot) {
      return ctx.badRequest('Missing astrologerId, date, or timeSlot');
    }

    // Look up real astrologer record to ensure validity and obtain trusted server-side fee
    let astrologer = null;
    try {
      if (!isNaN(Number(body.astrologerId))) {
        astrologer = await strapi.entityService.findOne('api::astrologer.astrologer', Number(body.astrologerId));
      } else {
        const astros = await strapi.entityService.findMany('api::astrologer.astrologer', {
          filters: { documentId: String(body.astrologerId) },
          limit: 1,
        });
        if (astros && astros.length > 0) astrologer = astros[0];
      }
    } catch (e) {
      // fallback
    }

    if (!astrologer) {
      return ctx.notFound(`Astrologer with ID "${body.astrologerId}" was not found in our directory.`);
    }

    // Double-booking check: prevent duplicate bookings for the same astrologer, date, and slot
    const existingBookings = await strapi.entityService.findMany('api::consultation-booking.consultation-booking', {
      filters: {
        astrologer: astrologer.id,
        date: body.date,
        timeSlot: body.timeSlot,
        status: 'confirmed',
      },
      limit: 1,
    });

    if (existingBookings && existingBookings.length > 0) {
      return ctx.conflict('This appointment slot has already been reserved and confirmed. Please choose a different date or time slot.');
    }

    const bookingNumber = `BK-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const booking = await strapi.entityService.create('api::consultation-booking.consultation-booking', {
      data: {
        bookingNumber,
        date: body.date,
        timeSlot: body.timeSlot,
        status: body.paymentId ? 'confirmed' : 'pending',
        topic: body.topic || 'General Vedic Chart Consultation',
        clientNotes: body.clientNotes || '',
        consultationFee: parseFloat(astrologer.consultationFee) || 999,
        durationMinutes: 30,
        meetingLink: 'https://meet.google.com/vedic-' + Math.random().toString(36).substring(7),
        astrologer: astrologer.id,
        user: user ? user.id : null,
      },
      populate: ['astrologer'],
    });

    return { data: booking };
  },

  async findMe(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required to view your consultation bookings');
    }

    const bookings = await strapi.entityService.findMany('api::consultation-booking.consultation-booking', {
      filters: { user: user.id },
      populate: ['astrologer'],
      sort: { date: 'asc' },
    });

    return { data: bookings };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    const booking = await strapi.entityService.findOne('api::consultation-booking.consultation-booking', id, {
      populate: ['astrologer', 'user'],
    });

    if (!booking) {
      return ctx.notFound('Booking not found');
    }

    if (booking.user && (!user || (user.id !== booking.user.id && user.role?.name !== 'Admin'))) {
      return ctx.forbidden('Access denied to this booking');
    }

    return { data: booking };
  },
}));
