import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE;

function requireEnv(name: string, val?: string) {
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function isLocalApiBase(apiBase: string) {
  return (
    apiBase.startsWith('http://localhost') ||
    apiBase.startsWith('http://127.0.0.1') ||
    apiBase.startsWith('https://localhost') ||
    apiBase.startsWith('https://127.0.0.1')
  );
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

async function maybeGetIdentityTokenForApi(apiBase: string) {
  // Local Spring Boot does not need (and cannot fetch) a Cloud Run identity token.
  if (isLocalApiBase(apiBase)) return null;

  // Only Cloud Run (or other GCP compute) will be able to resolve metadata.google.internal.
  return fetchCloudRunIdentityToken(apiBase);
}

export async function GET(req: NextRequest) {
  const apiBase = requireEnv('API_BASE', API_BASE);

  // Cloud Run IAM auth token - audience should match the API origin.
  const token = await maybeGetIdentityTokenForApi(apiBase);

  // Firebase ID token should still come from the browser the same way as today.
  const firebaseAuth = req.headers.get('authorization');
  if (!firebaseAuth?.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Missing Firebase token' }, { status: 401 });
  }

  const apiRes = await fetch(`${apiBase}/api/me`, {
    method: 'GET',
    headers: {
      // For Cloud Run invocation auth:
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
