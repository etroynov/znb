/**
 * Payload relationship fields are typed `(string | null) | RelatedDoc` — an id
 * string when unpopulated (depth 0), the document itself once populated.
 *
 * Returns the related document's name, or undefined when the relationship is
 * empty or was not populated (an id string is never a usable label).
 */
export function relationName(value: unknown): string | undefined {
  if (value === null || typeof value !== 'object') return undefined;

  const { name } = value as { name?: unknown };
  return typeof name === 'string' ? name : undefined;
}