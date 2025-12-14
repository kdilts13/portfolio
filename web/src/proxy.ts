import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_HOST = 'kdilts.net';

const ALLOWED_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`, 'localhost']);

function getHostname(req: NextRequest) {
  const hostHeader = req.headers.get('host') || '';
  return hostHeader.split(':')[0].toLowerCase();
}

export function proxy(req: NextRequest) {
  const hostname = getHostname(req);
  const { pathname, search } = req.nextUrl;

  const isAllowed = ALLOWED_HOSTS.has(hostname);

  // Block app-api access from non-canonical hosts
  if (!isAllowed && pathname.startsWith('/app-api')) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403, headers: { 'cache-control': 'no-store' } },
    );
  }

  // Redirect all other traffic to canonical domain
  if (!isAllowed) {
    const url = new URL(`https://${CANONICAL_HOST}${pathname}${search}`);
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
