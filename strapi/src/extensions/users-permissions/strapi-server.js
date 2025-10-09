const utils = require('@strapi/utils');
const { yup, validateYupSchema } = utils;
const { ApplicationError, ValidationError } = utils.errors;

module.exports = (plugin) => {
  // Customize the register body schema to include custom fields
  const registerBodySchema = yup.object({
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    // Add custom fields to the validation schema
    kvk_number: yup.string().nullable(),
    company_name: yup.string().nullable(),
    street_address: yup.string().nullable(),
    postal_code: yup.string().nullable(),
    city: yup.string().nullable(),
    country: yup.string().nullable(),
    sector: yup.string().required(),
    sub_sector: yup.string().nullable(),
  });

  // Update the register route to remove body validation
  if (plugin.routes['content-api']) {
    plugin.routes['content-api'].routes = plugin.routes['content-api'].routes.map((route) => {
      if (route.method === 'POST' && route.path === '/auth/local/register') {
        return {
          ...route,
          config: {
            ...route.config,
            // Remove the validation policy
            policies: [],
          },
        };
      }
      return route;
    });
  }

  // Override the register method
  plugin.controllers.auth.register = async (ctx) => {
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    const settings = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    // Validate the body with our custom schema
    await validateYupSchema(registerBodySchema)(ctx.request.body);

    const params = {
      ...ctx.request.body,
    };

    // Extract and validate custom fields
    const {
      username,
      email,
      password,
      kvk_number,
      company_name,
      street_address,
      postal_code,
      city,
      country,
      sector,
      sub_sector,
    } = params;

    // Check if username is already taken
    const userWithSameUsername = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { username } });

    if (userWithSameUsername) {
      throw new ApplicationError('Username already taken');
    }

    // Check if email is already taken
    const userWithSameEmail = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { email: email.toLowerCase() } });

    if (userWithSameEmail) {
      throw new ApplicationError('Email already taken');
    }

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }

    // Hash password
    const hashedPassword = await strapi.plugins['users-permissions'].services.user.hashPassword(
      { password }
    );

    // Create user with all custom fields
    const newUser = await strapi.query('plugin::users-permissions.user').create({
      data: {
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        kvk_number: kvk_number || null,
        company_name: company_name || null,
        street_address: street_address || null,
        postal_code: postal_code || null,
        city: city || null,
        country: country || 'Netherlands',
        sector,
        sub_sector: sub_sector || null,
        role: role.id,
        provider: 'local',
        confirmed: !settings.email_confirmation,
      },
    });

    // Send confirmation email if required
    if (settings.email_confirmation) {
      try {
        await strapi.plugins['users-permissions'].services.user.sendConfirmationEmail(newUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: newUser });
    }

    // Generate JWT
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
      id: newUser.id,
    });

    return ctx.send({
      jwt,
      user: newUser,
    });
  };

  return plugin;
};