"use client";

import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ExerciseDetailCard } from "@/features/routines/components/exercise-detail-card";
import { useRoutine } from "@/features/routines/hooks/use-routine";

import type { RoutineDetail } from "@/features/routines/types";

const doNothing = () => undefined;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatLastCompleted(lastCompletedAt: RoutineDetail["lastCompletedAt"]) {
  if (!lastCompletedAt) {
    return "Never completed";
  }

  return dateFormatter.format(new Date(lastCompletedAt));
}

export default function RoutineDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = params.id;
  const routineId = Array.isArray(idParam) ? idParam[0] ?? "" : idParam ?? "";
  const { data: routine, error, isError, isLoading } = useRoutine(routineId);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-4 py-12 text-foreground sm:px-6 sm:py-16">
      <div
        className="mx-auto flex w-full flex-col gap-8"
        style={{ maxWidth: "min(42rem, calc(100vw - 2rem))" }}
      >
        {isLoading && (
          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <p className="text-sm text-muted-foreground">Loading routine...</p>
          </section>
        )}

        {isError && (
          <section
            role="alert"
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <p className="font-medium">Routine could not be loaded.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Please try again in a moment."}
            </p>
          </section>
        )}

        {!isLoading && !isError && routine === null && (
          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <p className="font-medium">Routine not found.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This routine may have been removed or the link may be incorrect.
            </p>
          </section>
        )}

        {routine && (
          <>
            <header className="flex flex-col gap-6">
              <div className="space-y-3">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Routine detail screen
                  </p>
                  <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    v{routine.version}
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                    {routine.name}
                  </h1>
                  {routine.description && (
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      {routine.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Exercises
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {routine.exerciseCount}{" "}
                    {routine.exerciseCount === 1 ? "exercise" : "exercises"}
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Last completed
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatLastCompleted(routine.lastCompletedAt)}
                  </p>
                </div>
              </div>
            </header>

            <section className="space-y-3" aria-labelledby="exercises-heading">
              <h2
                id="exercises-heading"
                className="text-lg font-semibold tracking-normal"
              >
                Exercises
              </h2>

              <div className="flex flex-col gap-3">
                {routine.exercises.map((exercise, index) => (
                  <ExerciseDetailCard
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                  />
                ))}
              </div>
            </section>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full sm:w-auto"
                onClick={doNothing}
              >
                Back to Routines
              </Button>
              <Button
                type="button"
                className="h-10 w-full sm:w-auto"
                onClick={doNothing}
              >
                Start Workout
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
