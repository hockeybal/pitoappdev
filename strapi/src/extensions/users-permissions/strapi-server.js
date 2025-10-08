module.exports = (plugin) => {
  // Extend the auth controller
  plugin.controllers.auth = require('./controllers/auth');

  return plugin;
};