import type { WorkoutExercise } from '../types';

type WorkoutExerciseCardProps = {
  exercise: WorkoutExercise;
};

function formatTarget(exercise: WorkoutExercise) {
  if (exercise.measurementType === 'reps') {
    const reps = exercise.targetReps ?? 0;

    return `${reps} ${reps === 1 ? 'rep' : 'reps'}`;
  }

  const seconds = exercise.targetDurationSeconds ?? 0;

  return `${seconds} sec`;
}

export function WorkoutExerciseCard({ exercise }: WorkoutExerciseCardProps) {
  return (
    <article
      className={
        exercise.completed
          ? 'rounded-lg border border-border bg-muted p-4 text-card-foreground shadow-sm sm:p-5'
          : 'rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5'
      }
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 space-y-2">
          <h3 className="text-base font-semibold leading-6">{exercise.name}</h3>
          <p className="text-sm text-muted-foreground">
            {exercise.completed ? 'Completed' : 'Not completed'}
          </p>
        </div>

        <span className="ml-auto shrink-0 rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {formatTarget(exercise)}
        </span>
      </div>
    </article>
  );
}
