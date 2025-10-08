module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/customers/stats',
      handler: 'customer.getStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST', 
      path: '/customers/assign-plan',
      handler: 'customer.assignPlan',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};