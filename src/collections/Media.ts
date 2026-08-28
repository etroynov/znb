import type { CollectionConfig } from 'payload';
import {
  admins,
  adminsField,
  anyone,
  authenticated,
  or,
  ownedByMe,
} from '@/access';
import { assignOwner } from '@/hooks/assignOwner';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: or(admins, ownedByMe),
    delete: or(admins, ownedByMe),
  },
  hooks: {
    beforeChange: [assignOwner],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'jewelers',
      label: 'Owner',
      access: {
        create: adminsField,
        update: adminsField,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
};