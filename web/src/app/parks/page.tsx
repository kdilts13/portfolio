'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Park, ParkWikiData } from '@/app/components/parks/types';
import ParkList from '@/app/components/parks/ParkList';
import ParkMap from '@/app/components/parks/ParkMap';
import ParkDetailsPanel from '@/app/components/parks/ParkDetailsPanel';
import { PARKS } from '@/app/data/parksData';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function ParksPage() {
  const [parks, setParks] = useState<Park[]>([]);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [visitedParkIds, setVisitedParkIds] = useState<string[]>([]);
  const [wikiData, setWikiData] = useState<ParkWikiData | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showGuestNotice, setShowGuestNotice] = useState(false);
  const [guestNoticeDismissed, setGuestNoticeDismissed] = useState(false);
  const [visitedLoaded, setVisitedLoaded] = useState(false);

  // Load static parks data
  useEffect(() => {
    setParks(PARKS);
  }, []);

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return unsub;
  }, []);

  // Show guest notice when user is not logged in
  useEffect(() => {
    if (!authChecked) return;

    if (user) {
      setShowGuestNotice(false);
      setGuestNoticeDismissed(false);
      return;
    }

    setShowGuestNotice(!guestNoticeDismissed);
  }, [authChecked, user, guestNoticeDismissed]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previousOverflow = document.body.style.overflow;

    if (showGuestNotice) document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showGuestNotice]);

  // Load visited parks for the current user
  useEffect(() => {
    if (!user) {
      setVisitedParkIds([]);
      setVisitedLoaded(false);
      return;
    }

    async function loadVisited() {
      try {
        if (user && user.uid) {
          const ref = doc(db, 'userParks', user.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data() as { visitedParkIds?: string[] };
            setVisitedParkIds(Array.isArray(data.visitedParkIds) ? data.visitedParkIds : []);
          } else {
            setVisitedParkIds([]);
          }
        }
      } catch (err) {
        console.error('Error loading visited parks:', err);
      } finally {
        setVisitedLoaded(true);
      }
    }

    loadVisited();
  }, [user]);

  // Load Wikipedia data for selected park
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

  // Helper to persist visited park IDs for the logged-in user
  async function persistVisited(userId: string, ids: string[]) {
    try {
      const ref = doc(db, 'userParks', userId);
      await setDoc(
        ref,
        {
          visitedParkIds: ids,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (err) {
      console.error('Error saving visited parks:', err);
    }
  }

  const handleToggleVisited = (parkId: string, visited: boolean) => {
    setVisitedParkIds((prev) => {
      const exists = prev.includes(parkId);
      let next = prev;

      if (visited && !exists) {
        next = [...prev, parkId];
      } else if (!visited && exists) {
        next = prev.filter((id) => id !== parkId);
      }

      // Persist for logged-in users (optimistic update)
      if (user) {
        void persistVisited(user.uid, next);
      }

      return next;
    });

    // If not logged in, this just stays in local state for the session.
  };

  const selectedPark = parks.find((p) => p.id === selectedParkId) ?? null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {showGuestNotice && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-primary-blue/40 bg-card p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Dismiss notice"
              onClick={() => {
                setGuestNoticeDismissed(true);
                setShowGuestNotice(false);
              }}
              className="absolute right-3 top-3 rounded-full p-2 text-sm text-muted transition-colors hover:bg-background/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
            >
              X
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Heads up
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">You are browsing as a guest</h2>
            <p className="mt-2 text-sm text-muted">
              Your visited parks won&apos;t be saved between visits unless you log in. Sign in to keep
              your checklist in sync across devices.
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Link
                href="/login"
                className="btn-primary flex-1 text-center"
                onClick={() => {
                  setGuestNoticeDismissed(true);
                  setShowGuestNotice(false);
                }}
              >
                Go to login
              </Link>
              <button
                type="button"
                className="btn-muted px-4"
                onClick={() => {
                  setGuestNoticeDismissed(true);
                  setShowGuestNotice(false);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="
        mx-auto max-w-6xl px-4 py-4
        flex flex-col gap-4
        lg:h-[calc(100vh-4rem)]
        lg:grid
        lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]
        lg:grid-rows-[2fr_1fr]
        lg:gap-4
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
        <div className="lg:col-span-2 lg:row-start-2">
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
