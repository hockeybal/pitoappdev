/**
 * Trial access middleware
 * Controls access to premium features based on subscription or trial status
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Skip middleware for auth routes and public routes
    const publicRoutes = [
      '/api/auth/local',
      '/api/auth/local/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/plans',
      '/api/global',
      '/api/pages',
      '/api/categories',
      '/api/articles',
      '/api/faq',
      '/api/testimonials'
    ];

    const isPublicRoute = publicRoutes.some(route => ctx.url.startsWith(route));

    if (isPublicRoute) {
      return next();
    }

    // Get user from JWT token
    const token = ctx.request.header.authorization?.replace('Bearer ', '');
    if (!token) {
      return ctx.unauthorized('No token provided');
    }

    try {
      const jwtService = strapi.service('plugin::users-permissions.jwt');
      const userId = jwtService.verify(token).id;

      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: ['plan']
      });

      if (!user) {
        return ctx.unauthorized('User not found');
      }

      // Check if user has active subscription
      const hasActiveSubscription = user.subscription_status === 'active' &&
                                   user.subscription_end_date &&
                                   new Date(user.subscription_end_date) > new Date();

      // Check if user is in active trial
      const now = new Date();
      const isInTrial = user.is_trial_active &&
                       user.trial_end_date &&
                       new Date(user.trial_end_date) > now;

      // Allow access if user has active subscription OR is in trial
      if (hasActiveSubscription || isInTrial) {
        // Add trial/subscription info to context for frontend
        ctx.state.user = {
          ...user,
          hasActiveSubscription,
          isInTrial,
          trialDaysLeft: isInTrial ? Math.ceil((new Date(user.trial_end_date) - now) / (1000 * 60 * 60 * 24)) : 0
        };
        return next();
      }

      // Block access - no active subscription and trial expired
      return ctx.forbidden('Access denied. Please upgrade to a paid plan.');

    } catch (error) {
      strapi.log.error('Trial access middleware error:', error);
      return ctx.unauthorized('Invalid token');
    }
  };
};