import { Park } from '@/app/components/parks/types';

type ParkDetailsPanelProps = {
  park: Park | null;
  summary: string | null;
  imageUrl?: string | null;
  pageUrl?: string | null;
};

export default function ParkDetailsPanel({
  park,
  summary,
  imageUrl,
  pageUrl,
}: ParkDetailsPanelProps) {
  const hasSelection = !!park;

  return (
    <section className="card flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      {/* Left side: text */}
      <div className="flex-1 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Details</p>

        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            {park ? park.name : 'Select a park'}
          </h2>
          {park?.state && <span className="text-xs text-muted">{park.state}</span>}
        </div>

        <div className="text-sm text-muted space-y-2 max-h-[10rem] overflow-y-auto pr-1">
          {!hasSelection && (
            <p>
              Choose a park from the list or the map to see a short description and link to its
              Wikipedia page.
            </p>
          )}

          {hasSelection && !summary && <p>Loading description…</p>}

          {hasSelection && summary && <p>{summary}</p>}
        </div>

        {hasSelection && (
          <div className="pt-2">
            {pageUrl && (
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-blue hover:underline"
              >
                View full article on Wikipedia
              </a>
            )}
            <p className="mt-1 text-[11px] text-muted">
              Text and images (when available) are sourced from Wikipedia and are subject to the
              CC&nbsp;BY-SA&nbsp;4.0 license.
            </p>
          </div>
        )}
      </div>

      {/* Right side: smaller image */}
      {hasSelection && imageUrl && (
        <div className="w-full max-w-[220px] lg:w-[220px] flex-shrink-0 self-stretch">
          <div className="h-full rounded-lg bg-background/40 overflow-hidden">
            {/* You can switch this to next/image if you want */}
            <img
              src={imageUrl}
              alt={park?.name ?? 'Park image'}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
}
