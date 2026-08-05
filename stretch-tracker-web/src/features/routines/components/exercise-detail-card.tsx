import type { Exercise } from '../types';

type ExerciseDetailCardProps = {
  exercise: Exercise;
  index: number;
};

function formatTarget(exercise: Exercise) {
  if (exercise.measurementType === 'reps') {
    const reps = exercise.targetReps ?? 0;

    return `${reps} ${reps === 1 ? 'rep' : 'reps'}`;
  }

  const seconds = exercise.targetDurationSeconds ?? 0;

  return `${seconds} sec`;
}

export function ExerciseDetailCard({
  exercise,
  index,
}: ExerciseDetailCardProps) {
  return (
    <article className="w-full max-w-full rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5">
      <div className="flex gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-sm font-medium text-muted-foreground">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="min-w-0 text-base font-semibold leading-6">
              {exercise.name}
            </h3>
            <span className="w-fit rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {formatTarget(exercise)}
            </span>
          </div>

          <p className="break-words text-sm leading-6 text-muted-foreground">
            {exercise.instructions}
          </p>
        </div>
      </div>
    </article>
  );
}
