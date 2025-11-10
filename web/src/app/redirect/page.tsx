'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // redirect to /login
      } else {
        setLoading(false); // user is logged in, render content
      }
    });
    return unsub;
  }, [router]);

  if (loading) return <main className="p-6">Loading…</main>;

  return <main className="p-6">This is a protected page.</main>;
}
