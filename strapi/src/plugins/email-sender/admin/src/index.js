export default {
  register(app) {
    app.addSettingsLink({
      id: 'email-sender',
      to: '/settings/email-sender',
      intlLabel: {
        id: 'email-sender.plugin.name',
        defaultMessage: 'Email Sender',
      },
      Component: async () => {
        const component = await import('./pages/HomePage');
        return component;
      },
      permissions: [
        {
          action: 'admin::settings.read',
          subject: null,
        },
      ],
    });
  },
  bootstrap(app) {},
};