export const EVENT_TYPES = [
  'masterclass',
  'exhibition',
  'workshop',
  'news',
  'other',
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  masterclass: 'Masterclass',
  exhibition: 'Wystawa',
  workshop: 'Warsztaty',
  news: 'Aktualności',
  other: 'Inne',
};