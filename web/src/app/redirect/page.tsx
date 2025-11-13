'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function LoggedInOnlyPage() {
  const router = useRouter();
  const { user, me, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, me, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <div>logged in only content here</div>;
}
