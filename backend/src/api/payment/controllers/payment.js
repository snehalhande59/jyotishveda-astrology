const paymentService = require('../../../services/payment-service');

module.exports = {
  async createOrder(ctx) {
    const user = ctx.state.user;
    const { amount, serviceType, referenceId, currency = 'INR', notes = {} } = ctx.request.body;

    if (!amount || amount <= 0) {
      return ctx.badRequest('Invalid payment amount');
    }

    try {
      const order = await paymentService.createOrder({
        amountInRupees: parseFloat(amount),
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          ...notes,
          serviceType: serviceType || 'astrology_service',
          referenceId: referenceId || '',
          userId: user ? String(user.id) : 'guest',
        },
      });

      // Save initial payment record
      await strapi.entityService.create('api::payment-record.payment-record', {
        data: {
          orderId: order.orderId,
          amount: parseFloat(amount),
          currency,
          status: 'created',
          serviceType: serviceType || 'general',
          referenceId: String(referenceId || ''),
          user: user ? user.id : null,
          rawPayload: order,
        },
      });

      return {
        data: {
          orderId: order.orderId,
          amount: order.amount,
          currency: order.currency,
          keyId: order.keyId,
          isTestMode: Boolean(order.isTestMode),
        },
      };
    } catch (err) {
      ctx.log.error(err);
      return ctx.internalServerError('Failed to create payment order');
    }
  },

  async verify(ctx) {
    const user = ctx.state.user;
    const { orderId, paymentId, signature, serviceType, referenceId } = ctx.request.body;

    if (!orderId || !paymentId) {
      return ctx.badRequest('Missing orderId or paymentId');
    }

    const isValid = paymentService.verifySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return ctx.badRequest('Invalid payment signature verification failed');
    }

    // Retrieve or update payment record
    const existingRecords = await strapi.entityService.findMany('api::payment-record.payment-record', {
      filters: { orderId },
      limit: 1,
    });

    let paymentRecord;
    if (existingRecords && existingRecords.length > 0) {
      paymentRecord = await strapi.entityService.update('api::payment-record.payment-record', existingRecords[0].id, {
        data: {
          paymentId,
          signature,
          status: 'captured',
          user: user ? user.id : existingRecords[0].user,
        },
      });
    } else {
      paymentRecord = await strapi.entityService.create('api::payment-record.payment-record', {
        data: {
          orderId,
          paymentId,
          signature,
          amount: 999,
          currency: 'INR',
          status: 'captured',
          serviceType: serviceType || 'general',
          referenceId: String(referenceId || ''),
          user: user ? user.id : null,
        },
      });
    }

    // Grant access to report or confirm booking if referenceId exists
    if (serviceType === 'report' && referenceId) {
      try {
        await strapi.entityService.update('api::astrology-report.astrology-report', referenceId, {
          data: {
            isPurchased: true,
            payment: paymentRecord.id,
          },
        });
      } catch (e) {
        // Report update if already created
      }
    } else if (serviceType === 'consultation' && referenceId) {
      try {
        await strapi.entityService.update('api::consultation-booking.consultation-booking', referenceId, {
          data: {
            status: 'confirmed',
            payment: paymentRecord.id,
          },
        });
      } catch (e) {
        // Booking update
      }
    }

    return {
      success: true,
      message: 'Payment verified and access granted successfully',
      data: {
        orderId,
        paymentId,
        status: 'captured',
        paymentRecordId: paymentRecord.id,
        serviceType,
        referenceId,
        bookingId: serviceType === 'consultation' ? referenceId : null,
      },
    };
  },

  async webhook(ctx) {
    const rawBody = ctx.request.body;
    const signature = ctx.request.headers['x-razorpay-signature'];

    const isValid = paymentService.verifyWebhookSignature({
      rawBody: JSON.stringify(rawBody),
      signature,
    });

    if (!isValid && process.env.NODE_ENV === 'production') {
      return ctx.badRequest('Invalid webhook signature');
    }

    const event = rawBody?.event;
    const payload = rawBody?.payload?.payment?.entity;

    if (payload && payload.order_id) {
      const records = await strapi.entityService.findMany('api::payment-record.payment-record', {
        filters: { orderId: payload.order_id },
        limit: 1,
      });

      if (records && records.length > 0) {
        await strapi.entityService.update('api::payment-record.payment-record', records[0].id, {
          data: {
            paymentId: payload.id,
            status: event === 'payment.captured' ? 'captured' : 'failed',
            rawPayload,
          },
        });
      }
    }

    return { status: 'ok' };
  },

  async findMyOrders(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required to view your orders');
    }

    const records = await strapi.entityService.findMany('api::payment-record.payment-record', {
      filters: { user: user.id },
      sort: { createdAt: 'desc' },
    });

    return { data: records };
  },
};
