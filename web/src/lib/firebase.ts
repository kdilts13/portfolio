import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Point Auth SDK at emulator in dev
if (process.env.NODE_ENV !== 'production') {
  // Avoid double-connect on HMR
  // @ts-expect-error internal field
  if (!auth._isEmulator)
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });

  // Only connect Firestore emulator if not already configured
  // @ts-expect-error internal field
  if (!(db._settings && db._settings.host && db._settings.host.includes('localhost'))) {
    connectFirestoreEmulator(db, '127.0.0.1', 8081);
  }
}

setPersistence(auth, browserLocalPersistence).catch(() => {});
