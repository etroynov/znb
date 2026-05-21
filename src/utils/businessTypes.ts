export const BUSINESS_TYPES = ['studio', 'shop', 'individual'] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  studio: 'Studio',
  shop: 'Sklep',
  individual: 'Osoba prywatna',
};
