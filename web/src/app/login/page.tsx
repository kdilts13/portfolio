'use client';
import { auth } from '@/lib/firebase';
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
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function handleEmailAuth() {
    setMsg(null);
    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        // optional: require email verification before API access (see backend step)
        await sendEmailVerification(user).catch(() => {});
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      setMsg(e.code ?? 'auth/error');
    }
  }

  return (
    <main className="p-6 space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">Login</h1>

      {!user ? (
        <>
          <label className="block">
            <div className="text-sm">Email</div>
            <input
              className="border rounded w-full p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <div className="text-sm">Password</div>
            <input
              type="password"
              className="border rounded w-full p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="flex gap-2">
            <button className="border rounded px-3 py-1" onClick={handleEmailAuth}>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
            <button
              className="text-sm underline"
              onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
            >
              {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
            </button>
          </div>

          <button
            className="text-sm underline"
            onClick={async () => {
              if (!email) return setMsg('Enter your email first');
              await sendPasswordResetEmail(auth, email);
              setMsg('Password reset email sent (emulator).');
            }}
          >
            Forgot password?
          </button>

          <div className="pt-2">— or —</div>
          <button
            className="border rounded px-3 py-1"
            onClick={async () => {
              await signInWithPopup(auth, new GoogleAuthProvider());
            }}
          >
            Sign in with Google
          </button>

          {msg && <div className="text-sm text-red-600">{msg}</div>}
        </>
      ) : (
        <>
          <div>Signed in as {user.email ?? user.uid}</div>
          {!user.emailVerified && (
            <button className="text-sm underline" onClick={() => sendEmailVerification(user)}>
              Resend verification email
            </button>
          )}
          <button className="border rounded px-3 py-1" onClick={() => auth.signOut()}>
            Sign out
          </button>
        </>
      )}
    </main>
  );
}
