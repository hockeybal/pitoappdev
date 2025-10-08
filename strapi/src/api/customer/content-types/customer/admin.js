export default {
  config: {
    list: {
      defaultSort: 'createdAt:DESC',
      layout: [
        'id',
        'user_email', 
        'user',
        'plan',
        'subscription_status',
        'subscription_start_date',
        'createdAt'
      ],
    },
    edit: {
      layout: [
        [
          {
            name: 'user_id',
            size: 6,
          },
          {
            name: 'user_email',
            size: 6,
          }
        ],
        [
          {
            name: 'user',
            size: 6,
          },
          {
            name: 'plan',
            size: 6,
          }
        ],
        [
          {
            name: 'subscription_status',
            size: 4,
          },
          {
            name: 'subscription_start_date',
            size: 4,
          },
          {
            name: 'subscription_end_date',
            size: 4,
          }
        ],
        [
          {
            name: 'mollie_customer_id',
            size: 12,
          }
        ]
      ],
    },
  },
};