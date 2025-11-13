'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function ApprovedOnlyPage() {
  const router = useRouter();
  const { user, me, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user || !me?.approved) {
      router.push('/login');
      return;
    }
  }, [user, me, loading, router]);

  if (loading || !user || !me?.approved) {
    return <div>Loading...</div>;
  }

  return <div>logged in + approved only content here</div>;
}
