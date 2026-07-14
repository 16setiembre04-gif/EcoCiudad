import { useQuery } from '@tanstack/react-query';
import { container } from '@/presentation/navigation/container';
import { QUERY_KEYS } from '@/constants';

export function useTruckLocations() {
  return useQuery({
    queryKey: [QUERY_KEYS.TRUCK_LOCATIONS],
    queryFn: async () => {
      const result = await container.truckUseCases.getTruckLocations.execute();
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useTruckLocation(truckId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.TRUCK_LOCATIONS, truckId],
    queryFn: async () => {
      const result = await container.truckUseCases.getTruckLocationById.execute(truckId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!truckId,
  });
}

export function useTruckLocationsByRoute(routeId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.TRUCK_LOCATIONS, 'route', routeId],
    queryFn: async () => {
      const result = await container.truckUseCases.getTruckLocationsByRoute.execute(routeId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!routeId,
  });
}
