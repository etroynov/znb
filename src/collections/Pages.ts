import type { CollectionConfig } from 'payload';
import { admins, anyone } from '@/access';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
};