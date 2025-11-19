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
  return (
    <section className="card flex flex-col">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Map</p>
        <h2 className="text-lg font-semibold text-foreground">Map view</h2>
        <p className="text-sm text-muted">
          This will be an interactive map showing each park. For now, this is a placeholder layout
          that you can wire up to a real Maps API later.
        </p>
      </header>

      {/* Map placeholder area */}
      <div className="mt-4 flex min-h-[280px] flex-col items-center justify-center rounded-lg bg-background/40 text-sm text-muted">
        <p>Map placeholder</p>
        <p className="text-xs">TODO: integrate a maps provider and render markers for each park.</p>
      </div>

      {/* Simple marker list to simulate interaction for now */}
      <div className="mt-4 max-h-[200px] overflow-y-auto text-xs text-muted">
        <p className="mb-2 font-medium text-body">Markers (temporary):</p>
        <ul className="space-y-1">
          {parks.map((park) => {
            const isSelected = park.id === selectedParkId;
            const isVisited = visitedParkIds.includes(park.id);

            return (
              <li key={park.id} className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectPark(park.id)}
                  className={`flex-1 text-left ${
                    isSelected ? 'text-primary-blue font-medium' : 'text-body'
                  }`}
                >
                  {park.name}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleVisited(park.id, !isVisited)}
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    isVisited
                      ? 'bg-primary-green/20 text-primary-green'
                      : 'bg-card text-muted hover:text-foreground'
                  }`}
                >
                  {isVisited ? 'Visited' : 'Mark visited'}
                </button>
              </li>
            );
          })}

          {parks.length === 0 && <li className="text-muted">No parks loaded yet.</li>}
        </ul>
      </div>
    </section>
  );
}
