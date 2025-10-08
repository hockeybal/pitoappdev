'use strict';

/**
 * vacature controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::vacature.vacature', ({ strapi }) => ({
  // Custom create method to associate vacature with authenticated user
  async create(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('You must be authenticated to create a vacature');
    }

    // Get user's customer record
    const customer = await strapi.db.query('api::customer.customer').findOne({
      where: { user_id: user.id },
      populate: ['plan']
    });

    if (!customer || !customer.plan) {
      return ctx.badRequest('You need an active subscription to post job listings');
    }

    // Check if user has reached their plan limit
    const existingVacatures = await strapi.db.query('api::vacature.vacature').count({
      where: { 
        user: user.id,
        is_active: true,
        publishedAt: { $notNull: true }
      }
    });

    // Define plan limits (this could be moved to plan configuration)
    const planLimits = {
      'Basic': 1,
      'Pro': 5,
      'Enterprise': -1 // unlimited
    };

    const limit = planLimits[customer.plan.name] || 1;
    
    if (limit !== -1 && existingVacatures >= limit) {
      return ctx.badRequest(`Your ${customer.plan.name} plan allows only ${limit} active job posting(s)`);
    }

    // Auto-populate user and customer
    ctx.request.body.data.user = user.id;
    ctx.request.body.data.customer = customer.id;
    
    // Set default company name from user profile if not provided
    if (!ctx.request.body.data.company_name && user.company_name) {
      ctx.request.body.data.company_name = user.company_name;
    }

    // Set expiration date (default 30 days from now)
    if (!ctx.request.body.data.expires_at) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      ctx.request.body.data.expires_at = expiryDate;
    }

    const response = await super.create(ctx);
    return response;
  },

  // Custom find method to only return user's own vacatures in dashboard
  async find(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('You must be authenticated');
    }

    // If this is a dashboard request, filter by user
    if (ctx.query.dashboard === 'true') {
      ctx.query.filters = {
        ...ctx.query.filters,
        user: user.id
      };
    } else {
      // For public requests, only show active and published vacatures
      ctx.query.filters = {
        ...ctx.query.filters,
        is_active: true,
        publishedAt: { $notNull: true },
        expires_at: { $gte: new Date().toISOString() }
      };
    }

    return super.find(ctx);
  },

  // Custom update method to ensure users can only update their own vacatures
  async update(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('You must be authenticated');
    }

    const vacature = await strapi.db.query('api::vacature.vacature').findOne({
      where: { id, user: user.id }
    });

    if (!vacature) {
      return ctx.notFound('Vacature not found or you do not have permission to edit it');
    }

    return super.update(ctx);
  },

  // Custom delete method
  async delete(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('You must be authenticated');
    }

    const vacature = await strapi.db.query('api::vacature.vacature').findOne({
      where: { id, user: user.id }
    });

    if (!vacature) {
      return ctx.notFound('Vacature not found or you do not have permission to delete it');
    }

    return super.delete(ctx);
  }
}));