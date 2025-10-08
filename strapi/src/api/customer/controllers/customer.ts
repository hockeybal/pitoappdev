'use strict';

/**
 * customer controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::customer.customer', ({ strapi }) => ({
  // Custom method to get customer statistics
  async getStats(ctx) {
    try {
      const total = await strapi.entityService.count('api::customer.customer');
      const active = await strapi.entityService.count('api::customer.customer', {
        filters: { subscription_status: 'active' }
      });
      const trial = await strapi.entityService.count('api::customer.customer', {
        filters: { subscription_status: 'trial' }
      });

      ctx.send({
        total,
        active,
        trial,
        inactive: total - active - trial
      });
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Custom method to assign a plan to a customer
  async assignPlan(ctx) {
    const { customerId, planId } = ctx.request.body;

    if (!customerId || !planId) {
      return ctx.badRequest('Customer ID and Plan ID are required');
    }

    try {
      const customer = await strapi.entityService.update('api::customer.customer', customerId, {
        data: {
          plan: planId,
          subscription_status: 'active',
          subscription_start_date: new Date(),
        },
        populate: ['user', 'plan']
      });

      ctx.send(customer);
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));