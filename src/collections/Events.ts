import type { CollectionConfig } from 'payload';
import {
  admins,
  adminsField,
  and,
  authenticated,
  or,
  ownedByMe,
  published,
  unpublished,
} from '@/access';
import { assignOwner } from '@/hooks/assignOwner';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'date', 'city', 'cancelled'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 1,
  },
  access: {
    read: or(admins, published, ownedByMe),
    create: authenticated,
    update: or(admins, ownedByMe),
    delete: or(admins, and(ownedByMe, unpublished)),
  },
  hooks: {
    beforeChange: [assignOwner],
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
      name: 'cancelled',
      type: 'checkbox',
      label: 'Cancelled',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'A cancelled event stays published so attendees can see it is off.',
      },
    },
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'businesses',
      label: 'Organizer',
      admin: { position: 'sidebar' },
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