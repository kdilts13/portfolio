'use client';
import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {user ? (
        <>
          <div>Signed in as {user.email ?? user.uid}</div>
          <button className="border rounded px-3 py-1" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </>
      ) : (
        <button
          className="border rounded px-3 py-1"
          onClick={async () => {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
          }}
        >
          Sign in with Google
        </button>
      )}
    </main>
  );
}
