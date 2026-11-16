'use strict';

module.exports = {
  async find(ctx) {
    try {
      const { page = 1, pageSize = 25, status, category, search } = ctx.query;
      const filters = {};

      if (status && status !== 'all') filters.status = status;
      if (category && category !== 'all') filters.category = category;
      if (search && search.trim()) {
        filters.$or = [
          { ticketNumber: { $containsi: search.trim() } },
          { customerEmail: { $containsi: search.trim() } },
          { customerName: { $containsi: search.trim() } },
          { subject: { $containsi: search.trim() } },
        ];
      }

      const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      const limit = parseInt(pageSize, 10);

      const [tickets, total] = await Promise.all([
        strapi.entityService.findMany('api::support-ticket.support-ticket', {
          filters,
          sort: { createdAt: 'desc' },
          start: offset,
          limit,
        }),
        strapi.entityService.count('api::support-ticket.support-ticket', { filters }),
      ]);

      return {
        data: tickets,
        meta: {
          pagination: {
            page: parseInt(page, 10),
            pageSize: limit,
            pageCount: Math.ceil(total / limit) || 1,
            total,
          },
        },
      };
    } catch (err) {
      strapi.log.error('Support tickets find error:', err);
      return ctx.internalServerError('Failed to fetch tickets');
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    try {
      const ticket = await strapi.entityService.findOne('api::support-ticket.support-ticket', id);
      if (!ticket) return ctx.notFound('Ticket not found');
      return { data: ticket };
    } catch (err) {
      return ctx.internalServerError('Failed to fetch ticket');
    }
  },

  async create(ctx) {
    try {
      const body = ctx.request.body || {};
      const ticketNumber = `TICK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`;

      const created = await strapi.entityService.create('api::support-ticket.support-ticket', {
        data: {
          ...body,
          ticketNumber,
          status: 'open',
          replies: body.replies || [],
        },
      });

      return { success: true, data: created };
    } catch (err) {
      strapi.log.error('Create ticket error:', err);
      return ctx.internalServerError('Failed to create ticket');
    }
  },

  async update(ctx) {
    const { id } = ctx.params;
    try {
      const body = ctx.request.body || {};
      const updated = await strapi.entityService.update('api::support-ticket.support-ticket', id, {
        data: body,
      });
      return { success: true, data: updated };
    } catch (err) {
      strapi.log.error('Update ticket error:', err);
      return ctx.internalServerError('Failed to update ticket');
    }
  },

  async addReply(ctx) {
    const { id } = ctx.params;
    try {
      const { message, senderName, senderType = 'staff' } = ctx.request.body || {};
      if (!message) return ctx.badRequest('Message is required');

      const ticket = await strapi.entityService.findOne('api::support-ticket.support-ticket', id);
      if (!ticket) return ctx.notFound('Ticket not found');

      const existingReplies = Array.isArray(ticket.replies) ? ticket.replies : [];
      const newReply = {
        id: Date.now(),
        message,
        senderName: senderName || 'Support Acharya',
        senderType,
        createdAt: new Date().toISOString(),
      };

      const updated = await strapi.entityService.update('api::support-ticket.support-ticket', id, {
        data: {
          replies: [...existingReplies, newReply],
          status: senderType === 'staff' ? 'in_progress' : ticket.status,
        },
      });

      return { success: true, data: updated };
    } catch (err) {
      strapi.log.error('Add reply error:', err);
      return ctx.internalServerError('Failed to append reply');
    }
  },
};
