import { mockActiveWorkouts } from '../data/mock-active-workout';
import type { ActiveWorkout } from '../types';

const ACTIVE_WORKOUT_DELAY_MS = 300;

export async function getActiveWorkout(
  id: string
): Promise<ActiveWorkout | null> {
  await new Promise((resolve) => setTimeout(resolve, ACTIVE_WORKOUT_DELAY_MS));

  const workout = mockActiveWorkouts.find(
    (mockWorkout) => mockWorkout.id === id
  );

  if (!workout) {
    return null;
  }

  return {
    ...workout,
    exercises: workout.exercises.map((exercise) => ({ ...exercise })),
  };
}
