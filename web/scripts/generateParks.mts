// tools/generateParksTs.mts
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const WIKI_URL = 'https://en.wikipedia.org/wiki/List_of_national_parks_of_the_United_States';

const rootDir = path.resolve(process.cwd());
const outPath = path.join(rootDir, 'src', 'app', 'data', 'parksData.ts');

type ParkRecord = {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  wikipediaSlug: string;
};

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'kd-portfolio/1.0 (https://example.com)',
      Accept: 'text/html',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Wikipedia page: ${res.status} ${res.statusText}`);
  }

  return await res.text();
}

function parseParks(html: string): ParkRecord[] {
  const $ = cheerio.load(html);

  // The main national parks table is:
  // <table class="wikitable sortable plainrowheaders">
  const table = $('table.wikitable.sortable.plainrowheaders').first();

  if (!table.length) {
    throw new Error('Could not find parks table on Wikipedia page.');
  }

  const parks: ParkRecord[] = [];

  table.find('tr').each((_, row) => {
    const $row = $(row);

    // Park name + slug from the row header
    const headerCell = $row.find('[scope="row"] a').first();
    if (!headerCell.length) {
      return; // skip header row or non-data rows
    }

    const name = headerCell.text().trim();
    const href = headerCell.attr('href') || '';
    if (!href.startsWith('/wiki/')) return;

    const wikipediaSlug = href.replace('/wiki/', '');

    // Find the coordinates cell via <span class="geo">lat;lon</span>
    const coordsSpan = $row.find('span.geo').first();
    let latitude = 0;
    let longitude = 0;

    if (coordsSpan.length) {
      const geoText = coordsSpan.text().trim(); // e.g. "44.35;-68.21"
      const [latStr, lngStr] = geoText.split(';').map((s) => s.trim());
      if (latStr && lngStr) {
        latitude = Number(latStr);
        longitude = Number(lngStr);
      }
    }

    if (!latitude && !longitude) {
      console.warn(`Warning: could not parse coords for ${name}`);
    }

    // state
    const stateCell = $row.children().eq(2);
    let state = '';

    // Get linked state names (handles multiple states)
    const stateLinks = stateCell
      .find('a[title]')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    if (stateLinks.length > 0) {
      state = stateLinks.join(', ');
    } else {
      state = stateCell.text().trim().replace(/\s+/g, ' ');
    }

    if (!state) {
      console.warn(`Warning: could not parse state/location for ${name}`);
    }

    // Create a normalized id from the slug (or name)
    const id = wikipediaSlug
      .replace(/_National_Park$/, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    parks.push({
      id,
      name,
      state,
      latitude,
      longitude,
      wikipediaSlug,
    });
  });

  return parks;
}

function writeParksTs(parks: ParkRecord[]) {
  const entries = parks
    .map(
      (p) => `  {
    id: '${p.id}',
    name: '${p.name.replace(/'/g, "\\'")}',
    state: '${p.state.replace(/'/g, "\\'")}',
    latitude: ${p.latitude},
    longitude: ${p.longitude},
    wikipediaSlug: '${p.wikipediaSlug}',
  }`,
    )
    .join(',\n');

  const ts = `// AUTO-GENERATED from ${WIKI_URL}
// Run: npm run generate:parks

import type { Park } from '@/app/components/parks/types';

export const PARKS: Park[] = [
${entries}
];
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, ts, 'utf8');
  console.log(`Wrote ${parks.length} parks to ${outPath}`);
}

async function main() {
  try {
    console.log('Fetching Wikipedia page…');
    const html = await fetchHtml(WIKI_URL);
    console.log('Parsing parks table…');
    const parks = parseParks(html);
    console.log(`Parsed ${parks.length} parks`);
    writeParksTs(parks);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
