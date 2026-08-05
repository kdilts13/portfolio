import type { Routine } from '../types';

export const mockRoutines: Routine[] = [
  {
    id: 'full-body-a',
    name: 'Full Body A',
    version: 3,
    exerciseCount: 4,
    lastCompletedAt: '2026-07-27',
  },
  {
    id: 'upper-body-push-pull',
    name: 'Upper Body Push/Pull',
    version: 1,
    exerciseCount: 3,
    lastCompletedAt: '2026-07-24',
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    version: 2,
    exerciseCount: 3,
    lastCompletedAt: null,
  },
];
