'use client';

import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Park } from '@/app/components/parks/types';

type ParkMapProps = {
  parks: Park[];
  selectedParkId: string | null;
  visitedParkIds: string[];
  onSelectPark: (parkId: string) => void;
  onToggleVisited: (parkId: string, visited: boolean) => void;
};

export default function ParkMap({
  parks,
  selectedParkId,
  visitedParkIds,
  onSelectPark,
  onToggleVisited,
}: ParkMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Record<string, google.maps.Marker>>({});
  const [mapReady, setMapReady] = useState(false);

  // 1) Initialize the map using the functional API
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
      return;
    }

    let cancelled = false;

    async function initMap() {
      try {
        // Configure loader options
        setOptions({
          key: apiKey,
          v: 'weekly',
        });

        // Load the Maps library
        const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary;

        if (!mapContainerRef.current || cancelled) return;

        const initialCenter = { lat: 39.8283, lng: -98.5795 }; // Rough center of US

        const map = new Map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 4,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });

        mapRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
      }
    }

    initMap();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Sync markers with parks / selected / visited
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map) return;

    const markers = markersRef.current;

    // Remove markers for parks that no longer exist
    for (const parkId of Object.keys(markers)) {
      if (!parks.find((p) => p.id === parkId)) {
        markers[parkId].setMap(null);
        delete markers[parkId];
      }
    }

    // Add or update markers for current parks
    parks.forEach((park) => {
      const isSelected = park.id === selectedParkId;
      const isVisited = visitedParkIds.includes(park.id);

      const fillColor = isSelected
        ? '#3498DB' // primary blue
        : isVisited
          ? '#2ECC71' // primary green
          : '#E5E7EB'; // neutral grey

      const icon: google.maps.Symbol = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 7 : 5,
        fillColor,
        fillOpacity: 1,
        strokeColor: '#111315',
        strokeOpacity: 1,
        strokeWeight: 1,
      };

      let marker = markers[park.id];

      if (!marker) {
        marker = new google.maps.Marker({
          position: { lat: park.latitude, lng: park.longitude },
          map,
          title: park.name,
          icon,
        });

        marker.addListener('click', () => {
          onSelectPark(park.id);
        });

        markers[park.id] = marker;
      } else {
        marker.setPosition({ lat: park.latitude, lng: park.longitude });
        marker.setIcon(icon);
      }
    });

    // Optional: fit bounds around all parks
    if (parks.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      parks.forEach((park) => {
        bounds.extend({ lat: park.latitude, lng: park.longitude });
      });
      map.fitBounds(bounds);

      const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom() && map.getZoom()! > 10) {
          map.setZoom(10);
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [mapReady, parks, selectedParkId, visitedParkIds, onSelectPark, onToggleVisited]);

  return (
    <section className="card flex flex-col">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Map</p>
        <h2 className="text-lg font-semibold text-foreground">Map view</h2>
        <p className="text-sm text-muted">
          Click a marker to select a park. Visited parks can be tracked from the list and reflected
          here.
        </p>
      </header>

      <div className="mt-4 rounded-lg bg-background/40">
        <div
          ref={mapContainerRef}
          className="h-[260px] w-full rounded-lg sm:h-[320px] lg:h-[380px]"
        />
      </div>
    </section>
  );
}
