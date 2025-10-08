export default {
  routes: [
    {
      method: 'POST',
      path: '/send',
      handler: 'email-template.send',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};