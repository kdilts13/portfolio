'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ProtectedPage() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/projects')
      .then(async (r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        setData(await r.json());
      })
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Protected Projects</h1>
      {err && <div className="text-red-600">Error: {err}</div>}
      <pre className="text-sm bg-black/5 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
