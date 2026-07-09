import { useMemo } from 'react';
import { type Report, type Event, type RecyclingCenter, type Community } from '@/domain/entities';
import { useReports } from './use-reports.hook';
import { useEvents } from './use-events.hook';
import { useRecyclingCenters } from './use-recycling-centers.hook';
import { useCommunities } from './use-community-queries.hook';
import { useAuthStore } from '@/presentation/stores';
import { type DashboardStat } from '@/presentation/components/organisms/statistics-section';
import { type RecentReportItem } from '@/presentation/components/organisms/recent-reports';
import { type RecyclingCenterItem } from '@/presentation/components/organisms/recycling-centers-list';

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapReportStatus(status: string): 'pending' | 'in-review' | 'resolved' | 'rejected' {
  if (status === 'in_review') return 'in-review';
  return status as 'pending' | 'in-review' | 'resolved' | 'rejected';
}

function mapCategoryToIcon(category: string): 'leaf' | 'water' | 'tree' | 'noise' | 'recycle' | 'help' {
  const map: Record<string, 'leaf' | 'water' | 'tree' | 'noise' | 'recycle' | 'help'> = {
    waste: 'leaf',
    pollution: 'water',
    green_space: 'tree',
    water: 'water',
    noise: 'noise',
    other: 'help',
  };
  return map[category] ?? 'help';
}

function calculateLevelProgress(points: number): { level: number; progress: number; pointsForNextLevel: number } {
  const pointsPerLevel = 100;
  const level = Math.floor(points / pointsPerLevel) + 1;
  const pointsInCurrentLevel = points % pointsPerLevel;
  const progress = pointsInCurrentLevel / pointsPerLevel;
  const pointsForNextLevel = pointsPerLevel - pointsInCurrentLevel;
  return { level, progress, pointsForNextLevel };
}

export function useDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: reports, isLoading: reportsLoading, isRefetching: reportsRefetching, refetch: refetchReports } = useReports();
  const { data: upcomingEvents, isLoading: upcomingLoading, isRefetching: upcomingRefetching, refetch: refetchEvents } = useEvents();
  const { data: centers, isLoading: centersLoading, isRefetching: centersRefetching, refetch: refetchCenters } = useRecyclingCenters();
  const { data: communities, isLoading: communitiesLoading, isRefetching: communitiesRefetching, refetch: refetchCommunities } = useCommunities({});

  const isRefreshing = reportsRefetching || upcomingRefetching || centersRefetching || communitiesRefetching;
  const isLoading = reportsLoading || upcomingLoading || centersLoading || communitiesLoading;

  const ecoPoints = user?.ecoPoints ?? 0;
  const levelInfo = useMemo(() => calculateLevelProgress(ecoPoints), [ecoPoints]);

  const stats = useMemo<DashboardStat[]>(() => {
    if (!reports || !user) return [];

    const userReports = reports.filter((r) => r.reporterId === user.id);
    const resolved = userReports.filter((r) => r.status === 'resolved').length;

    return [
      { label: 'Reportes', value: userReports.length, iconName: 'report' as const },
      { label: 'Resueltos', value: resolved, iconName: 'success' as const, color: '#22C55E' },
      { label: 'Eco Puntos', value: ecoPoints, iconName: 'eco-points' as const },
      { label: 'Nivel', value: levelInfo.level, iconName: 'achievement' as const },
    ];
  }, [reports, user, ecoPoints, levelInfo.level]);

  const recentReports = useMemo<RecentReportItem[]>(() => {
    if (!reports) return [];
    return reports.slice(0, 5).map((r: Report) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: mapReportStatus(r.status),
      category: mapCategoryToIcon(r.category),
      location: r.location.address ?? 'Sin ubicación',
      date: formatDate(r.createdAt),
    }));
  }, [reports]);

  const upcomingEventsList = useMemo<Event[]>(() => {
    if (!upcomingEvents) return [];
    return upcomingEvents.slice(0, 5);
  }, [upcomingEvents]);

  const recyclingCentersList = useMemo<RecyclingCenterItem[]>(() => {
    if (!centers) return [];
    return centers.slice(0, 5).map((c: RecyclingCenter) => ({
      id: c.id,
      name: c.name,
      materials: c.acceptedMaterials,
      rating: c.rating ?? 0,
      phone: c.phone,
      email: c.email,
    }));
  }, [centers]);

  const communitiesList = useMemo(() => {
    if (!communities) return [];
    return communities.slice(0, 5).map((c: Community) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      memberCount: c.memberCount,
      imageUrl: c.coverImageUrl,
    }));
  }, [communities]);

  const refreshAll = () => {
    refetchReports();
    refetchEvents();
    refetchCenters();
    refetchCommunities();
  };

  return {
    stats,
    recentReports,
    upcomingEvents: upcomingEventsList,
    recyclingCenters: recyclingCentersList,
    communities: communitiesList,
    isLoading,
    isRefreshing,
    refreshAll,
    user,
    ecoPoints,
    level: levelInfo.level,
    progress: levelInfo.progress,
    pointsForNextLevel: levelInfo.pointsForNextLevel,
  };
}
