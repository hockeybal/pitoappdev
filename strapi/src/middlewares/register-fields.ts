export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Only apply to registration endpoint
    if (ctx.request.url === '/api/auth/local/register' && ctx.request.method === 'POST') {
      // Store custom fields temporarily
      const customFields = {
        kvk_number: ctx.request.body.kvk_number,
        company_name: ctx.request.body.company_name,
        street_address: ctx.request.body.street_address,
        postal_code: ctx.request.body.postal_code,
        city: ctx.request.body.city,
        country: ctx.request.body.country,
        sector: ctx.request.body.sector,
        sub_sector: ctx.request.body.sub_sector,
      };
      
      // Store in context state
      ctx.state.customUserFields = customFields;
    }
    
    await next();
  };
};
