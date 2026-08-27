'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await fetch('/api/jewelers/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    }
    logout();
  }, [router]);

  return <p className="text-center text-gray-500">Logging out...</p>;
}