import { Park } from '@/app/components/parks/types';

type ParkDetailsPanelProps = {
  park: Park | null;
  summary: string | null;
  imageUrl?: string | null;
  pageUrl?: string | null;
};

function wikipediaUrlFromSlug(slug: string | undefined) {
  if (slug) {
    return `https://en.wikipedia.org/wiki/${slug}`;
  } else {
    return null;
  }
}

export default function ParkDetailsPanel({
  park,
  summary,
  imageUrl,
  pageUrl,
}: ParkDetailsPanelProps) {
  const wikipediaUrl = wikipediaUrlFromSlug(park?.wikipediaSlug);

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
            {wikipediaUrl && (
              <>
                {' · '}
                <a
                  href={wikipediaUrl}
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

      <div className="mt-4 space-y-3 text-sm text-body">
        {!park && <p>Select a park from the list or map to see more details.</p>}

        {park && !summary && (
          <p>
            Loading description… (fetched from Wikipedia&apos;s summary API when a park is
            selected).
          </p>
        )}

        {park && summary && <p>{summary}</p>}

        {park && imageUrl && (
          <div className="mt-3">
            {/* If you're using next/image: */}
            {/* <Image src={imageUrl} alt={park.name} width={600} height={400} className="rounded-lg" /> */}
            {/* For now, plain img is ok: */}
            <img
              src={imageUrl}
              alt={park.name}
              className="w-full max-h-72 rounded-lg object-cover"
            />
          </div>
        )}

        {park && (
          <p className="text-xs text-muted mt-2">
            {pageUrl && (
              <>
                Source:{' '}
                <a
                  href={pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:underline"
                >
                  Wikipedia
                </a>
                .{' '}
              </>
            )}
            Text and images are provided by Wikipedia&apos;s summary API and are subject to the CC
            BY-SA 4.0 License.
          </p>
        )}
      </div>
    </section>
  );
}
