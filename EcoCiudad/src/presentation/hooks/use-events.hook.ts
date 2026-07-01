import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type EventFilters } from '@/domain/repositories';
import { container } from '@/presentation/navigation/container';

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const result = await container.eventUseCases.getEvents.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const result = await container.eventUseCases.getEventById.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!id,
  });
}

export function useJoinEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const result = await container.eventUseCases.joinEvent.execute(eventId, userId);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
