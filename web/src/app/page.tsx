'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function Home() {
  const [message, setMessage] = useState<string>('(loading...)');
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    // Because of next.config rewrites, this hits Spring Boot at :8080
    apiFetch('/api/hello')
      .then((r) => r.text())
      .then(setMessage)
      .catch(() => setMessage('(failed)'));

    apiFetch('/api/me')
      .then((r) => r.text())
      .then((data) => console.log('>>> data', data))
      .catch(() => setMessage('(failed)'));

    // Example: call your /api/info or /actuator/info
    apiFetch('/api/info')
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => setInfo({ error: 'failed' }));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <div className="rounded-2xl border p-4 w-full max-w-xl">
        <div className="text-sm opacity-70">Spring Boot says:</div>
        <div className="text-xl">{message}</div>
      </div>
      <div className="rounded-2xl border p-4 w-full max-w-xl">
        <div className="text-sm opacity-70">Actuator /info:</div>
        <pre className="text-xs overflow-auto">{JSON.stringify(info, null, 2)}</pre>
      </div>
    </main>
  );
}
