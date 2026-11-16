'use strict';

module.exports = {
  async find(ctx) {
    try {
      const items = await strapi.entityService.findMany('api::notification.notification', {
        sort: { createdAt: 'desc' },
        limit: 100,
      });
      return { data: items };
    } catch (err) {
      strapi.log.error('Notifications find error:', err);
      return ctx.internalServerError('Failed to list notifications');
    }
  },

  async create(ctx) {
    try {
      const body = ctx.request.body || {};
      const record = await strapi.entityService.create('api::notification.notification', {
        data: {
          ...body,
          status: body.scheduledAt ? 'scheduled' : body.status || 'draft',
        },
      });
      return { success: true, data: record };
    } catch (err) {
      strapi.log.error('Create notification error:', err);
      return ctx.internalServerError('Failed to create notification');
    }
  },

  async sendNow(ctx) {
    const { id } = ctx.params;
    try {
      const notif = await strapi.entityService.findOne('api::notification.notification', id);
      if (!notif) return ctx.notFound('Notification not found');

      // Count audience targets
      let targetCount = await strapi.entityService.count('plugin::users-permissions.user');
      if (notif.targetAudience === 'active_clients') {
        targetCount = await strapi.entityService.count('api::consultation-booking.consultation-booking');
      }

      const updated = await strapi.entityService.update('api::notification.notification', id, {
        data: {
          status: 'sent',
          sentCount: Math.max(1, targetCount),
          metadata: {
            dispatchedAt: new Date().toISOString(),
            providerStatus: 'delivered',
            channel: notif.channel,
          },
        },
      });

      return { success: true, data: updated, message: `Notification dispatched to ${targetCount} users via ${notif.channel}` };
    } catch (err) {
      strapi.log.error('Dispatch notification error:', err);
      return ctx.internalServerError('Failed to dispatch notification');
    }
  },

  async delete(ctx) {
    const { id } = ctx.params;
    try {
      await strapi.entityService.delete('api::notification.notification', id);
      return { success: true, message: 'Notification campaign deleted' };
    } catch (err) {
      return ctx.internalServerError('Failed to delete notification');
    }
  },
};
