import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type EventFilters } from '@/domain/repositories';
import { type Event, type EventStatus } from '@/domain/entities';
import { container } from '@/presentation/navigation/container';
import { useAuthStore } from '@/presentation/stores';
import { QUERY_KEYS, EVENT_CONSTANTS } from '@/constants';

export function useUpcomingEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, 'upcoming', filters],
    queryFn: async () => {
      const result = await container.eventUseCases.getUpcoming.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useNearbyEvents(latitude?: number, longitude?: number, radiusKm?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, 'nearby', latitude, longitude, radiusKm],
    queryFn: async () => {
      if (!latitude || !longitude) return [];
      const result = await container.eventUseCases.getNearby.execute(
        latitude,
        longitude,
        radiusKm ?? EVENT_CONSTANTS.DEFAULT_RADIUS_KM,
      );
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!latitude && !!longitude,
  });
}

export function usePopularEvents(limit?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, 'popular', limit],
    queryFn: async () => {
      const result = await container.eventUseCases.getPopular.execute(limit ?? EVENT_CONSTANTS.POPULAR_EVENTS_LIMIT);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useCommunityEvents(communityId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, 'community', communityId],
    queryFn: async () => {
      const result = await container.eventUseCases.getCommunityEvents.execute(communityId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!communityId,
  });
}

export function useMyEvents(status?: EventStatus) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, 'my', user?.id, status],
    queryFn: async () => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.eventUseCases.getMyEvents.execute(user.id, status);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useCreateEventWithImages() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (data: {
      event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>;
      images: string[];
    }) => {
      if (!user) throw new Error('Usuario no autenticado');

      const eventWithOrganizer = {
        ...data.event,
        organizerId: user.id,
      };

      const result = await container.eventUseCases.createEvent.execute(eventWithOrganizer);
      if (result.left) throw result.left;

      const event = result.right;

      if (data.images.length > 0) {
        const uploadedUrls = await Promise.all(
          data.images.map(async (uri) => {
            const uploadResult = await container.eventUseCases.uploadImage.execute(event.id, uri);
            if (uploadResult.left) throw uploadResult.left;
            return uploadResult.right;
          }),
        );

        const updateResult = await container.eventUseCases.updateEvent.execute(event.id, {
          imageUrl: uploadedUrls[0],
          bannerUrl: uploadedUrls[0],
        });
        if (updateResult.left) throw updateResult.left;

        return { ...event, imageUrl: uploadedUrls[0], bannerUrl: uploadedUrls[0] };
      }

      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, 'my'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      const result = await container.eventUseCases.updateEvent.execute(id, data);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, variables.id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
  });
}

export function useCancelEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.eventUseCases.cancelEvent.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
  });
}

export function useLeaveEvent() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.eventUseCases.leaveEvent.execute(eventId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, eventId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, 'my'] });
    },
  });
}

export function useEventParticipants(eventId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, eventId, 'participants'],
    queryFn: async () => {
      const result = await container.eventUseCases.getParticipants.execute(eventId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!eventId,
  });
}

export function useIsRegistered(eventId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, eventId, 'registered', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const result = await container.eventUseCases.isRegistered.execute(eventId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!eventId && !!user,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.eventUseCases.toggleFavorite.execute(eventId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, 'favorites'] });
    },
  });
}

export function useEventFavorites() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, 'favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const result = await container.eventUseCases.getFavorites.execute(user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useIsFavorite(eventId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, eventId, 'favorite', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const result = await container.eventUseCases.isFavorite.execute(eventId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!eventId && !!user,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.eventUseCases.markAttendance.execute(eventId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, eventId, 'attendance'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, eventId] });
    },
  });
}

export function useEventAttendance(eventId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, eventId, 'attendance', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const result = await container.eventUseCases.getAttendance.execute(eventId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!eventId && !!user,
  });
}

export function useSetReminder() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      eventId,
      reminderBefore,
      reminderType,
    }: {
      eventId: string;
      reminderBefore: number;
      reminderType: 'push' | 'email' | 'sms';
    }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.eventUseCases.setReminder.execute(eventId, user.id, reminderBefore, reminderType);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS, variables.eventId, 'reminders'] });
    },
  });
}

export function useEventReminders(eventId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, eventId, 'reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const result = await container.eventUseCases.getReminders.execute(eventId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!eventId && !!user,
  });
}

export function useEventDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: upcomingEvents, isLoading: upcomingLoading, refetch: refetchUpcoming } = useUpcomingEvents();
  const { data: popularEvents, isLoading: popularLoading, refetch: refetchPopular } = usePopularEvents();
  const { data: myEvents, isLoading: myEventsLoading, refetch: refetchMyEvents } = useMyEvents();
  const { data: favorites, isLoading: favoritesLoading, refetch: refetchFavorites } = useEventFavorites();

  const isLoading = upcomingLoading || popularLoading || myEventsLoading || favoritesLoading;

  const favoriteIds = favorites?.map((e) => e.id) ?? [];
  const registeredIds = myEvents?.map((e) => e.id) ?? [];

  const refreshAll = async () => {
    await Promise.all([refetchUpcoming(), refetchPopular(), refetchMyEvents(), refetchFavorites()]);
  };

  return {
    upcomingEvents: upcomingEvents ?? [],
    popularEvents: popularEvents ?? [],
    myEvents: myEvents ?? [],
    favorites: favorites ?? [],
    favoriteIds,
    registeredIds,
    isLoading,
    user,
    refreshAll,
  };
}
