'use strict';

/**
 * vacature service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vacature.vacature');