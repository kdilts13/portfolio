'use client';

import { useEffect, useState } from 'react';
import { Park, ParkWikiData } from '@/app/components/parks/types';
import ParkList from '@/app/components/parks/ParkList';
import ParkMap from '@/app/components/parks/ParkMap';
import ParkDetailsPanel from '@/app/components/parks/ParkDetailsPanel';
import { PARKS } from '@/app/data/parksData';

const MOCK_PARKS: Park[] = PARKS;

export default function ParksPage() {
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [visitedParkIds, setVisitedParkIds] = useState<string[]>([]);
  const [wikiData, setWikiData] = useState<ParkWikiData | null>(null);

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
      setWikiData(null);
      return;
    }

    let cancelled = false;

    async function loadWikipediaSummary() {
      try {
        const res = await fetch(`/app-api/parks/${selectedParkId}/wikipedia`);
        if (!res.ok) {
          if (!cancelled) setWikiData(null);
          return;
        }

        const data: {
          summary: string | null;
          imageUrl: string | null;
          pageUrl: string | null;
        } = await res.json();

        if (!cancelled) {
          setWikiData(data ?? null);
          // Later, if you want image + url in state, you can extend state here
        }
      } catch (err) {
        console.error('Failed to load Wikipedia summary:', err);
        if (!cancelled) setWikiData(null);
      }
    }

    loadWikipediaSummary();

    return () => {
      cancelled = true;
    };
  }, [selectedParkId]);

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
        className={`mx-auto max-w-6xl px-4 py-8 flex flex-col gap-6 lg:grid
          lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:auto-rows-min lg:gap-8`}
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
          <ParkDetailsPanel
            park={selectedPark}
            summary={wikiData?.summary ?? null}
            imageUrl={wikiData?.imageUrl ?? null}
            pageUrl={wikiData?.pageUrl ?? null}
          />
        </div>
      </div>
    </main>
  );
}
