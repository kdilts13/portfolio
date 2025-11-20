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

  // The first big table under the "National parks" section:
  // <table class="wikitable sortable plainrowheaders">
  const table = $('table.wikitable').first();
  if (!table.length) {
    throw new Error('Could not find parks table on Wikipedia page.');
  }

  const parks: ParkRecord[] = [];

  table.find('tr').each((_, row) => {
    const $row = $(row);
    const headerCell = $row.find('th[scope="row"] a').first();
    if (!headerCell.length) {
      return; // skip header or weird rows
    }

    const name = headerCell.text().trim();
    const href = headerCell.attr('href') || '';
    if (!href.startsWith('/wiki/')) return;

    const wikipediaSlug = href.replace('/wiki/', '');

    // Location cell is the next <td> after the image cell
    // Row structure: [Name th] [Image td] [Location td] [Coordinates td] ...
    const cells = $row.find('td');
    if (cells.length < 2) {
      return;
    }

    const locationCell = $(cells[1]); // 0 = image, 1 = location
    const locationText = locationCell.text().trim();
    // Wikipedia often lists "State" or "State1, State2"; we'll treat this whole thing as state
    const state = locationText;

    // Coordinates are in the next cell (cells[2]) as a geohack link with DMS and decimal
    // Example text: "44°21′N 68°13′W / 44.35°N 68.21°W / 44.35; -68.21 ( Acadia )"
    let latitude = 0;
    let longitude = 0;

    const coordsCell = $(cells[2]);
    const coordsLink = coordsCell.find('a[href*="geohack"]').first();
    if (coordsLink.length) {
      const coordText = coordsLink.text();
      const match = coordText.match(/([\-0-9.]+);\s*([\-0-9.]+)/);
      if (match) {
        latitude = Number(match[1]);
        longitude = Number(match[2]);
      }
    }

    // Fallback: if parsing failed, you could skip or log – for now, just log
    if (!latitude && !longitude) {
      console.warn(`Warning: could not parse coords for ${name}`);
    }

    // Create a simple, URL-safe id from the name (or tweak to your liking)
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
// Run: node tools/generateParksTs.mts

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
