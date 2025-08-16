import type { CollectionConfig } from 'payload';

export const Developments: CollectionConfig = {
  slug: 'developments',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // ✅ Anyone can read without logging in
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
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },

    // 🔹 Relationship to Properties collection
    {
      name: 'units',
      label: 'Units',
      type: 'relationship',
      relationTo: 'properties', // must match your Properties collection slug
      hasMany: true,
    },

    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'developer',
      type: 'text',
    },
    {
      name: 'status',
      type: 'text', // can change to 'select' with options if needed
    },
    {
      name: 'type',
      type: 'text',
    },
    {
      name: 'communalAmenities',
      label: 'Communal Amenities',
      type: 'array',
      fields: [
        {
          name: 'amenity',
          type: 'text',
        },
      ],
    },

    // 🔹 Relationship for Available Units
    {
      name: 'availableUnits',
      label: 'Available Units',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
    },
  ],
};