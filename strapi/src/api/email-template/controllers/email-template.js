'use strict';

/**
 * email-template controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email-template.email-template', ({ strapi }) => ({
  async send(ctx) {
    const { templateId, userIds, variables = {} } = ctx.request.body;

    if (!templateId || !userIds || !Array.isArray(userIds)) {
      return ctx.badRequest('templateId and userIds (array) are required');
    }

    try {
      // Haal users op
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: { id: { $in: userIds } },
      });

      // Verstuur naar elke user
      const promises = users.map(user =>
        strapi.service('api::email-template.email-template').sendTemplatedEmail(
          templateId,
          user.email,
          { ...variables, userName: user.username || user.email, email: user.email }
        )
      );

      await Promise.all(promises);

      ctx.send({ message: 'Emails sent successfully' });
    } catch (error) {
      ctx.internalServerError('Failed to send emails', { error: error.message });
    }
  },
}));