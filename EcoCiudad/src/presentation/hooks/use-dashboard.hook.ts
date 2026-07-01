import { useMemo } from 'react';
import { type Report, type Event, type RecyclingCenter } from '@/domain/entities';
import { useReports } from './use-reports.hook';
import { useEvents } from './use-events.hook';
import { useRecyclingCenters } from './use-recycling-centers.hook';
import { useAuthStore } from '@/presentation/stores';
import { type DashboardStat } from '@/presentation/components/organisms/statistics-section';
import { type RecentReportItem } from '@/presentation/components/organisms/recent-reports';
import { type UpcomingEventItem } from '@/presentation/components/organisms/upcoming-events';
import { type RecyclingCenterItem } from '@/presentation/components/organisms/recycling-centers-list';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

export function useDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: reports, isLoading: reportsLoading, isRefetching: reportsRefetching, refetch: refetchReports } = useReports();
  const { data: upcomingEvents, isLoading: upcomingLoading, isRefetching: upcomingRefetching, refetch: refetchEvents } = useEvents();
  const { data: centers, isLoading: centersLoading, isRefetching: centersRefetching, refetch: refetchCenters } = useRecyclingCenters();

  const isRefreshing = reportsRefetching || upcomingRefetching || centersRefetching;
  const isLoading = reportsLoading || upcomingLoading || centersLoading;

  const stats = useMemo<DashboardStat[]>(() => {
    if (!reports || !user) return [];

    const userReports = reports.filter((r) => r.reporterId === user.id);
    const resolved = userReports.filter((r) => r.status === 'resolved').length;

    return [
      { label: 'Reports', value: userReports.length, iconName: 'report' as const },
      { label: 'Resolved', value: resolved, iconName: 'success' as const, color: '#22C55E' },
      { label: 'Eco Points', value: 0, iconName: 'eco-points' as const },
      { label: 'Level', value: 1, iconName: 'achievement' as const },
    ];
  }, [reports, user]);

  const recentReports = useMemo<RecentReportItem[]>(() => {
    if (!reports) return [];
    return reports.slice(0, 5).map((r: Report) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: mapReportStatus(r.status),
      category: mapCategoryToIcon(r.category),
      location: r.location.address ?? 'Unknown location',
      date: formatDate(r.createdAt),
    }));
  }, [reports]);

  const upcomingEventsList = useMemo<UpcomingEventItem[]>(() => {
    if (!upcomingEvents) return [];
    return upcomingEvents.slice(0, 5).map((e: Event) => ({
      id: e.id,
      title: e.title,
      date: formatDate(e.startDate),
      location: e.location.address,
      category: e.category,
      attendees: e.currentAttendees,
      maxAttendees: e.maxAttendees,
      imageUrl: e.imageUrl,
    }));
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

  const refreshAll = () => {
    refetchReports();
    refetchEvents();
    refetchCenters();
  };

  return {
    stats,
    recentReports,
    upcomingEvents: upcomingEventsList,
    recyclingCenters: recyclingCentersList,
    isLoading,
    isRefreshing,
    refreshAll,
    user,
  };
}
