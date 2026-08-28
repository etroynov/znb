import { getPayload } from 'payload';
import config from '@/payload.config';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://znajdzjubilera.pl';

  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const { docs: jewelers } = await payload.find({
    collection: 'businesses',
    where: { status: { equals: 'approved' } },
    depth: 0,
    limit: 1000,
    select: { slug: true, updatedAt: true },
  });

  const jewelerUrls = jewelers.map((j) => ({
    url: `${baseUrl}/${j.slug}`,
    lastModified: j.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...jewelerUrls,
  ];
}