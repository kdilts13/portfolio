import type { ActiveWorkout } from '../types';

export const mockActiveWorkouts: ActiveWorkout[] = [
  {
    id: 'active-full-body-a',
    routineId: 'full-body-a',
    routineName: 'Full Body A',
    currentExerciseIndex: 0,
    exercises: [
      {
        id: 'full-body-a-worlds-greatest-stretch',
        name: "World's Greatest Stretch",
        measurementType: 'reps',
        targetReps: 6,
        targetDurationSeconds: null,
        completed: false,
      },
      {
        id: 'full-body-a-cat-cow',
        name: 'Cat-Cow',
        measurementType: 'reps',
        targetReps: 10,
        targetDurationSeconds: null,
        completed: false,
      },
      {
        id: 'full-body-a-hamstring-floss',
        name: 'Hamstring Floss',
        measurementType: 'reps',
        targetReps: 8,
        targetDurationSeconds: null,
        completed: false,
      },
      {
        id: 'full-body-a-childs-pose',
        name: "Child's Pose Reach",
        measurementType: 'duration',
        targetReps: null,
        targetDurationSeconds: 45,
        completed: false,
      },
    ],
  },
];
