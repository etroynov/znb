'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Service {
  name: string;
  price: string;
}

interface SocialEntry {
  platform: string;
  link: string;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  brandName: string | null;
  specialization: string | null;
  type: 'studio' | 'shop' | 'individual' | null;
  city: string | null;
  address: string | null;
  bio: string | null;
  contacts: { type: string; value: string }[];
  socials: { name: string; link: string }[];
  services: Service[];
  status: string;
  location: { lat: number | null; lng: number | null };
}

const SOCIAL_PLATFORMS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube',
  'Pinterest',
  'Behance',
  'LinkedIn',
  'X (Twitter)',
  'VK',
  'Telegram',
  'Other',
] as const;

type PageState = 'loading' | 'unauthenticated' | 'none' | 'edit';

export default function DashboardPage() {
  const _router = useRouter();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [orgId, setOrgId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<'studio' | 'shop' | 'individual' | ''>('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const [socials, setSocials] = useState<SocialEntry[]>([]);

  const [specializationList, setSpecializationList] = useState<
    { id: string; name: string }[]
  >([]);

  const [services, setServices] = useState<Service[]>([]);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [orgStatus, setOrgStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUser() {
    try {
      const specRes = await fetch('/api/specializations?limit=100', {
        credentials: 'include',
      });
      if (specRes.ok) {
        const specData = await specRes.json();
        setSpecializationList(specData.docs || []);
      }

      const meRes = await fetch('/api/jewelers/me', {
        credentials: 'include',
      });
      if (!meRes.ok) {
        setPageState('unauthenticated');
        return;
      }
      const meData = await meRes.json();
      const userId = meData.user?.id || meData?.id;
      if (!userId) {
        setPageState('unauthenticated');
        return;
      }

      const orgRes = await fetch(
        `/api/businesses?where[owner][equals]=${userId}&depth=0&limit=1`,
        { credentials: 'include' },
      );
      if (!orgRes.ok) {
        setPageState('none');
        return;
      }
      const orgData = await orgRes.json();
      const org: Business | undefined = orgData.docs?.[0];

      if (!org) {
        setPageState('none');
        return;
      }

      setOrgId(org.id);
      setOrgStatus(org.status || 'draft');
      setName(org.name || '');
      setBrandName(org.brandName || '');
      setSpecialization(org.specialization || '');
      setSlug(org.slug || '');
      setType(org.type || '');
      setCity(org.city || '');
      setAddress(org.address || '');
      setBio(org.bio || '');
      setPhone(getContactValue(org.contacts, 'phone'));
      setEmail(getContactValue(org.contacts, 'email'));
      setWebsite(getContactValue(org.contacts, 'website'));
      setSocials(
        (org.socials || [])
          .filter((s) => s.link)
          .map((s) => ({ platform: s.name, link: s.link })),
      );
      setServices(org.services || []);
      setLat(org.location?.lat?.toString() || '');
      setLng(org.location?.lng?.toString() || '');
      setPageState('edit');
    } catch {
      setPageState('unauthenticated');
    }
  }

  function getContactValue(
    contacts: { type: string; value: string }[],
    type: string,
  ): string {
    return contacts?.find((c) => c.type === type)?.value || '';
  }

  function addService() {
    setServices([...services, { name: '', price: '' }]);
  }

  function updateService(
    index: number,
    field: 'name' | 'price',
    value: string,
  ) {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  }

  function removeService(index: number) {
    setServices(services.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const contacts = [];
    if (phone) contacts.push({ type: 'phone', value: phone });
    if (email) contacts.push({ type: 'email', value: email });
    if (website) contacts.push({ type: 'website', value: website });

    const socialsPayload = socials
      .filter((s) => s.platform && s.link)
      .map((s) => ({ name: s.platform, link: s.link }));

    const body: Record<string, unknown> = {
      name,
      brandName: brandName || undefined,
      specialization: specialization || undefined,
      slug,
      type: type || undefined,
      city: city || undefined,
      address: address || undefined,
      bio: bio || undefined,
      contacts,
      socials: socialsPayload,
      services: services.filter((s) => s.name),
      location: {
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
      },
    };

    try {
      const url = `/api/businesses/${orgId}`;
      const method = 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        const msg = err.message || err.errors?.[0]?.message || 'Failed to save';
        const field = err.errors?.[0]?.field;
        if (
          field === 'slug' ||
          msg.toLowerCase().includes('duplicate') ||
          msg.toLowerCase().includes('unique')
        ) {
          setError(
            'This URL slug is already taken. Please choose a different one.',
          );
        } else {
          setError(msg);
        }
        return;
      }

      const saved = await res.json();
      setOrgId(saved.doc?.id || saved?.id);
      setPageState('edit');
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitForReview() {
    if (!orgId) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/businesses/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Failed to submit');
        return;
      }

      setOrgStatus('pending');
    } catch {
      setError('Connection error.');
    } finally {
      setSubmitting(false);
    }
  }

  if (pageState === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (pageState === 'unauthenticated') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <p className="text-gray-500 mb-4">
          You need to log in to manage your profile.
        </p>
        <a
          href="/logowanie"
          className="inline-block bg-black text-white rounded-lg px-6 py-2"
        >
          Log in
        </a>
      </div>
    );
  }

  if (pageState === 'none') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <p className="text-gray-500 mb-4">
          Nie masz jeszcze przypisanego profilu. Skontaktuj się z
          administratorem.
        </p>
        <a
          href="/"
          className="inline-block bg-black text-white rounded-lg px-6 py-2"
        >
          Wróć do strony głównej
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Your Profile</h1>

      {orgId ? (
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              orgStatus === 'approved'
                ? 'bg-green-100 text-green-800'
                : orgStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : orgStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {getStatusLabel()}
          </span>
          {(orgStatus === 'draft' || orgStatus === 'rejected') && (
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for review'}
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          Fill out your profile. After submission, an admin will review it.
        </p>
      )}

      {successMessage ? (
        <p className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          {successMessage}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="brandName"
                className="block text-sm font-medium mb-1"
              >
                Brand name
              </label>
              <input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Kamaryd"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-medium mb-1"
              >
                Specialization
              </label>
              <select
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select specialization</option>
                {specializationList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                URL slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as 'studio' | 'shop' | 'individual' | '',
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select type</option>
                <option value="studio">Studio</option>
                <option value="shop">Sklep</option>
                <option value="individual">Osoba prywatna</option>
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
              >
                Address
              </label>
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-1">
                Short description
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Contacts</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="emailContact"
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="emailContact"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium mb-1"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Social Media</h2>
            <button
              type="button"
              onClick={() =>
                setSocials([...socials, { platform: 'Instagram', link: '' }])
              }
              className="flex items-center gap-1 text-sm text-black underline"
            >
              <Plus size={16} /> Add social
            </button>
          </div>
          {socials.length === 0 ? (
            <p className="text-sm text-gray-400">No social links added yet.</p>
          ) : (
            <div className="space-y-3">
              {socials.map((social, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <select
                    value={social.platform}
                    onChange={(e) => {
                      const updated = [...socials];
                      updated[i] = { ...updated[i], platform: e.target.value };
                      setSocials(updated);
                    }}
                    className="w-40 border rounded-lg px-3 py-2"
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    value={social.link}
                    onChange={(e) => {
                      const updated = [...socials];
                      updated[i] = { ...updated[i], link: e.target.value };
                      setSocials(updated);
                    }}
                    placeholder="https://..."
                    type="url"
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSocials(socials.filter((_, idx) => idx !== i))
                    }
                    className="mt-2 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Services</h2>
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-1 text-sm text-black underline"
            >
              <Plus size={16} /> Add service
            </button>
          </div>
          {services.length === 0 ? (
            <p className="text-sm text-gray-400">No services added yet.</p>
          ) : (
            <div className="space-y-3">
              {services.map((service, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <input
                    value={service.name}
                    onChange={(e) => updateService(i, 'name', e.target.value)}
                    placeholder="Service name"
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <input
                    value={service.price}
                    onChange={(e) => updateService(i, 'price', e.target.value)}
                    placeholder="Price"
                    className="w-32 border rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeService(i)}
                    className="mt-2 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Location */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Location (for map)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium mb-1">
                Latitude
              </label>
              <input
                id="lat"
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="lng" className="block text-sm font-medium mb-1">
                Longitude
              </label>
              <input
                id="lng"
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </section>

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-black text-white rounded-lg px-4 py-3 font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );

  function getStatusLabel() {
    const labels: Record<string, string> = {
      draft: 'Draft — not submitted yet',
      pending: 'Pending review by admin',
      approved: 'Published — visible in catalog',
      rejected: 'Rejected — please check with admin',
    };
    return labels[orgStatus] || orgStatus;
  }
}