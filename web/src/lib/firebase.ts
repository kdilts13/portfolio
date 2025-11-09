import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'demo', // emulator accepts any values
  authDomain: 'demo.firebaseapp.com',
  projectId: 'portfolio-dev',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Point Auth SDK at emulator in dev
if (process.env.NODE_ENV !== 'production') {
  // Avoid double-connect on HMR
  // @ts-ignore
  if (!auth._isEmulator)
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
}

setPersistence(auth, browserLocalPersistence).catch(() => {});
