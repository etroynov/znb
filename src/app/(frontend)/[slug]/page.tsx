import {
  Camera,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import type { OrganizationType } from '@/utils/organizationTypes';
import { ORGANIZATION_TYPE_LABELS } from '@/utils/organizationTypes';
import { Serializer } from '../_components/Serializer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const { docs } = await payload.find({
    collection: 'organizations',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  });

  const org = docs[0];
  if (!org) return { title: 'Not found' };

  return {
    title: org.name,
    description: `${org.name} — ${org.city || 'jubiler'}. Znajdź jubilera w Polsce.`,
    robots: { index: true, follow: true },
    openGraph: {
      title: org.name,
      description: `${org.name} — ${org.city || 'jubiler'} w katalogu Znajdź Jubilera.`,
      type: 'profile',
      url: `/${org.slug}`,
    },
    alternates: {
      canonical: `/${org.slug}`,
    },
  };
}

export default async function JewelerPage({ params }: Props) {
  const { slug } = await params;

  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const { docs } = await payload.find({
    collection: 'organizations',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  });

  const org = docs[0];
  if (!org) notFound();

  const logoUrl =
    org.logo && typeof org.logo !== 'string' ? org.logo.url : null;
  const logoAlt =
    org.logo && typeof org.logo !== 'string'
      ? org.logo.alt || org.name
      : org.name;

  const phoneContact = org.contacts?.find((c) => c.type === 'phone');
  const emailContact = org.contacts?.find((c) => c.type === 'email');
  const websiteContact = org.contacts?.find((c) => c.type === 'website');

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: org.name,
    ...(logoUrl ? { image: logoUrl } : {}),
    ...(phoneContact?.value ? { telephone: phoneContact.value } : {}),
    ...(emailContact?.value ? { email: emailContact.value } : {}),
    ...(websiteContact?.value ? { url: websiteContact.value } : {}),
    ...(org.city || org.address
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(org.address ? { streetAddress: org.address } : {}),
            ...(org.city ? { addressLocality: org.city } : {}),
            addressCountry: 'PL',
          },
        }
      : {}),
    ...(org.location?.lat && org.location?.lng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: org.location.lat,
            longitude: org.location.lng,
          },
        }
      : {}),
    ...(org.services?.filter((s) => s.name).length
      ? {
          makesOffer: org.services
            .filter((s) => s.name)
            .map((s) => ({
              '@type': 'Offer',
              name: s.name,
              ...(s.price ? { price: s.price, priceCurrency: 'PLN' } : {}),
            })),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      {/* Header */}
      <header className="flex items-start gap-6 mb-8">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={logoAlt}
            className="w-24 h-24 object-cover rounded-full shrink-0"
          />
        ) : null}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold">{org.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {org.type ? (
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {ORGANIZATION_TYPE_LABELS[org.type as OrganizationType] ||
                  org.type}
              </span>
            ) : null}
            {org.city ? (
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin size={14} /> {org.city}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {org.content ? (
            <section>
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <div className="prose max-w-none">
                <Serializer data={org.content as any} />
              </div>
            </section>
          ) : null}

          {/* Gallery */}
          {org.gallery && org.gallery.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold mb-3">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {org.gallery.map((item) => {
                  const img =
                    typeof item.image === 'string' ? null : item.image;
                  return img?.url ? (
                    <img
                      key={item.id}
                      src={img.url}
                      alt={img.alt || ''}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : null;
                })}
              </div>
            </section>
          ) : null}

          {/* Services */}
          {org.services && org.services.filter((s) => s.name).length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold mb-3">Services</h2>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-sm">
                        Service
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-sm">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {org.services
                      .filter((s) => s.name)
                      .map((service, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-4 py-2">{service.name}</td>
                          <td className="px-4 py-2">{service.price || '—'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Contacts */}
          {phoneContact || emailContact || websiteContact ? (
            <section>
              <h2 className="text-lg font-semibold mb-3">Contact</h2>
              <ul className="space-y-2">
                {phoneContact?.value ? (
                  <li>
                    <a
                      href={`tel:${phoneContact.value}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <Phone size={16} className="shrink-0" />
                      {phoneContact.value}
                    </a>
                  </li>
                ) : null}
                {emailContact?.value ? (
                  <li>
                    <a
                      href={`mailto:${emailContact.value}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <Mail size={16} className="shrink-0" />
                      {emailContact.value}
                    </a>
                  </li>
                ) : null}
                {websiteContact?.value ? (
                  <li>
                    <a
                      href={websiteContact.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <Globe size={16} className="shrink-0" />
                      {new URL(websiteContact.value).hostname}
                    </a>
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}

          {/* Socials */}
          {org.socials && org.socials.filter((s) => s.link).length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold mb-3">Social Media</h2>
              <ul className="space-y-2">
                {org.socials.map((social, i) => {
                  const Icon =
                    social.name?.toLowerCase() === 'instagram'
                      ? Camera
                      : social.name?.toLowerCase() === 'facebook'
                        ? MessageCircle
                        : Globe;
                  return social.link ? (
                    <li key={i}>
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <Icon size={16} className="shrink-0" />
                        {social.name || 'Link'}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            </section>
          ) : null}

          {/* Address / Location */}
          {org.address || org.city ? (
            <section>
              <h2 className="text-lg font-semibold mb-3">Location</h2>
              <p className="text-sm flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                {[org.address, org.city].filter(Boolean).join(', ')}
              </p>
              {org.location?.lat && org.location?.lng ? (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${org.location.lat}&mlon=${org.location.lng}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                >
                  View on map
                </a>
              ) : null}
            </section>
          ) : null}
        </aside>
      </div>
    </>
  );
}