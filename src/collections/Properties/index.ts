import type { CollectionConfig } from 'payload';

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'property_type',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['For Sale', 'For Rent', 'Sold'],
      required: true,
    },
    {
      name: 'bedrooms',
      type: 'number',
      required: true,
    },
    {
      name: 'bathrooms',
      type: 'number',
      required: true,
    },
    {
      name: 'area_sqft',
      type: 'number',
      required: true,
    },
    {
      name: 'google_maps_location',
      type: 'text',
      required: true,
    },
  ],
};
