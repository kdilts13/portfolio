import { mockRoutineDetails } from '../data/mock-routine-details';
import type { RoutineDetail } from '../types';

const ROUTINE_DELAY_MS = 300;

export async function getRoutine(id: string): Promise<RoutineDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, ROUTINE_DELAY_MS));

  const routine = mockRoutineDetails.find((mockRoutine) => mockRoutine.id === id);

  if (!routine) {
    return null;
  }

  return {
    ...routine,
    exercises: routine.exercises.map((exercise) => ({ ...exercise })),
  };
}
