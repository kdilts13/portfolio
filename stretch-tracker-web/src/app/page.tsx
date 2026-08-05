"use client";

import { Button } from "@/components/ui/button";
import { RoutineCard } from "@/features/routines/components/routine-card";
import { useRoutines } from "@/features/routines/hooks/use-routines";

const doNothing = () => undefined;

export default function Page() {
  const { data: routines, error, isError, isLoading } = useRoutines();

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              My Routines
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Choose a routine to review or begin a workout.
            </p>
          </div>

          <Button type="button" size="lg" className="w-full sm:w-auto">
            New Routine
          </Button>
        </header>

        {isLoading && (
          <section
            aria-label="Loading routines"
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <p className="text-sm text-muted-foreground">Loading routines...</p>
          </section>
        )}

        {isError && (
          <section
            role="alert"
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <p className="font-medium">Routines could not be loaded.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Please try again in a moment."}
            </p>
          </section>
        )}

        {routines && routines.length === 0 && (
          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <p className="font-medium">No routines yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first routine to start tracking your stretching work.
            </p>
          </section>
        )}

        {routines && routines.length > 0 && (
          <section aria-label="Routine list" className="flex flex-col gap-3">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onView={doNothing}
                onStart={doNothing}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
