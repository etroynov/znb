import type { Access, FieldAccess } from 'payload';
import { isAdmin, isJeweler } from './actors';

export const anyone: Access = () => true;

export const nobody: Access = () => false;

export const admins: Access = ({ req: { user } }) => isAdmin(user);

/**
 * Field access is a different type: it answers boolean only, since a `Where`
 * cannot narrow a single field. Use it to freeze privilege-bearing fields
 * (`role`, `owner`) — `admin.readOnly` only hides them in the UI and does not
 * stop a REST/GraphQL write.
 */
export const adminsField: FieldAccess = ({ req: { user } }) => isAdmin(user);

export const authenticated: Access = ({ req: { user } }) => Boolean(user);

/** Documents whose `owner` relationship points at the requesting jeweler. */
export const ownedByMe: Access = ({ req: { user } }) =>
  isJeweler(user) ? { owner: { equals: user.id } } : false;

/** The requesting user's own record inside an auth collection. */
export const self: Access = ({ req: { user } }) =>
  user ? { id: { equals: user.id } } : false;

/**
 * Drafts-enabled collections keep their lifecycle in the reserved `_status`
 * field, not in a hand-rolled `status` select. Keep the two distinct.
 */
export const published: Access = () => ({ _status: { equals: 'published' } });

export const unpublished: Access = () => ({ _status: { equals: 'draft' } });

/** Lifecycle constraint, orthogonal to who is asking. */
export const inStatus =
  (...statuses: string[]): Access =>
  () =>
    statuses.length === 1
      ? { status: { equals: statuses[0] } }
      : { status: { in: statuses } };