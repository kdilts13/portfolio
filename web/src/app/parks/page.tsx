'use client';

import { useEffect, useState } from 'react';
import { Park } from '@/app/components/parks/types';
import ParkList from '@/app/components/parks/ParkList';
import ParkMap from '@/app/components/parks/ParkMap';
import ParkDetailsPanel from '@/app/components/parks/ParkDetailsPanel';

// Temporary stub data until you hook up a real API
const MOCK_PARKS: Park[] = [
  {
    id: 'yosemite',
    name: 'Yosemite National Park',
    state: 'California',
    latitude: 37.8651,
    longitude: -119.5383,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Yosemite_National_Park',
  },
  {
    id: 'zion',
    name: 'Zion National Park',
    state: 'Utah',
    latitude: 37.2982,
    longitude: -113.0263,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Zion_National_Park',
  },
  {
    id: 'arches',
    name: 'Arches National Park',
    state: 'Utah',
    latitude: 38.7331,
    longitude: -109.5925,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Arches_National_Park',
  },
  {
    id: 'grand-canyon',
    name: 'Grand Canyon National Park',
    state: 'Arizona',
    latitude: 36.1069,
    longitude: -112.1129,
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Grand_Canyon_National_Park',
  },
];

export default function ParksPage() {
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [visitedParkIds, setVisitedParkIds] = useState<string[]>([]);
  const [selectedParkSummary, setSelectedParkSummary] = useState<string | null>(null);

  // Placeholder: load parks list (later this should call your backend)
  useEffect(() => {
    async function loadParks() {
      // TODO: Replace this with a real API call, e.g.:
      // const response = await fetch('/api/parks');
      // const data: Park[] = await response.json();
      // setParks(data);
      setParks(MOCK_PARKS);
      setSelectedParkId(MOCK_PARKS[0]?.id ?? null);
    }

    loadParks();
  }, []);

  // Placeholder: load summary for the selected park (e.g., from Wikipedia via your backend)
  useEffect(() => {
    if (!selectedParkId) {
      setSelectedParkSummary(null);
      return;
    }

    const park = parks.find((p) => p.id === selectedParkId);
    if (!park) {
      setSelectedParkSummary(null);
      return;
    }

    // TODO: Replace with real API call:
    // const res = await fetch(`/api/parks/${park.id}/summary`);
    // const { summary } = await res.json();
    // setSelectedParkSummary(summary);

    setSelectedParkSummary(
      `This is where a short description for ${park.name} from Wikipedia or another source will appear.`,
    );
  }, [selectedParkId, parks]);

  const handleSelectPark = (parkId: string) => {
    setSelectedParkId(parkId);
  };

  const handleToggleVisited = (parkId: string, visited: boolean) => {
    setVisitedParkIds((prev) => {
      const exists = prev.includes(parkId);
      if (visited && !exists) {
        return [...prev, parkId];
      }
      if (!visited && exists) {
        return prev.filter((id) => id !== parkId);
      }
      return prev;
    });

    // TODO: Replace this with a persistence call, e.g.:
    // await fetch('/api/visitedParks', { method: 'POST', body: JSON.stringify({ parkId, visited }) });
  };

  const selectedPark = parks.find((p) => p.id === selectedParkId) ?? null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col gap-6 px-4 py-8 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,1.6fr)] lg:gap-8">
        {/* Box 1: list */}
        <ParkList
          parks={parks}
          selectedParkId={selectedParkId}
          visitedParkIds={visitedParkIds}
          onSelectPark={handleSelectPark}
          onToggleVisited={handleToggleVisited}
        />

        {/* Box 2: map (will later be a real map) */}
        <ParkMap
          parks={parks}
          selectedParkId={selectedParkId}
          visitedParkIds={visitedParkIds}
          onSelectPark={handleSelectPark}
          onToggleVisited={handleToggleVisited}
        />

        {/* Box 3: details / blurb */}
        <ParkDetailsPanel park={selectedPark} summary={selectedParkSummary} />
      </div>
    </main>
  );
}
