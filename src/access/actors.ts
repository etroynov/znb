import type { TypedUser } from 'payload';

type MaybeUser = TypedUser | null | undefined;

type AdminUser = Extract<TypedUser, { collection: 'users' }>;
type JewelerUser = Extract<TypedUser, { collection: 'jewelers' }>;

/**
 * Identity is decided by the auth collection first, never by a `role` string
 * alone: `jewelers` is a self-registration collection, so anything stored on a
 * jeweler document is attacker-controlled unless a field access rule freezes it.
 */
export const isAdmin = (user: MaybeUser): user is AdminUser =>
  user?.collection === 'users' && user.role === 'admin';

export const isJeweler = (user: MaybeUser): user is JewelerUser =>
  user?.collection === 'jewelers';