import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type AdminActivityLog } from '@/domain/entities';
import { type AnalyticsFilters, type ActivityLogFilters } from '@/domain/repositories';
import { container } from '@/presentation/navigation/container';
import { QUERY_KEYS, ADMIN_CONSTANTS } from '@/constants';

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'stats'],
    queryFn: async () => {
      const result = await container.adminUseCases.getDashboardStats.execute();
      if (result.left) throw result.left;
      return result.right;
    },
    refetchInterval: ADMIN_CONSTANTS.STATS_REFETCH_INTERVAL,
  });
}

export function useAdminActivityData(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_ACTIVITY, filters],
    queryFn: async () => {
      const result = await container.adminUseCases.getActivityData.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useAdminReportsByCategory() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_REPORTS_CATEGORY],
    queryFn: async () => {
      const result = await container.adminUseCases.getReportsByCategory.execute();
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useAdminReportsByDistrict() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_REPORTS_DISTRICT],
    queryFn: async () => {
      const result = await container.adminUseCases.getReportsByDistrict.execute();
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useAdminActivityLogs(filters?: ActivityLogFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_ACTIVITY_LOGS, filters],
    queryFn: async () => {
      const result = await container.adminUseCases.getActivityLogs.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useAdminLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Omit<AdminActivityLog, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await container.adminUseCases.logActivity.execute(activity);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_ACTIVITY_LOGS] });
    },
  });
}

export function useAdminDashboard() {
  const statsQuery = useAdminDashboardStats();
  const activityQuery = useAdminActivityData();
  const categoryQuery = useAdminReportsByCategory();
  const districtQuery = useAdminReportsByDistrict();
  const logsQuery = useAdminActivityLogs({ limit: ADMIN_CONSTANTS.ACTIVITY_LOG_LIMIT });

  return {
    stats: statsQuery.data,
    activityData: activityQuery.data ?? [],
    reportsByCategory: categoryQuery.data ?? [],
    reportsByDistrict: districtQuery.data ?? [],
    recentActivity: logsQuery.data ?? [],
    isLoading: statsQuery.isLoading || activityQuery.isLoading || categoryQuery.isLoading || districtQuery.isLoading || logsQuery.isLoading,
    isError: statsQuery.isError || activityQuery.isError,
    error: statsQuery.error || activityQuery.error,
    refetch: () => {
      statsQuery.refetch();
      activityQuery.refetch();
      categoryQuery.refetch();
      districtQuery.refetch();
      logsQuery.refetch();
    },
  };
}
