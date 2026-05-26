import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { BUSINESS_TYPE_LABELS, isBusinessType } from '@/utils/businessTypes';
import type { Business } from '@/payload-types';
import { SearchForm } from './_components/SearchForm';

function specializationName(
  s: Business['specialization'],
): string | null {
  if (s == null) return null;
  if (typeof s === 'object' && 'name' in s) return s.name;
  return String(s);
}

interface Props {
  searchParams: Promise<{
    search?: string;
    city?: string;
    type?: string;
    specialization?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { search, city, type } = await searchParams;
  const hasFilters = search || city || type;

  const title = hasFilters
    ? `Jubilerzy${city ? ` w ${city}` : ''} — Znajdź jubilera`
    : 'Znajdź jubilera w Polsce — Katalog jubilerów';

  const description = hasFilters
    ? `Lista jubilerów${city ? ` w ${city}` : ''}${type ? ` (${type === 'studio' ? 'studia' : 'sklepy'})` : ''}. Przeglądaj profile, porównuj usługi i ceny.`
    : 'Katalog zaufanych jubilerów w Polsce. Znajdź studio lub sklep jubilerski w swoim mieście. Przeglądaj profile, usługi, ceny i opinie.';

  return {
    title,
    description,
    robots: hasFilters
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      type: 'website',
      url: '/',
      locale: 'pl_PL',
      siteName: 'Znajdź Jubilera',
    },
  };
}

export default async function HomePage({ searchParams }: Props) {
  const { search, city, type, specialization } = await searchParams;

  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const conditions = [
    { status: { equals: 'approved' } },
    ...(search ? [{ name: { contains: search } }] : []),
    ...(city ? [{ city: { contains: city } }] : []),
    ...(type ? [{ type: { equals: type } }] : []),
    ...(specialization ? [{ specialization: { equals: specialization } }] : []),
  ];

  const { docs: jewelers, totalDocs } = await payload.find({
    collection: 'businesses',
    where: { and: conditions },
    limit: 50,
  });

  const hasFilters = search || city || type || specialization;

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: hasFilters ? 'Znalezieni jubilerzy' : 'Katalog jubilerów w Polsce',
    numberOfItems: jewelers.length,
    itemListElement: jewelers.map((j, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: j.name,
        url: `/${j.slug}`,
        ...(j.city ? { address: { addressLocality: j.city } } : {}),
        ...(j.type && isBusinessType(j.type)
          ? {
              description: `Jubiler — ${BUSINESS_TYPE_LABELS[j.type]}`,
            }
          : {}),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div>
        <h1 className="text-4xl font-bold mb-2">Znajdź jubilera</h1>
        <p className="text-gray-600 mb-2">
          Katalog zaufanych studiów i sklepów jubilerskich w Polsce. Przeglądaj
          profile, porównuj usługi i ceny, znajdź jubilera w swoim mieście.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {totalDocs} {totalDocs === 1 ? 'profil' : 'profili'} w katalogu
        </p>

        <SearchForm />

        {jewelers.length === 0 ? (
          <p className="text-gray-500">
            {hasFilters
              ? 'Nie znaleziono jubilerów. Spróbuj zmienić kryteria wyszukiwania.'
              : 'Brak jubilerów w katalogu.'}
          </p>
        ) : (
          <>
            {hasFilters ? (
              <h2 className="text-xl font-semibold mb-4">
                Znaleziono {jewelers.length} jubilerów
              </h2>
            ) : (
              <h2 className="text-xl font-semibold mb-4">Polecani jubilerzy</h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jewelers.map((j) => (
                <Link
                  key={j.id}
                  href={`/${j.slug}`}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow block"
                >
                  {j.logo && typeof j.logo === 'object' && j.logo.url ? (
                    <img
                      src={j.logo.url}
                      alt={j.name || ''}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="w-16 h-16 object-cover rounded mb-3"
                    />
                  ) : null}
                  <span className="font-semibold">{j.name}</span>
                  {j.specialization ? (
                    <p className="text-sm text-gray-500">
                      {specializationName(j.specialization)}
                    </p>
                  ) : null}
                  {j.city ? (
                    <p className="text-sm text-gray-500">{j.city}</p>
                  ) : null}
                  {j.type && isBusinessType(j.type) ? (
                    <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded">
                      {BUSINESS_TYPE_LABELS[j.type]}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}