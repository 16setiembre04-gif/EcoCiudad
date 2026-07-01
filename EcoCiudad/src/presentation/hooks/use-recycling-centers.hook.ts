import { useQuery } from '@tanstack/react-query';
import { type RecyclingCenterFilters } from '@/domain/repositories';
import { container } from '@/presentation/navigation/container';
import { QUERY_KEYS } from '@/constants';

export function useRecyclingCenters(filters?: RecyclingCenterFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, filters],
    queryFn: async () => {
      const result = await container.recyclingCenterUseCases.getAll.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}
