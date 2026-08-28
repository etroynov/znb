import type { CollectionConfig } from 'payload';
import { admins, or, published } from '@/access';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'name',
  },
  versions: {
    drafts: true,
    maxPerDoc: 1,
  },
  access: {
    read: or(admins, published),
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short description for SEO',
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
};