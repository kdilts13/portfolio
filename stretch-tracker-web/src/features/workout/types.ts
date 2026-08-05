export type WorkoutExercise = {
  id: string;
  name: string;
  measurementType: 'reps' | 'duration';
  targetReps: number | null;
  targetDurationSeconds: number | null;
  completed: boolean;
};

export type ActiveWorkout = {
  id: string;
  routineId: string;
  routineName: string;
  currentExerciseIndex: number;
  exercises: WorkoutExercise[];
};
