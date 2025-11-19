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
}: ParkMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Record<string, google.maps.marker.AdvancedMarkerElement>>({});
  const [mapReady, setMapReady] = useState(false);

  // 1. Initialize map using the functional API
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
      return;
    }

    let cancelled = false;

    async function initMap() {
      try {
        // configure API key
        setOptions({
          key: apiKey,
          v: 'weekly',
        });

        // load required libraries
        const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary;
        await importLibrary('marker'); // loads AdvancedMarkerElement

        if (!mapContainerRef.current || cancelled) return;

        const map = new Map(mapContainerRef.current, {
          center: { lat: 39.8283, lng: -98.5795 }, // center of US
          zoom: 4,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        });

        mapRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.error('Google Maps failed to load:', err);
      }
    }

    initMap();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Sync markers (AdvancedMarkerElements)
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map) return;

    const markers = markersRef.current;

    // Remove markers for parks that no longer exist
    for (const id of Object.keys(markers)) {
      if (!parks.find((p) => p.id === id)) {
        markers[id].map = null;
        delete markers[id];
      }
    }

    parks.forEach((park) => {
      const isSelected = park.id === selectedParkId;
      const isVisited = visitedParkIds.includes(park.id);

      // Theme colors
      const fillColor = isSelected
        ? '#3498DB' // blue
        : isVisited
          ? '#2ECC71' // green
          : '#E5E7EB'; // grey
      const borderColor = '#111315';

      // Create an SVG pin using PinElement
      const pin = new google.maps.marker.PinElement({
        scale: isSelected ? 1.2 : 1.0,
        background: fillColor,
        borderColor,
        glyphColor: '#111315',
      });

      let marker = markers[park.id];

      if (!marker) {
        marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: park.latitude, lng: park.longitude },
          title: park.name,
          content: pin.element,
        });

        marker.addListener('click', () => {
          onSelectPark(park.id);
        });

        markers[park.id] = marker;
      } else {
        marker.position = { lat: park.latitude, lng: park.longitude };
        marker.content = pin.element;
      }
    });

    // Optional: fit to bounds
    if (parks.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      parks.forEach((p) => bounds.extend({ lat: p.latitude, lng: p.longitude }));
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
  }, [mapReady, parks, selectedParkId, visitedParkIds, onSelectPark]);

  return (
    <section className="card flex flex-col">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Map</p>
        <h2 className="text-lg font-semibold text-foreground">Map view</h2>
        <p className="text-sm text-muted">
          Click a marker to select a park. Visited parks update the marker color.
        </p>
      </header>

      {/* Map container */}
      <div className="mt-4 rounded-lg bg-background/40">
        <div
          ref={mapContainerRef}
          className="h-[260px] w-full rounded-lg sm:h-[320px] lg:h-[380px]"
        />
      </div>
    </section>
  );
}
