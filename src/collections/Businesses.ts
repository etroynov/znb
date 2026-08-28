import type { CollectionConfig } from 'payload';
import { admins, adminsField, and, inStatus, or, ownedByMe } from '@/access';
import { assignOwner } from '@/hooks/assignOwner';
import {
  moderationStatusField,
  moderationWorkflow,
} from '@/workflow/moderation';

export const Businesses: CollectionConfig = {
  slug: 'businesses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'status', 'type'],
  },
  access: {
    read: or(admins, inStatus('approved'), ownedByMe),
    create: admins,
    update: or(admins, ownedByMe),
    delete: or(admins, and(ownedByMe, inStatus('draft'))),
  },
  hooks: {
    beforeChange: [assignOwner, moderationWorkflow],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'specialization',
      type: 'relationship',
      relationTo: 'specializations',
      label: 'Specialization',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short description',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    moderationStatusField,
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
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type',
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Studio',
          value: 'studio',
        },
        {
          label: 'Sklep',
          value: 'shop',
        },
        {
          label: 'Osoba prywatna',
          value: 'individual',
        },
      ],
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Description',
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
    {
      name: 'city',
      type: 'text',
      label: 'City',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
    },
    {
      name: 'location',
      type: 'group',
      label: 'Coordinates',
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Latitude',
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Longitude',
        },
      ],
    },
    {
      name: 'contacts',
      type: 'array',
      label: 'Contacts',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'Website',
                  value: 'website',
                },
                {
                  label: 'Phone',
                  value: 'phone',
                },
                {
                  label: 'Email',
                  value: 'email',
                },
              ],
            },
            {
              name: 'value',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Socials',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Platform',
              defaultValue: 'Instagram',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              validate: (value: string | null | undefined) => {
                if (!value) {
                  return true;
                }
                try {
                  new URL(value);
                  return true;
                } catch {
                  return 'Please enter a valid URL (e.g., https://instagram.com/username)';
                }
              },
            },
          ],
        },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Service name',
            },
            {
              name: 'price',
              type: 'text',
              label: 'Price',
            },
          ],
        },
      ],
    },
  ],
};