'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      email: form.get('email'),
      password: form.get('password'),
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      phone: form.get('phone'),
    };

    try {
      const res = await fetch('/api/jewelers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        setError(
          err.message || err.errors?.[0]?.message || 'Registration failed',
        );
        return;
      }

      router.push('/moje-konto');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Rejestracja</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-500">
        Already have an account?{' '}
        <Link href="/logowanie" className="text-black underline">
          Log in
        </Link>
      </p>
    </div>
  );
}