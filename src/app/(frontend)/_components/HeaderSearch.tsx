'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const search = form.get('search')?.toString().trim();
    if (search) {
      router.push(`/?search=${encodeURIComponent(search)}`);
    } else {
      router.push('/');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        name="search"
        defaultValue={currentSearch}
        placeholder="Szukaj..."
        className="w-full border rounded-lg pl-8 pr-3 py-2 text-sm"
      />
    </form>
  );
}