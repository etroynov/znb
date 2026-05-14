export const ORGANIZATION_TYPES = ['studio', 'shop', 'individual'] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  studio: 'Studio',
  shop: 'Sklep',
  individual: 'Osoba prywatna',
};