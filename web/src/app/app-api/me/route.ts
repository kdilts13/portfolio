import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE;

function requireEnv(name: string, val?: string) {
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

async function fetchCloudRunIdentityToken(audience: string) {
  // Works on Cloud Run (and other GCP compute) via metadata server.
  const url =
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity' +
    `?audience=${encodeURIComponent(audience)}&format=full`;

  const res = await fetch(url, {
    headers: { 'Metadata-Flavor': 'Google' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch identity token (${res.status}): ${text}`);
  }

  return res.text();
}

export async function GET(req: NextRequest) {
  const apiBase = requireEnv('API_BASE', API_BASE);

  // Firebase ID token should still come from the browser the same way as today.
  const firebaseAuth = req.headers.get('authorization');
  if (!firebaseAuth?.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Missing Firebase token' }, { status: 401 });
  }

  // Cloud Run IAM auth token - audience should match the API origin.
  const identityToken = await fetchCloudRunIdentityToken(apiBase);

  const apiRes = await fetch(`${apiBase}/api/me`, {
    method: 'GET',
    headers: {
      // For Cloud Run invocation auth:
      Authorization: `Bearer ${identityToken}`,
      // For your Spring Boot Firebase auth filter:
      'X-Firebase-Authorization': firebaseAuth,
    },
    cache: 'no-store',
  });

  const bodyText = await apiRes.text();
  return new NextResponse(bodyText, {
    status: apiRes.status,
    headers: {
      'content-type': apiRes.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  });
}
