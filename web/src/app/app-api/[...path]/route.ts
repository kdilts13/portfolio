import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

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
  return fetchCloudRunIdentityToken(apiBase);
}

function stripHopByHopHeaders(headers: Headers) {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#hbh
  const hopByHop = [
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
  ];
  hopByHop.forEach((h) => headers.delete(h));
}

function getAppApiPath(req: NextRequest): string[] {
  // req.nextUrl.pathname will look like: "/app-api/me" or "/app-api/ai/evaluate"
  const pathname = req.nextUrl.pathname || '';
  const prefix = '/app-api/';

  if (!pathname.startsWith(prefix)) return [];
  const rest = pathname.slice(prefix.length); // "me" or "ai/evaluate"
  return rest.split('/').filter(Boolean);
}

async function proxy(req: NextRequest) {
  const apiBase = requireEnv('API_BASE', API_BASE);

  // Cloud Run IAM auth token - audience should match the API origin.
  const token = await maybeGetIdentityTokenForApi(apiBase);

  // Firebase ID token should come from the browser.
  const firebaseAuth = req.headers.get('authorization');
  if (!firebaseAuth?.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Missing Firebase token' }, { status: 401 });
  }

  // Forward all headers EXCEPT we do not forward the browser Authorization header to the API.
  // The API service needs Cloud Run invocation auth in Authorization, and Firebase auth in X-Firebase-Authorization.
  const headers = new Headers(req.headers);
  stripHopByHopHeaders(headers);
  headers.delete('host');
  headers.delete('authorization');
  headers.set('X-Firebase-Authorization', firebaseAuth);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const url = new URL(req.url);

  const pathParts = getAppApiPath(req);
  const targetUrl = `${apiBase}/api/${pathParts.join('/')}${url.search}`;

  const method = req.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : req.body;

  const apiRes = await fetch(targetUrl, {
    method,
    headers,
    body,
    // Needed when streaming request bodies (e.g. multipart upload) in Node runtime.
    // @ts-ignore
    duplex: 'half',
    cache: 'no-store',
    redirect: 'manual',
  });

  const resHeaders = new Headers(apiRes.headers);
  stripHopByHopHeaders(resHeaders);
  resHeaders.set('cache-control', 'no-store');

  // Stream the upstream response body through (important for /ai/evaluate).
  return new NextResponse(apiRes.body, {
    status: apiRes.status,
    headers: resHeaders,
  });
}

export async function GET(req: NextRequest) {
  return proxy(req);
}
export async function POST(req: NextRequest) {
  return proxy(req);
}
export async function PUT(req: NextRequest) {
  return proxy(req);
}
export async function PATCH(req: NextRequest) {
  return proxy(req);
}
export async function DELETE(req: NextRequest) {
  return proxy(req);
}
export async function OPTIONS(req: NextRequest) {
  return proxy(req);
}
