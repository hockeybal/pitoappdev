module.exports = {
  // Before creating a customer, auto-populate user details
  async beforeCreate(event) {
    const { data } = event.params;
    
    if (data.user && !data.user_id) {
      data.user_id = data.user;
    }
    
    if (data.user && !data.user_email) {
      try {
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', data.user);
        if (user) {
          data.user_email = user.email;
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  },

  // Before updating a customer, sync user details
  async beforeUpdate(event) {
    const { data } = event.params;
    
    if (data.user && !data.user_id) {
      data.user_id = data.user;
    }
    
    if (data.user && !data.user_email) {
      try {
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', data.user);
        if (user) {
          data.user_email = user.email;
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  }
};