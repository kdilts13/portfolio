'use client';
import { auth } from '@/lib/firebase';
import { getIdToken, onAuthStateChanged, User } from 'firebase/auth';

let authReady: Promise<User | null> | null = null;
function waitForAuthReady() {
  if (!authReady) {
    authReady = new Promise<User | null>((resolve) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        unsub();
        resolve(u);
      });
    });
  }
  return authReady;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  // Wait for Firebase to finish restoring the session on this page load
  const user = auth.currentUser ?? (await waitForAuthReady());
  const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  console.log('>>> user', user);

  const headers = new Headers(init.headers);
  if (user) {
    const token = await getIdToken(user, false);
    console.log('>>> token', token);
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (NEXT_PUBLIC_API_BASE) {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, { ...init, headers });
  } else {
    return fetch(path, { ...init, headers });
  }
}
