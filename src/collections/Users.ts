import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName'],
  },
  auth: true,
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
      admin: {
        hidden: true,
      },
    },
  ],
};
