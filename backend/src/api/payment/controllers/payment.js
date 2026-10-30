const paymentService = require('../../../services/payment-service');
const notificationService = require('../../../services/notification-service');

// Standard verified catalog pricing (INR)
const STANDARD_REPORT_PRICES = {
  career: 999,
  marriage: 999,
  finance: 999,
  yearly: 999,
  'premium-kundli': 1499,
  default: 999,
};

module.exports = {
  async createOrder(ctx) {
    const user = ctx.state.user;
    const { amount, serviceType = 'general', referenceId, currency = 'INR', notes = {} } = ctx.request.body;

    let validatedAmount = parseFloat(amount);

    // Server-side price validation based on service type
    try {
      if (serviceType === 'report') {
        const reportType = (notes && notes.reportType) || (referenceId && isNaN(Number(referenceId)) ? referenceId : null);
        if (reportType && STANDARD_REPORT_PRICES[reportType]) {
          validatedAmount = STANDARD_REPORT_PRICES[reportType];
        } else if (!validatedAmount || validatedAmount <= 0) {
          validatedAmount = STANDARD_REPORT_PRICES.default;
        }
      } else if (serviceType === 'consultation') {
        let feeFound = false;
        if (referenceId) {
          try {
            if (!isNaN(Number(referenceId))) {
              const booking = await strapi.entityService.findOne('api::consultation-booking.consultation-booking', Number(referenceId), {
                populate: ['astrologer'],
              });
              if (booking && booking.consultationFee) {
                validatedAmount = parseFloat(booking.consultationFee);
                feeFound = true;
              } else if (booking && booking.astrologer && booking.astrologer.consultationFee) {
                validatedAmount = parseFloat(booking.astrologer.consultationFee);
                feeFound = true;
              }
            }
          } catch (e) {}

          if (!feeFound) {
            try {
              let astro = null;
              if (!isNaN(Number(referenceId))) {
                astro = await strapi.entityService.findOne('api::astrologer.astrologer', Number(referenceId));
              } else {
                const astros = await strapi.entityService.findMany('api::astrologer.astrologer', {
                  filters: { documentId: String(referenceId) },
                  limit: 1,
                });
                if (astros && astros.length > 0) astro = astros[0];
              }
              if (astro && astro.consultationFee) {
                validatedAmount = parseFloat(astro.consultationFee);
                feeFound = true;
              }
            } catch (e) {}
          }
        }
        if (!feeFound && (!validatedAmount || validatedAmount < 100)) {
          validatedAmount = 999; // Standard 30-min consultation baseline
        }
      } else if (serviceType === 'chat_consultation') {
        // Enforce valid consultation pricing
        if (!validatedAmount || isNaN(validatedAmount) || validatedAmount <= 0) {
          validatedAmount = 375; // Standard 15-minute consultation baseline
        }
      } else if (serviceType === 'wallet_recharge') {
        // Enforce recharge limits (min ₹50, max ₹50,000)
        if (!validatedAmount || isNaN(validatedAmount) || validatedAmount < 50 || validatedAmount > 50000) {
          return ctx.badRequest('Wallet recharge amount must be between ₹50 and ₹50,000');
        }
      } else {
        // General services & shop orders
        if (!validatedAmount || isNaN(validatedAmount) || validatedAmount <= 0) {
          return ctx.badRequest('Invalid payment amount');
        }
      }
    } catch (e) {
      console.warn('Price validation fallback applied:', e.message);
      if (!validatedAmount || validatedAmount <= 0) {
        validatedAmount = 999;
      }
    }

    try {
      const order = await paymentService.createOrder({
        amountInRupees: validatedAmount,
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          ...notes,
          serviceType: serviceType || 'astrology_service',
          referenceId: referenceId ? String(referenceId) : '',
          userId: user ? String(user.id) : 'guest',
        },
      });

      // Persist initial payment record with status 'created'
      await strapi.entityService.create('api::payment-record.payment-record', {
        data: {
          orderId: order.orderId,
          amount: validatedAmount,
          currency,
          status: 'created',
          serviceType: serviceType || 'general',
          referenceId: referenceId ? String(referenceId) : '',
          user: user ? user.id : null,
          rawPayload: order,
        },
      });

      return {
        data: {
          orderId: order.orderId,
          amount: validatedAmount,
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

    // 1. Retrieve payment record by orderId
    const existingRecords = await strapi.entityService.findMany('api::payment-record.payment-record', {
      filters: { orderId },
      populate: ['user'],
      limit: 1,
    });

    const existingRecord = existingRecords && existingRecords.length > 0 ? existingRecords[0] : null;

    // 2. Authorization check if record is bound to a user
    if (existingRecord && existingRecord.user && user) {
      const recordUserId = existingRecord.user.id || existingRecord.user;
      if (recordUserId !== user.id) {
        return ctx.forbidden('Access denied to verify this payment order');
      }
    }

    // 3. Idempotency guard: if already captured, return success immediately
    if (existingRecord && existingRecord.status === 'captured') {
      return {
        success: true,
        message: 'Payment already verified and captured',
        data: {
          orderId,
          paymentId: existingRecord.paymentId || paymentId,
          status: 'captured',
          paymentRecordId: existingRecord.id,
          serviceType: existingRecord.serviceType || serviceType,
          referenceId: existingRecord.referenceId || referenceId,
          alreadyCaptured: true,
        },
      };
    }

    // 4. Verify HMAC-SHA256 signature
    const isValid = paymentService.verifySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      if (existingRecord) {
        await strapi.entityService.update('api::payment-record.payment-record', existingRecord.id, {
          data: { status: 'failed' },
        });
      }
      return ctx.badRequest('Invalid payment signature verification failed');
    }

    // 5. Update or create payment record
    let paymentRecord;
    const sType = serviceType || existingRecord?.serviceType || 'general';
    const refId = referenceId || existingRecord?.referenceId || '';

    if (existingRecord) {
      paymentRecord = await strapi.entityService.update('api::payment-record.payment-record', existingRecord.id, {
        data: {
          paymentId,
          signature,
          status: 'captured',
          user: user ? user.id : existingRecord.user?.id || existingRecord.user,
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
          serviceType: sType,
          referenceId: String(refId),
          user: user ? user.id : null,
        },
      });
    }

    // 6. Fulfill service idempotently
    if (sType === 'report' && refId) {
      try {
        await strapi.entityService.update('api::astrology-report.astrology-report', refId, {
          data: {
            isPurchased: true,
            payment: paymentRecord.id,
          },
        });
      } catch (e) {
        console.warn('Report fulfillment notice:', e.message);
      }
    } else if (sType === 'consultation' && refId) {
      try {
        await strapi.entityService.update('api::consultation-booking.consultation-booking', refId, {
          data: {
            status: 'confirmed',
            payment: paymentRecord.id,
          },
        });
      } catch (e) {
        console.warn('Consultation booking fulfillment notice:', e.message);
      }
    } else if (sType === 'chat_consultation') {
      try {
        console.log(`Live chat consultation payment fulfilled for user ${user?.id || 'guest'}, reference: ${refId}`);
      } catch (e) {
        console.warn('Chat consultation fulfillment notice:', e.message);
      }
    } else if (sType === 'wallet_recharge' && user) {
      try {
        const u = await strapi.entityService.findOne('plugin::users-permissions.user', user.id);
        if (u) {
          const currentBal = parseFloat(u.walletBalance || 0);
          const rechargeAmt = parseFloat(paymentRecord.amount || 0);
          await strapi.entityService.update('plugin::users-permissions.user', user.id, {
            data: { walletBalance: currentBal + rechargeAmt },
          });
        }
      } catch (e) {
        console.warn('User wallet update notice:', e.message);
      }
    }

    // Send asynchronous payment confirmation notification (non-blocking)
    try {
      const recipientEmail = user?.email || existingRecord?.rawPayload?.notes?.email;
      if (recipientEmail) {
        notificationService.sendPaymentConfirmationEmail({
          to: recipientEmail,
          userName: user?.username || 'Valued Devotee',
          orderId,
          paymentId,
          amount: paymentRecord.amount,
          serviceType: sType,
        }).catch((e) => console.warn('Payment confirmation email notice:', e.message));
      }
    } catch (e) {
      console.warn('Payment notification notice:', e.message);
    }

    return {
      success: true,
      message: 'Payment verified and service fulfilled successfully',
      data: {
        orderId,
        paymentId,
        status: 'captured',
        paymentRecordId: paymentRecord.id,
        serviceType: sType,
        referenceId: refId,
        bookingId: sType === 'consultation' ? refId : null,
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
        const rec = records[0];
        // Do not revert an already captured payment
        if (rec.status !== 'captured' || event === 'payment.captured') {
          await strapi.entityService.update('api::payment-record.payment-record', rec.id, {
            data: {
              paymentId: payload.id,
              status: event === 'payment.captured' ? 'captured' : rec.status,
              rawPayload: rawBody,
            },
          });
        }
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
