import type { CollectionBeforeChangeHook } from 'payload';
import { isJeweler } from '@/access';

/**
 * Stamps the requesting jeweler as `owner`. The `owner` field itself is frozen
 * by field access, so this hook is the only path that sets it — a jeweler
 * cannot hand a document to someone else, or claim someone else's.
 */
export const assignOwner: CollectionBeforeChangeHook = ({ req, data }) => {
  if (!data?.owner && isJeweler(req.user)) {
    return { ...data, owner: req.user.id };
  }
  return data;
};