import { useQuery } from '@tanstack/react-query';

import { getRoutines } from '../api/get-routines';

export function useRoutines() {
  return useQuery({
    queryKey: ['routines'],
    queryFn: getRoutines,
  });
}
