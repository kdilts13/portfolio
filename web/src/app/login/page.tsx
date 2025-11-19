'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const getFirebaseErrorMessage = (err: unknown): string => {
    if (err instanceof FirebaseError) return err.code;
    return 'auth/unknown-error';
  };

  async function handleEmailAuth() {
    setMsg(null);
    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(user).catch(() => {});
        setMsg('Account created. Verification email sent.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e: unknown) {
      setMsg(getFirebaseErrorMessage(e));
    }
  }

  const inputClasses = `w-full rounded-md border border-accent/60 bg-background px-3 py-2
    text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-primary-blue focus-visible:border-primary-blue`;

  return (
    <main className="min-h-screen px-4 py-10 flex items-center justify-center">
      <section className="card w-full max-w-md space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Auth</p>
          <h1 className="text-2xl font-semibold text-foreground">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-sm text-muted">
            Use your email and password, or sign in with Google. This example uses the Firebase
            emulator in development.
          </p>
        </header>

        {!user ? (
          <>
            <div className="space-y-4">
              <label className="block space-y-1 text-sm">
                <span className="text-body">Email</span>
                <input
                  className={inputClasses}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="text-body">Password</span>
                <input
                  type="password"
                  className={inputClasses}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEmailAuth();
                    }
                  }}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button className="btn-primary" onClick={handleEmailAuth}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>

              <button
                type="button"
                className="text-sm text-muted underline underline-offset-2 hover:text-foreground"
                onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
              >
                {mode === 'signin' ? 'Need an account?' : 'Already have an account?'}
              </button>
            </div>

            <button
              type="button"
              className="text-sm text-muted underline underline-offset-2 hover:text-foreground"
              onClick={async () => {
                if (!email) return setMsg('Enter your email first');
                await sendPasswordResetEmail(auth, email);
                setMsg('Password reset email sent (emulator).');
              }}
            >
              Forgot password?
            </button>

            <div className="flex items-center gap-3 text-xs text-muted">
              <div className="h-px flex-1 bg-accent/40" />
              <span>or</span>
              <div className="h-px flex-1 bg-accent/40" />
            </div>

            <button
              type="button"
              className="btn-outline w-full justify-center"
              onClick={async () => {
                await signInWithPopup(auth, new GoogleAuthProvider());
              }}
            >
              Sign in with Google
            </button>

            {msg && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {msg}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="space-y-2 text-sm text-body">
              <p>
                Signed in as{' '}
                <span className="font-medium text-foreground">{user.email ?? user.uid}</span>
              </p>
              {!user.emailVerified && (
                <p className="text-xs text-muted">
                  Your email isn&apos;t verified yet. Some features may be limited.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {!user.emailVerified && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => sendEmailVerification(user)}
                >
                  Resend verification email
                </button>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  auth.signOut();
                  setPassword('');
                }}
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
