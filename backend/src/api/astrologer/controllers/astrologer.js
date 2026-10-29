const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::astrologer.astrologer', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const isNumeric = /^\d+$/.test(String(id));

    if (isNumeric) {
      const entity = await strapi.db.query('api::astrologer.astrologer').findOne({
        where: { id: parseInt(id, 10) },
        populate: true,
      });
      if (entity) {
        return { data: entity };
      }
    }

    return super.findOne(ctx);
  },
}));
