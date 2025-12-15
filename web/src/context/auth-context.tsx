'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';

type MeResponse = {
  uid: string;
  email: string;
  approved: boolean;
};

type AuthState = {
  user: FirebaseUser | null;
  me: MeResponse | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  me: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    me: null,
    loading: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // No Firebase user: clear everything
      if (!user) {
        setState({ user: null, me: null, loading: false });
        return;
      }

      // We have a Firebase user -> fetch /app-api/me once
      try {
        const res = await apiFetch('/app-api/me', user);
        if (!res.ok) {
          // If backend says 401/403/etc, just clear me
          setState({ user, me: null, loading: false });
          return;
        }
        const me = (await res.json()) as MeResponse;
        setState({ user, me, loading: false });
      } catch (err) {
        console.error('Failed to fetch /app-api/me', err);
        setState({ user, me: null, loading: false });
      }
    });

    return unsub;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
