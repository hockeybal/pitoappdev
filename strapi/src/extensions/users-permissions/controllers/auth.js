'use strict';

/**
 * auth.js controller
 *
 * @description: A set of functions called "actions" for managing auth
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::users-permissions.auth');