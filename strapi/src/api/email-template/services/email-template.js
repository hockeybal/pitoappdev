'use strict';

const handlebars = require('handlebars');

/**
 * email-template service
 */

module.exports = ({ strapi }) => ({
  async sendTemplatedEmail(templateId, to, variables = {}) {
    // Haal template op
    const template = await strapi.entityService.findOne('api::email-template.email-template', templateId);

    if (!template) {
      throw new Error('Template not found');
    }

    // Compileer subject en htmlContent met Handlebars
    const subjectTemplate = handlebars.compile(template.subject);
    const htmlTemplate = handlebars.compile(template.htmlContent);

    const subject = subjectTemplate(variables);
    const html = htmlTemplate(variables);

    // Verstuur email
    await strapi.plugins['email'].services.email.send({
      to,
      subject,
      html,
    });
  },
});