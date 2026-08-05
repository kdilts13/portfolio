"use client";

import { useParams } from "next/navigation";

import { useRoutine } from "@/features/routines/hooks/use-routine";

export default function RoutineDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = params.id;
  const routineId = Array.isArray(idParam) ? idParam[0] ?? "" : idParam ?? "";
  const { data: routine, error, isError, isLoading } = useRoutine(routineId);

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Routine detail screen
          </p>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {routine?.name ?? "Routine"}
          </h1>
        </div>

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
          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <p className="text-sm text-muted-foreground">{routine.name}</p>
          </section>
        )}
      </div>
    </main>
  );
}
