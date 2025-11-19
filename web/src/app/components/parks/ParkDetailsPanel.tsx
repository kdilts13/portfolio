import { Park } from '@/app/components/parks/types';

type ParkDetailsPanelProps = {
  park: Park | null;
  summary: string | null;
};

export default function ParkDetailsPanel({ park, summary }: ParkDetailsPanelProps) {
  return (
    <section className="card flex flex-col">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Details</p>
        <h2 className="text-lg font-semibold text-foreground">
          {park ? park.name : 'Select a park'}
        </h2>
        {park && (
          <p className="text-xs text-muted">
            {park.state}
            {park.wikipediaUrl && (
              <>
                {' · '}
                <a
                  href={park.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:underline"
                >
                  View on Wikipedia
                </a>
              </>
            )}
          </p>
        )}
      </header>

      <div className="mt-4 text-sm text-body">
        {!park && <p>Select a park from the list or map to see more details.</p>}

        {park && !summary && (
          <p>
            Loading description… (this will be populated from an API that fetches a short blurb for
            the selected park).
          </p>
        )}

        {park && summary && <p>{summary}</p>}
      </div>
    </section>
  );
}
