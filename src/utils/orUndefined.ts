/**
 * Payload types optional fields as `T | null`, while most library props
 * accept only `T | undefined`.
 */
export function orUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}