import type { CollectionConfig } from 'payload';
import { admins, adminsField, or, self } from '@/access';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName'],
  },
  auth: true,
  access: {
    create: admins,
    read: or(admins, self),
    update: or(admins, self),
    delete: admins,
  },
  fields: [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
    },
    {
      name: 'role',
      type: 'text',
      defaultValue: 'admin',
      required: true,
      access: {
        create: adminsField,
        update: adminsField,
      },
      admin: {
        hidden: true,
      },
    },
  ],
};