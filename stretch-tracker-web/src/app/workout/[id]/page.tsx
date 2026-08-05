"use client";

import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { WorkoutExerciseCard } from "@/features/workout/components/workout-exercise-card";
import { useActiveWorkout } from "@/features/workout/hooks/use-active-workout";

const doNothing = () => undefined;

export default function ActiveWorkoutPage() {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = params.id;
  const workoutId = Array.isArray(idParam) ? idParam[0] ?? "" : idParam ?? "";
  const { data: workout, error, isError, isLoading } =
    useActiveWorkout(workoutId);

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        {isLoading && (
          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <p className="text-sm text-muted-foreground">Loading workout...</p>
          </section>
        )}

        {isError && (
          <section
            role="alert"
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <p className="font-medium">Workout could not be loaded.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Please try again in a moment."}
            </p>
          </section>
        )}

        {!isLoading && !isError && workout === null && (
          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <p className="font-medium">Workout not found.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This workout may have ended or the link may be incorrect.
            </p>
          </section>
        )}

        {workout && (
          <>
            <header className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Active workout
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                  {workout.routineName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Exercise {workout.currentExerciseIndex + 1} of{" "}
                  {workout.exercises.length}
                </p>
              </div>
            </header>

            <section
              className="space-y-4"
              aria-label={`${workout.routineName} workout exercises`}
            >
              {workout.exercises.map((exercise) => (
                <WorkoutExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </section>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full sm:w-auto"
                onClick={doNothing}
              >
                Cancel Workout
              </Button>
              <Button
                type="button"
                className="h-10 w-full sm:w-auto"
                onClick={doNothing}
              >
                Complete Exercise
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
