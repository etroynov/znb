import { format } from 'date-fns';
import type { Metadata } from 'next';
import { ArticleJsonLd } from 'next-seo';
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
      title: 'Nie znaleziono strony',
    };
  }

  const description =
    post.excerpt || post.meta?.description || `Post: ${post.name}`;

  return {
    title: post.name || 'Post',
    description: description,
    openGraph: {
      title: post.name || 'Post',
      description: description,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      url: `/posts/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.name || 'Post',
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
    return <div>Nie znaleziono strony</div>;
  }

  return (
    <>
      {post.name ? (
        <ArticleJsonLd
          type="BlogPosting"
          headline={post.name}
          datePublished={post.createdAt}
          dateModified={post.updatedAt || post.createdAt}
          url={`/posts/${post.slug}`}
        />
      ) : null}
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