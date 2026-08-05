import type { RoutineDetail } from '../types';

export const mockRoutineDetails: RoutineDetail[] = [
  {
    id: 'full-body-a',
    name: 'Full Body A',
    version: 3,
    exerciseCount: 4,
    lastCompletedAt: '2026-07-27',
    description: 'A balanced mobility reset for hips, shoulders, and spine.',
    exercises: [
      {
        id: 'full-body-a-worlds-greatest-stretch',
        name: "World's Greatest Stretch",
        instructions:
          'Step into a deep lunge, rotate toward the front leg, then switch sides.',
        measurementType: 'reps',
        targetReps: 6,
        targetDurationSeconds: null,
      },
      {
        id: 'full-body-a-cat-cow',
        name: 'Cat-Cow',
        instructions:
          'Move slowly between spinal flexion and extension while breathing evenly.',
        measurementType: 'reps',
        targetReps: 10,
        targetDurationSeconds: null,
      },
      {
        id: 'full-body-a-hamstring-floss',
        name: 'Hamstring Floss',
        instructions:
          'Extend and soften the front knee from a half-kneeling position.',
        measurementType: 'reps',
        targetReps: 8,
        targetDurationSeconds: null,
      },
      {
        id: 'full-body-a-childs-pose',
        name: "Child's Pose Reach",
        instructions:
          'Sink hips back and walk hands to each side to open the lats.',
        measurementType: 'duration',
        targetReps: null,
        targetDurationSeconds: 45,
      },
    ],
  },
  {
    id: 'upper-body-push-pull',
    name: 'Upper Body Push/Pull',
    version: 1,
    exerciseCount: 3,
    lastCompletedAt: '2026-07-24',
    description: 'Shoulder, chest, and upper-back mobility for pressing and pulling days.',
    exercises: [
      {
        id: 'upper-body-push-pull-doorway-pec',
        name: 'Doorway Pec Stretch',
        instructions:
          'Place forearm on a doorway and gently turn away until the chest opens.',
        measurementType: 'duration',
        targetReps: null,
        targetDurationSeconds: 40,
      },
      {
        id: 'upper-body-push-pull-band-pull-apart',
        name: 'Band Pull-Apart',
        instructions:
          'Pull the band apart at chest height while keeping ribs down.',
        measurementType: 'reps',
        targetReps: 12,
        targetDurationSeconds: null,
      },
      {
        id: 'upper-body-push-pull-thread-the-needle',
        name: 'Thread the Needle',
        instructions:
          'Rotate through the upper back, reaching one arm beneath the body.',
        measurementType: 'reps',
        targetReps: 8,
        targetDurationSeconds: null,
      },
    ],
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    version: 2,
    exerciseCount: 3,
    lastCompletedAt: null,
    description: 'Lower-body mobility focused on hips, quads, and calves.',
    exercises: [
      {
        id: 'leg-day-couch-stretch',
        name: 'Couch Stretch',
        instructions:
          'Set one knee near a wall or bench and squeeze the glute to open the hip.',
        measurementType: 'duration',
        targetReps: null,
        targetDurationSeconds: 45,
      },
      {
        id: 'leg-day-ankle-rocks',
        name: 'Ankle Rocks',
        instructions:
          'Drive the knee forward over the toes while keeping the heel grounded.',
        measurementType: 'reps',
        targetReps: 10,
        targetDurationSeconds: null,
      },
      {
        id: 'leg-day-figure-four',
        name: 'Figure Four Stretch',
        instructions:
          'Cross one ankle over the opposite thigh and draw the legs toward the chest.',
        measurementType: 'duration',
        targetReps: null,
        targetDurationSeconds: 40,
      },
    ],
  },
];
