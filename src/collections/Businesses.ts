import type { CollectionConfig } from 'payload';

export const Businesses: CollectionConfig = {
  slug: 'businesses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'status', 'type'],
  },
  access: {
    read: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === 'admin')
        return true;
      if (user) {
        return {
          or: [
            { status: { equals: 'approved' } },
            { owner: { equals: user.id } },
          ],
        } as any;
      }
      return {
        status: { equals: 'approved' },
      };
    },
    create: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === 'admin')
        return true;
      return false;
    },
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
      ({ req, data, operation, originalDoc }) => {
        const user = req.user as { collection?: string } | undefined;

        if (
          operation === 'create' &&
          !data?.owner &&
          user?.collection === 'jewelers'
        ) {
          return { ...data, owner: req.user!.id };
        }

        if (
          operation === 'update' &&
          'status' in data &&
          data.status !== originalDoc?.status
        ) {
          const isAdmin = (user as any)?.role === 'admin';
          if (!isAdmin && data.status !== 'pending') {
            throw new Error('Only admins can approve or reject businesses');
          }
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      label: 'Status',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'jewelers',
      label: 'Owner',
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
