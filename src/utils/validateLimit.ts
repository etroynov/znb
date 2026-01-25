const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export const validateLimit = (limit?: number) => {
  if (limit === undefined) return DEFAULT_LIMIT;

  if (typeof limit !== 'number' || limit < 1) {
    throw new Error('Limit must be a positive number');
  }
  return Math.min(limit, MAX_LIMIT);
};
