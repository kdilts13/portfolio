'use client';
import { getIdToken, User } from 'firebase/auth';

export async function apiFetch(path: string, user: User | null, init: RequestInit = {}) {
  const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const headers = new Headers(init.headers);
  if (user) {
    const token = await getIdToken(user, false);
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (NEXT_PUBLIC_API_BASE) {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, { ...init, headers });
  } else {
    return fetch(path, { ...init, headers });
  }
}

type MeResponse = {
  uid: string;
  email: string;
  approved: boolean;
};

export async function fetchMe(user: User): Promise<MeResponse | null> {
  try {
    const res = await apiFetch('/api/me', user);
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as MeResponse;
  } catch {
    return null;
  }
}
