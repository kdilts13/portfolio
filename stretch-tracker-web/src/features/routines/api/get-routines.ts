import { mockRoutines } from '../data/mock-routines';
import type { Routine } from '../types';

const ROUTINES_DELAY_MS = 300;

export async function getRoutines(): Promise<Routine[]> {
  await new Promise((resolve) => setTimeout(resolve, ROUTINES_DELAY_MS));

  return mockRoutines.map((routine) => ({ ...routine }));
}
