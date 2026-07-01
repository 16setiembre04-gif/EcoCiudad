import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type CenterReview } from '@/domain/entities';
import { container } from '@/presentation/navigation/container';
import { useAuthStore } from '@/presentation/stores';
import { QUERY_KEYS } from '@/constants';

export function useRecyclingCenterDetails(centerId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, centerId],
    queryFn: async () => {
      const result = await container.recyclingCenterUseCases.getById.execute(centerId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!centerId,
  });
}

export function useNearbyCenters(latitude?: number, longitude?: number, radiusKm?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, 'nearby', latitude, longitude, radiusKm],
    queryFn: async () => {
      if (!latitude || !longitude) return [];
      const result = await container.recyclingCenterUseCases.getNearby.execute(
        latitude,
        longitude,
        radiusKm,
      );
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!latitude && !!longitude,
  });
}

export function useCenterReviews(centerId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, centerId, 'reviews'],
    queryFn: async () => {
      const result = await container.recyclingCenterUseCases.getReviews.execute(centerId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!centerId,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Omit<CenterReview, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>) => {
      const result = await container.recyclingCenterUseCases.addReview.execute(review);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECYCLING_CENTERS, variables.centerId, 'reviews'] });
    },
  });
}

export function useToggleCenterFavorite() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (centerId: string) => {
      if (!user) throw new Error('User not authenticated');
      const result = await container.recyclingCenterUseCases.toggleFavorite.execute(centerId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECYCLING_CENTERS, 'favorites'] });
    },
  });
}

export function useCenterFavorites() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, 'favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const result = await container.recyclingCenterUseCases.getFavorites.execute(user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useIsCenterFavorite(centerId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, centerId, 'favorite', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const result = await container.recyclingCenterUseCases.isFavorite.execute(centerId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!centerId && !!user,
  });
}

export function useCenterRating(centerId: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, centerId, 'rating', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const result = await container.recyclingCenterUseCases.getRating.execute(centerId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!centerId && !!user,
  });
}

export function useSetCenterRating() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ centerId, rating }: { centerId: string; rating: number }) => {
      if (!user) throw new Error('User not authenticated');
      const result = await container.recyclingCenterUseCases.setRating.execute(centerId, user.id, rating);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECYCLING_CENTERS, variables.centerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECYCLING_CENTERS, variables.centerId, 'rating'] });
    },
  });
}

export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const result = await container.recyclingCenterUseCases.markReviewHelpful.execute(reviewId);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECYCLING_CENTERS] });
    },
  });
}

export function useRecyclingCentersDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: allCenters, isLoading: allLoading } = useQuery({
    queryKey: [QUERY_KEYS.RECYCLING_CENTERS, 'all'],
    queryFn: async () => {
      const result = await container.recyclingCenterUseCases.getAll.execute();
      if (result.left) throw result.left;
      return result.right;
    },
  });

  const { data: favorites, isLoading: favoritesLoading } = useCenterFavorites();

  const isLoading = allLoading || favoritesLoading;

  const favoriteIds = favorites?.map((c) => c.id) ?? [];
  const recommendedCenters = (allCenters ?? []).filter((c) => c.rating && c.rating >= 4).slice(0, 10);

  return {
    allCenters: allCenters ?? [],
    favorites: favorites ?? [],
    favoriteIds,
    recommendedCenters,
    isLoading,
    user,
  };
}
