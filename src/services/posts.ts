import type { Post } from '@/payload-types';
import { getPayloadClient } from '@/services/payload';
import { validateLimit } from '@/utils/validateLimit';
import { validateSlug } from '@/utils/validateSlug';

const COLLECTION_NAME = 'posts' as const;

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    validateSlug(slug);

    const payload = await getPayloadClient();
    const startTime = Date.now();

    const { docs } = await payload.find({
      collection: COLLECTION_NAME,
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });

    const duration = Date.now() - startTime;

    if (duration > 1000) {
      console.warn(`Slow query for post slug "${slug}": ${duration}ms`);
    }

    return (docs[0] as Post) || null;
  } catch (error) {
    console.error(`Error fetching post by slug "${slug}":`, error);
    throw new Error(
      `Failed to fetch post: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function getAllPosts(options: any = {}): Promise<Post[]> {
  try {
    const { limit: rawLimit, offset = 0, sort = '-createdAt' } = options;

    const limit = validateLimit(rawLimit);

    const payload = await getPayloadClient();
    const startTime = Date.now();

    const whereClause: any = {};

    const { docs } = await payload.find({
      collection: COLLECTION_NAME,
      where: whereClause,
      limit,
      skip: offset,
      sort,
    });

    const duration = Date.now() - startTime;

    if (duration > 2000) {
      console.warn(
        `Slow query for posts list: ${duration}ms, limit: ${limit}, offset: ${offset}`,
      );
    }

    return docs;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error(
      `Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
