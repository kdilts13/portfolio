'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fetchMe } from '@/lib/api';

export default function ProtectedPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log('>>> user', user);

      fetchMe().then((me) => {
        console.log('>>> me', me);

        if (!user || !me?.approved) {
          router.push('/login'); // redirect to /login
        } else {
          setLoading(false); // user is logged in, render content
        }
      });
    });
    return unsub;
  }, [router]);

  if (loading) return <main className="p-6">Loading…</main>;

  return <main className="p-6">This is a protected page.</main>;
}
