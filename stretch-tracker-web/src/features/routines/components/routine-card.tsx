import { Button } from '@/components/ui/button';

import type { Routine } from '../types';

type RoutineCardProps = {
  routine: Routine;
  onView?: () => void;
  onStart?: () => void;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatLastCompleted(lastCompletedAt: Routine['lastCompletedAt']) {
  if (!lastCompletedAt) {
    return 'Never completed';
  }

  return dateFormatter.format(new Date(lastCompletedAt));
}

export function RoutineCard({ routine, onView, onStart }: RoutineCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-6">{routine.name}</h3>
            <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
              v{routine.version}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <p>{formatLastCompleted(routine.lastCompletedAt)}</p>
            <p>
              {routine.exerciseCount}{' '}
              {routine.exerciseCount === 1 ? 'exercise' : 'exercises'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onView}
          >
            View
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={onStart}
          >
            Start Workout
          </Button>
        </div>
      </div>
    </article>
  );
}
