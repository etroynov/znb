"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";

interface Service {
  name: string;
  price: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  type: "studio" | "shop" | null;
  city: string | null;
  address: string | null;
  content: Record<string, unknown> | null;
  contacts: { type: string; value: string }[];
  socials: { name: string; link: string }[];
  services: Service[];
  status: string;
  location: { lat: number | null; lng: number | null };
}

type PageState = "loading" | "unauthenticated" | "create" | "edit";

export default function DashboardPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"studio" | "shop" | "">("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [orgStatus, setOrgStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUser() {
    try {
      const meRes = await fetch("/api/jewelers/me", {
        credentials: "include",
      });
      if (!meRes.ok) {
        setPageState("unauthenticated");
        return;
      }
      const meData = await meRes.json();
      const userId = meData.user?.id || meData?.id;
      if (!userId) {
        setPageState("unauthenticated");
        return;
      }

      const orgRes = await fetch(
        `/api/organizations?where[owner][equals]=${userId}&depth=0&limit=1`,
        { credentials: "include" },
      );
      if (!orgRes.ok) {
        setPageState("create");
        return;
      }
      const orgData = await orgRes.json();
      const org: Organization | undefined = orgData.docs?.[0];

      if (!org) {
        setPageState("create");
        return;
      }

      setOrgId(org.id);
      setOrgStatus(org.status || "draft");
      setName(org.name || "");
      setSlug(org.slug || "");
      setType(org.type || "");
      setCity(org.city || "");
      setAddress(org.address || "");
      setPhone(getContactValue(org.contacts, "phone"));
      setEmail(getContactValue(org.contacts, "email"));
      setWebsite(getContactValue(org.contacts, "website"));
      setInstagram(getSocialValue(org.socials, "Instagram"));
      setFacebook(getSocialValue(org.socials, "Facebook"));
      setServices(org.services || []);
      setLat(org.location?.lat?.toString() || "");
      setLng(org.location?.lng?.toString() || "");
      setPageState("edit");
    } catch {
      setPageState("unauthenticated");
    }
  }

  function getContactValue(
    contacts: { type: string; value: string }[],
    type: string,
  ): string {
    return contacts?.find((c) => c.type === type)?.value || "";
  }

  function getSocialValue(
    socials: { name: string; link: string }[],
    name: string,
  ): string {
    return socials?.find((s) => s.name === name)?.link || "";
  }

  function generateSlug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 200);
  }

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      if (!orgId) {
        setSlug(generateSlug(value));
      }
    },
    [orgId],
  );

  function addService() {
    setServices([...services, { name: "", price: "" }]);
  }

  function updateService(index: number, field: "name" | "price", value: string) {
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
    setError("");

    const contacts = [];
    if (phone) contacts.push({ type: "phone", value: phone });
    if (email) contacts.push({ type: "email", value: email });
    if (website) contacts.push({ type: "website", value: website });

    const socials = [];
    if (instagram) socials.push({ name: "Instagram", link: instagram });
    if (facebook) socials.push({ name: "Facebook", link: facebook });

    const body: Record<string, unknown> = {
      name,
      slug: slug || generateSlug(name),
      type: type || undefined,
      city: city || undefined,
      address: address || undefined,
      contacts,
      socials,
      services: services.filter((s) => s.name),
      location: {
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
      },
    };

    try {
      const url = orgId ? `/api/organizations/${orgId}` : "/api/organizations";
      const method = orgId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || err.errors?.[0]?.message || "Failed to save");
        return;
      }

      const saved = await res.json();
      setOrgId(saved.doc?.id || saved?.id);
      setPageState("edit");
      setSuccessMessage("Profile saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitForReview() {
    if (!orgId) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending" }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to submit");
        return;
      }

      setOrgStatus("pending");
    } catch {
      setError("Connection error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (pageState === "loading") {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (pageState === "unauthenticated") {
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Your Profile</h1>

      {orgId ? (
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              orgStatus === "approved"
                ? "bg-green-100 text-green-800"
                : orgStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : orgStatus === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {getStatusLabel()}
          </span>
          {(orgStatus === "draft" || orgStatus === "rejected") && (
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit for review"}
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
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
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
                onChange={(e) => setType(e.target.value as "studio" | "shop" | "")}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select type</option>
                <option value="studio">Studio</option>
                <option value="shop">Shop</option>
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
              <label htmlFor="address" className="block text-sm font-medium mb-1">
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
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <label htmlFor="emailContact" className="block text-sm font-medium mb-1">
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
              <label htmlFor="website" className="block text-sm font-medium mb-1">
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
          <h2 className="text-lg font-semibold mb-4">Social Media</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium mb-1">
                Instagram URL
              </label>
              <input
                id="instagram"
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium mb-1">
                Facebook URL
              </label>
              <input
                id="facebook"
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/username"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
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
                    onChange={(e) => updateService(i, "name", e.target.value)}
                    placeholder="Service name"
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <input
                    value={service.price}
                    onChange={(e) => updateService(i, "price", e.target.value)}
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

        {error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-black text-white rounded-lg px-4 py-3 font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : orgId ? "Save changes" : "Create profile"}
        </button>
      </form>
    </div>
  );

  function getStatusLabel() {
    const labels: Record<string, string> = {
      draft: "Draft — not submitted yet",
      pending: "Pending review by admin",
      approved: "Published — visible in catalog",
      rejected: "Rejected — please check with admin",
    };
    return labels[orgStatus] || orgStatus;
  }
}
