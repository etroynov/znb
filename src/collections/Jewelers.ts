import type { CollectionAfterChangeHook, CollectionConfig } from 'payload';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const afterChangeHook: CollectionAfterChangeHook = async ({
  req,
  operation,
  doc,
}) => {
  if (operation !== 'create') return;

  const name = [doc.firstName, doc.lastName].filter(Boolean).join(' ');
  if (!name) return;

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let attempts = 0;
  while (attempts < 10) {
    const existing = await req.payload.find({
      collection: 'businesses',
      where: { slug: { equals: slug } },
      depth: 0,
      limit: 1,
    });
    if (existing.docs.length === 0) break;
    attempts++;
    slug = `${baseSlug}-${attempts}`;
  }

  await req.payload.create({
    collection: 'businesses',
    data: {
      name,
      slug,
      owner: String(doc.id),
      status: 'draft',
    },
  });
};

export const Jewelers: CollectionConfig = {
  slug: 'jewelers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName'],
    group: 'Users',
  },
  auth: true,
  hooks: {
    afterChange: [afterChangeHook],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (user?.role === 'admin')
        return true;
      if (!user) return false;
      return {
        id: { equals: user.id },
      };
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin')
        return true;
      if (!user) return false;
      return {
        id: { equals: user.id },
      };
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin')
        return true;
      return false;
    },
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
      type: 'text',
      name: 'phone',
      label: 'Phone',
    },
    {
      name: 'role',
      type: 'text',
      defaultValue: 'jeweler',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
};