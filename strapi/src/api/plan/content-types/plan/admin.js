export default {
  config: {
    list: {
      defaultSort: 'price:ASC',
      layout: [
        'name',
        'price', 
        'sub_text',
        'featured',
        'customers',
        'createdAt'
      ],
    },
    edit: {
      layout: [
        [
          {
            name: 'name',
            size: 6,
          },
          {
            name: 'price',
            size: 6,
          }
        ],
        [
          {
            name: 'sub_text',
            size: 6,
          },
          {
            name: 'featured',
            size: 6,
          }
        ],
        [
          {
            name: 'CTA',
            size: 12,
          }
        ],
        [
          {
            name: 'perks',
            size: 6,
          },
          {
            name: 'additional_perks',
            size: 6,
          }
        ],
        [
          {
            name: 'product',
            size: 6,
          },
          {
            name: 'customers',
            size: 6,
          }
        ]
      ],
    },
  },
};