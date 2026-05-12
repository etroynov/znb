"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCity = searchParams.get("city") || "";
  const currentType = searchParams.get("type") || "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const search = form.get("search")?.toString().trim();
    const city = form.get("city")?.toString().trim();
    const type = form.get("type")?.toString();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  function clearFilters() {
    router.push("/");
  }

  const hasFilters = currentSearch || currentCity || currentType;

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-3">
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            name="search"
            defaultValue={currentSearch}
            placeholder="Search by name..."
            className="w-full border rounded-lg pl-9 pr-3 py-2"
          />
        </div>
        <input
          name="city"
          defaultValue={currentCity}
          placeholder="City..."
          className="border rounded-lg px-3 py-2 w-40"
        />
        <select
          name="type"
          defaultValue={currentType}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All types</option>
          <option value="studio">Studio</option>
          <option value="shop">Shop</option>
        </select>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          Search
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-500 px-3 py-2"
          >
            <X size={16} /> Clear
          </button>
        ) : null}
      </div>
    </form>
  );
}
