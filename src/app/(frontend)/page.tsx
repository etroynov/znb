import { format } from 'date-fns';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@/payload.config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { docs: posts } = await payload.find({
    collection: 'posts',
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {posts.map((p) => (
        <div key={p.id} className="p-4 border">
          <time
            dateTime={new Date(p.createdAt).toISOString()}
            className="block mb-2"
          >
            {format(new Date(p.createdAt), 'dd.MM.yyyy')}
          </time>
          <Link href={`/posts/${p.slug}`} className="block">
            {p.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
