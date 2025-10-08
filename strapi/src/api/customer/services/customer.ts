'use strict';

/**
 * customer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::customer.customer', ({ strapi }) => ({
  // Custom method to sync user data
  async syncUserData(customerId) {
    const customer = await strapi.entityService.findOne('api::customer.customer', customerId, {
      populate: ['user']
    });

    if (customer && customer.user) {
      await strapi.entityService.update('api::customer.customer', customerId, {
        data: {
          user_email: customer.user.email
        }
      });
    }
  },

  // Custom method to create customer from user
  async createFromUser(userId, userEmail) {
    return await strapi.entityService.create('api::customer.customer', {
      data: {
        user_id: userId,
        user_email: userEmail,
        user: userId,
        subscription_status: 'inactive'
      }
    });
  }
}));