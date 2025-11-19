'use client';

import { useEffect, useState } from 'react';
import { Park } from '@/app/components/parks/types';
import ParkList from '@/app/components/parks/ParkList';
import ParkMap from '@/app/components/parks/ParkMap';
import ParkDetailsPanel from '@/app/components/parks/ParkDetailsPanel';

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

  useEffect(() => {
    async function loadParks() {
      // TODO: replace with real API call
      setParks(MOCK_PARKS);
      setSelectedParkId(MOCK_PARKS[0]?.id ?? null);
    }

    loadParks();
  }, []);

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

    // TODO: replace with real API call
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
      if (visited && !exists) return [...prev, parkId];
      if (!visited && exists) return prev.filter((id) => id !== parkId);
      return prev;
    });

    // TODO: persist visited state via API / Firestore
  };

  const selectedPark = parks.find((p) => p.id === selectedParkId) ?? null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className="
          mx-auto max-w-6xl px-4 py-8
          flex flex-col gap-6
          lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:auto-rows-min lg:gap-8
        "
      >
        {/* Box 1: checklist / list (left column) */}
        <ParkList
          parks={parks}
          selectedParkId={selectedParkId}
          visitedParkIds={visitedParkIds}
          onSelectPark={handleSelectPark}
          onToggleVisited={handleToggleVisited}
        />

        {/* Box 2: map (right column) */}
        <ParkMap
          parks={parks}
          selectedParkId={selectedParkId}
          visitedParkIds={visitedParkIds}
          onSelectPark={handleSelectPark}
          onToggleVisited={handleToggleVisited}
        />

        {/* Box 3: details (full width under both) */}
        <div className="lg:col-span-2">
          <ParkDetailsPanel park={selectedPark} summary={selectedParkSummary} />
        </div>
      </div>
    </main>
  );
}
