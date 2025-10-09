'use strict';

/**
 * Lifecycle callbacks for the `user` model.
 */

module.exports = {
  async beforeCreate(event) {
    const { data, params } = event;

    // Add custom fields if they exist in params (from registration)
    if (params && params.customFields) {
      Object.assign(data, params.customFields);
    }

    // Stel trial periode in voor nieuwe gebruikers: 2 weken
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(now.getDate() + 14); // 14 dagen trial

    data.trial_start_date = now;
    data.trial_end_date = trialEnd;
    data.is_trial_active = true;
    data.subscription_status = 'trial';
  },

  async afterCreate(event) {
    const { result } = event;

    // Vind de 'nieuwe-gebruiker' template
    const templates = await strapi.entityService.findMany('api::email-template.email-template', {
      filters: { type: 'nieuwe-gebruiker' },
    });

    if (templates.length > 0) {
      const template = templates[0]; // Neem de eerste

      // Verstuur email via de service
      await strapi.service('api::email-template.email-template').sendTemplatedEmail(
        template.id,
        result.email,
        {
          userName: result.username || result.email,
          email: result.email,
        }
      );
    }
  },
};