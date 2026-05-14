import { format } from 'date-fns';
import { Building2, Calendar, MapPin, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getEventBySlug } from '@/services/events';
import type { EventType } from '@/utils/eventTypes';
import { EVENT_TYPE_LABELS } from '@/utils/eventTypes';
import { Serializer } from '../../_components/Serializer';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Nie znaleziono wydarzenia' };
  }

  const description = event.excerpt || event.name;

  return {
    title: `${event.name} — Wydarzenia jubilerskie`,
    description,
    openGraph: {
      title: event.name,
      description,
      type: 'article',
      url: `/events/${event.slug}`,
    },
    alternates: {
      canonical: `/events/${event.slug}`,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return <div>Nie znaleziono wydarzenia</div>;
  }

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.excerpt || event.name,
    ...(event.date ? { startDate: new Date(event.date).toISOString() } : {}),
    ...(event.endDate
      ? { endDate: new Date(event.endDate).toISOString() }
      : {}),
    ...(event.city
      ? {
          location: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: event.city,
            },
          },
        }
      : {}),
    ...(event.organizer &&
    typeof event.organizer === 'object' &&
    'name' in event.organizer
      ? {
          organizer: {
            '@type': 'Organization',
            name: event.organizer.name,
          },
        }
      : {}),
    url: `/events/${event.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <div>
        <Link
          href="/events"
          className="text-sm text-gray-500 hover:underline mb-4 inline-block"
        >
          &larr; Wszystkie wydarzenia
        </Link>

        <header className="mb-8">
          {event.type ? (
            <span className="inline-flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full mb-3">
              <Tag size={14} />
              {EVENT_TYPE_LABELS[event.type as EventType] || event.type}
            </span>
          ) : null}
          <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {event.date ? (
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {format(new Date(event.date), 'dd.MM.yyyy')}
                {event.endDate
                  ? ` — ${format(new Date(event.endDate), 'dd.MM.yyyy')}`
                  : null}
              </span>
            ) : null}
            {event.city ? (
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {event.city}
              </span>
            ) : null}
            {event.organizer &&
            typeof event.organizer === 'object' &&
            'slug' in event.organizer ? (
              <Link
                href={`/${event.organizer.slug}`}
                className="flex items-center gap-1 hover:underline"
              >
                <Building2 size={16} /> {event.organizer.name}
              </Link>
            ) : null}
          </div>
        </header>

        {event.description ? <Serializer data={event.description} /> : null}
      </div>
    </>
  );
}