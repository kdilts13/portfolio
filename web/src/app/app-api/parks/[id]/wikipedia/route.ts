import { NextResponse } from 'next/server';
import { PARKS } from '@/app/data/parksData';

type RouteParams = {
  id: string;
};

type RouteContext = {
  params: Promise<RouteParams>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const parkId = id;

  const park = PARKS.find((p) => p.id === parkId);

  if (!park || !('wikipediaSlug' in park) || !park.wikipediaSlug) {
    return NextResponse.json(
      { error: 'Park not found or missing Wikipedia slug' },
      { status: 404 },
    );
  }

  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    park.wikipediaSlug,
  )}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'kd-portfolio/1.0 (https://example.com)',
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch Wikipedia data' }, { status: res.status });
    }

    const data = (await res.json()) as {
      extract?: string;
      thumbnail?: { source?: string };
      content_urls?: { desktop?: { page?: string } };
    };

    const summary = data.extract ?? null;
    const imageUrl = data.thumbnail?.source ?? null;
    const pageUrl =
      data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${park.wikipediaSlug}`;

    return NextResponse.json({
      parkId,
      summary,
      imageUrl,
      pageUrl,
    });
  } catch (err) {
    console.error('Error fetching Wikipedia data:', err);
    return NextResponse.json(
      { error: 'Unexpected error fetching Wikipedia data' },
      { status: 500 },
    );
  }
}
