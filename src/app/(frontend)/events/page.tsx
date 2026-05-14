import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllEvents } from '@/services/events';
import type { EventType } from '@/utils/eventTypes';
import { EVENT_TYPE_LABELS } from '@/utils/eventTypes';

export const metadata: Metadata = {
  title: 'Wydarzenia jubilerskie — Znajdź Jubilera',
  description:
    'Masterclassy, wystawy i warsztaty jubilerskie w Polsce. Przeglądaj wydarzenia, zapisz się i rozwijaj swoje umiejętności.',
  openGraph: {
    title: 'Wydarzenia jubilerskie — Znajdź Jubilera',
    description: 'Masterclassy, wystawy i warsztaty jubilerskie w Polsce.',
    url: '/events',
    locale: 'pl_PL',
  },
  alternates: { canonical: '/events' },
};

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Wydarzenia jubilerskie</h1>
      <p className="text-gray-600 mb-8">
        Masterclassy, wystawy i warsztaty. Znajdź wydarzenie w swoim mieście.
      </p>

      {events.length === 0 ? (
        <p className="text-gray-500">Brak nadchodzących wydarzeń.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow block"
            >
              {event.type ? (
                <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded mb-3">
                  {EVENT_TYPE_LABELS[event.type as EventType] || event.type}
                </span>
              ) : null}
              <h2 className="font-semibold text-lg mb-2">{event.name}</h2>
              {event.excerpt ? (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.excerpt}
                </p>
              ) : null}
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                {event.date ? (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(event.date), 'dd.MM.yyyy')}
                    {event.endDate
                      ? ` — ${format(new Date(event.endDate), 'dd.MM.yyyy')}`
                      : null}
                  </span>
                ) : null}
                {event.city ? (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {event.city}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}