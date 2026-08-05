import { useQuery } from '@tanstack/react-query';

import { getActiveWorkout } from '../api/get-active-workout';

export function useActiveWorkout(id: string) {
  return useQuery({
    queryKey: ['active-workout', id],
    queryFn: () => getActiveWorkout(id),
    enabled: id.length > 0,
  });
}
