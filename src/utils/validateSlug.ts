export const validateSlug = (slug: string) => {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug parameter');
  }

  if (slug.length > 200) {
    throw new Error('Slug too long');
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Invalid slug format');
  }
};
