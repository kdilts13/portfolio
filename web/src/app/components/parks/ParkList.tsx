import { Park } from '@/app/components/parks/types';
import wikipediaUrlFromSlug from '@/lib/wikipediaUrlHelper';

type ParkListProps = {
  parks: Park[];
  selectedParkId: string | null;
  visitedParkIds: string[];
  onSelectPark: (parkId: string) => void;
  onToggleVisited: (parkId: string, visited: boolean) => void;
};

export default function ParkList({
  parks,
  selectedParkId,
  visitedParkIds,
  onSelectPark,
  onToggleVisited,
}: ParkListProps) {
  // Group parks by state for display
  const parksByState = parks.reduce<Record<string, Park[]>>((acc, park) => {
    if (!acc[park.state]) acc[park.state] = [];
    acc[park.state].push(park);
    return acc;
  }, {});

  return (
    <section className="card flex flex-col">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Parks</p>
        <h2 className="text-lg font-semibold text-foreground">National Parks by state</h2>
        <p className="text-sm text-muted">
          Click a park to select it, or mark it as visited. You can also open its Wikipedia page.
        </p>
      </header>

      <div className="mt-4 max-h-[65vh] overflow-y-auto pr-2">
        {Object.entries(parksByState).map(([state, parksInState]) => (
          <div key={state} className="mb-4 last:mb-0">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              {state}
            </h3>
            <ul className="mt-2 space-y-1">
              {parksInState.map((park) => {
                const isSelected = park.id === selectedParkId;
                const isVisited = visitedParkIds.includes(park.id);
                const wikipediaUrl = wikipediaUrlFromSlug(park.wikipediaSlug);

                return (
                  <li
                    key={park.id}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm hover:bg-card/60"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPark(park.id)}
                      className={`flex-1 text-left ${
                        isSelected ? 'text-primary-blue font-medium' : 'text-body'
                      }`}
                    >
                      {park.name}
                    </button>

                    <label className="flex items-center gap-1 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={isVisited}
                        onChange={(e) => onToggleVisited(park.id, e.target.checked)}
                        className="h-4 w-4 rounded border-accent/60 bg-background text-primary-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-blue"
                      />
                      <span>Visited</span>
                    </label>

                    {wikipediaUrl && (
                      <a
                        href={wikipediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-blue hover:underline"
                      >
                        Wiki
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {parks.length === 0 && (
          <p className="text-sm text-muted">Loading parks… (this will be populated from an API)</p>
        )}
      </div>
    </section>
  );
}
