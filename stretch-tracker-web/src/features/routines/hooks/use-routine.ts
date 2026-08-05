import { useQuery } from '@tanstack/react-query';

import { getRoutine } from '../api/get-routine';

export function useRoutine(id: string) {
  return useQuery({
    queryKey: ['routines', id],
    queryFn: () => getRoutine(id),
    enabled: id.length > 0,
  });
}
