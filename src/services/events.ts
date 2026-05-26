import type { Event } from '@/payload-types';
import { getPayloadClient } from '@/services/payload';
import { validateLimit } from '@/utils/validateLimit';
import { validateSlug } from '@/utils/validateSlug';

const COLLECTION_NAME = 'events' as const;

interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: string;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    validateSlug(slug);

    const payload = await getPayloadClient();
    const startTime = Date.now();

    const { docs } = await payload.find({
      collection: COLLECTION_NAME,
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
    });

    const duration = Date.now() - startTime;

    if (duration > 1000) {
      console.warn(`Slow query for event slug "${slug}": ${duration}ms`);
    }

    return (docs[0] as Event) || null;
  } catch (error) {
    console.error(`Error fetching event by slug "${slug}":`, error);
    throw new Error(
      `Failed to fetch event: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function getAllEvents(options: QueryOptions = {}): Promise<Event[]> {
  try {
    const { limit: rawLimit, offset = 0, sort = '-date' } = options;

    const limit = validateLimit(rawLimit);

    const payload = await getPayloadClient();
    const startTime = Date.now();

    const { docs } = await payload.find({
      collection: COLLECTION_NAME,
      where: {
        _status: { equals: 'published' },
        status: { equals: 'published' },
      },
      limit,
      skip: offset,
      sort,
    });

    const duration = Date.now() - startTime;

    if (duration > 2000) {
      console.warn(
        `Slow query for events list: ${duration}ms, limit: ${limit}, offset: ${offset}`,
      );
    }

    return docs;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error(
      `Failed to fetch events: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}