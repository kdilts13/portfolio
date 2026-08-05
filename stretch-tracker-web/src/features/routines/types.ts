export type Routine = {
  id: string;
  name: string;
  version: number;
  exerciseCount: number;
  lastCompletedAt: string | null;
};

export type Exercise = {
  id: string;
  name: string;
  instructions: string;
  measurementType: 'reps' | 'duration';
  targetReps: number | null;
  targetDurationSeconds: number | null;
};

export type RoutineDetail = Routine & {
  description: string | null;
  exercises: Exercise[];
};
