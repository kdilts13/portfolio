'use client';
import { getIdToken, User } from 'firebase/auth';

export async function apiFetch(path: string, user: User | null = null, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (user) {
    const token = await getIdToken(user, false);
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(path, { ...init, headers });
}

type MeResponse = {
  uid: string;
  email: string;
  approved: boolean;
};

export async function fetchMe(user: User): Promise<MeResponse | null> {
  try {
    const res = await apiFetch('/app-api/me', user);
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as MeResponse;
  } catch {
    return null;
  }
}
