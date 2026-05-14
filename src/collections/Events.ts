import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'date', 'city', 'status'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 1,
  },
  access: {
    read: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === 'admin')
        return true;
      if (user) {
        return {
          or: [
            { status: { equals: 'published' } },
            { owner: { equals: user.id } },
          ],
        } as any;
      }
      return {
        status: { equals: 'published' },
      };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === 'admin')
        return true;
      if (!user) return false;
      return {
        owner: { equals: user.id },
      };
    },
    delete: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === 'admin')
        return true;
      if (!user) return false;
      return {
        owner: { equals: user.id },
        status: { equals: 'draft' },
      };
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (!data?.owner && req.user) {
          return { ...data, owner: req.user.id };
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Event type',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Masterclass', value: 'masterclass' },
        { label: 'Exhibition', value: 'exhibition' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'News', value: 'news' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'published',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'organizations',
      label: 'Organizer',
      admin: { position: 'sidebar' },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'jewelers',
      label: 'Owner',
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'city',
      type: 'text',
      label: 'City',
      admin: { position: 'sidebar' },
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
    },
    {
      name: 'price',
      type: 'text',
      label: 'Price',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: { description: 'Short description for SEO' },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'image',
      type: 'relationship',
      label: 'Cover image',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
};