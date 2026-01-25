import { format } from 'date-fns';
import type { Metadata } from 'next';
import { getPostBySlug } from '@/services/posts';
import { Serializer } from '../../_components/Serializer';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Страница не найдена',
    };
  }

  const description =
    post.excerpt || post.meta?.description || `Статья: ${post.name}`;

  return {
    title: post.name || 'Статья',
    description: description,
    openGraph: {
      title: post.name || 'Статья',
      description: description,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      url: `/posts/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.name || 'Статья',
      description: description,
    },
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return <div>Страница не найдена</div>;
  }

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.name,
    dateCreated: post.createdAt,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    url: `/posts/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <div>
        <header>
          <h1 className="text-3xl font-bold mb-3.5">{post.name}</h1>
          <time
            dateTime={new Date(post.createdAt).toISOString()}
            className="text-gray-600"
          >
            {format(new Date(post.createdAt), 'dd.MM.yyyy')}
          </time>
        </header>
        {post.content ? <Serializer data={post.content} /> : null}
      </div>
    </>
  );
}
