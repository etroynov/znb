import type { CollectionBeforeChangeHook, Field } from 'payload';
import { Forbidden } from 'payload';
import { isAdmin } from '@/access';

export const MODERATION_STATUSES = [
  'draft',
  'pending',
  'approved',
  'rejected',
] as const;

export type ModerationStatus = (typeof MODERATION_STATUSES)[number];

/**
 * What a submitter may do to their own document. Admins get no table because
 * moderation exists to constrain the submitter, not the moderator.
 *
 * The verdict states are deliberately unreachable from here: an owner can ask
 * for review, withdraw, and resubmit — never approve themselves.
 */
const OWNER_TRANSITIONS: Record<ModerationStatus, ModerationStatus[]> = {
  draft: ['pending'],
  pending: ['draft'],
  approved: [],
  rejected: ['pending'],
};

export const moderationStatusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'draft' satisfies ModerationStatus,
  label: 'Moderation status',
  admin: { position: 'sidebar' },
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Pending review', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ],
};

export const moderationWorkflow: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (isAdmin(req.user)) return data;

  // Submitters always enter at the bottom of the ladder, whatever they post.
  if (operation === 'create') return { ...data, status: 'draft' };

  const from: ModerationStatus = originalDoc?.status ?? 'draft';
  const to: ModerationStatus = data?.status ?? from;

  if (to !== from && !(OWNER_TRANSITIONS[from] ?? []).includes(to)) {
    throw new Forbidden(req.t);
  }

  // An edit to approved content sends it back for review: otherwise the
  // approval would vouch for content the moderator never saw.
  if (from === 'approved') return { ...data, status: 'pending' };

  return data;
};