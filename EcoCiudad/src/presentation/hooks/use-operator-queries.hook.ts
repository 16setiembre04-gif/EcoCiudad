import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ReportStatus } from '@/domain/entities';
import { type OperatorReportFilters } from '@/domain/repositories';
import { container } from '@/presentation/navigation/container';
import { useAuthStore } from '@/presentation/stores';
import { QUERY_KEYS } from '@/constants';

export function useAssignedReports(filters?: OperatorReportFilters) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, 'assigned', user?.id, filters],
    queryFn: async () => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.getAssignedReports.execute(user.id, filters);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function usePendingReports(filters?: OperatorReportFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, 'pending', filters],
    queryFn: async () => {
      const result = await container.operatorUseCases.getPendingReports.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useReportDetails(reportId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, reportId],
    queryFn: async () => {
      const result = await container.operatorUseCases.getReportDetails.execute(reportId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!reportId,
  });
}

export function useAssignReport() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ reportId, notes }: { reportId: string; notes?: string }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.assignReport.execute(
        reportId,
        user.id,
        user.id,
        notes
      );
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
    },
  });
}

export function useUnassignReport() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (reportId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.unassignReport.execute(reportId, user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      reportId,
      status,
      notes,
    }: {
      reportId: string;
      status: ReportStatus;
      notes?: string;
    }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.updateReportStatus.execute(
        reportId,
        status,
        user.id,
        notes
      );
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS, variables.reportId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
    },
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({
      reportId,
      notes,
      resolutionPhotos,
    }: {
      reportId: string;
      notes: string;
      resolutionPhotos?: string[];
    }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.resolveReport.execute(
        reportId,
        user.id,
        notes,
        resolutionPhotos
      );
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS, variables.reportId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
    },
  });
}

export function useRejectReport() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ reportId, reason }: { reportId: string; reason: string }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.rejectReport.execute(
        reportId,
        user.id,
        reason
      );
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS, variables.reportId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
    },
  });
}

export function useOperatorActivity(limit?: number) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['operator', 'activity', user?.id, limit],
    queryFn: async () => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.getActivity.execute(user.id, limit);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useOperatorStats() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['operator', 'stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.getStats.execute(user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useOperatorPerformance(period: 'day' | 'week' | 'month' | 'year' = 'week') {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['operator', 'performance', user?.id, period],
    queryFn: async () => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.getPerformance.execute(user.id, period);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useTodayRoute() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['operator', 'route', 'today', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.getTodayRoute.execute(user.id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useOptimizeRoute() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (reportIds: string[]) => {
      if (!user) throw new Error('Usuario no autenticado');
      const result = await container.operatorUseCases.optimizeRoute.execute(user.id, reportIds);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operator', 'route'] });
    },
  });
}

export function useOperatorDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useOperatorStats();
  const { data: assignedReports, isLoading: assignedLoading, refetch: refetchAssigned } = useAssignedReports();
  const { data: activity, isLoading: activityLoading, refetch: refetchActivity } = useOperatorActivity(10);
  const { data: performance, isLoading: performanceLoading, refetch: refetchPerformance } = useOperatorPerformance('week');

  const isLoading = statsLoading || assignedLoading || activityLoading || performanceLoading;

  const refreshAll = async () => {
    await Promise.all([refetchStats(), refetchAssigned(), refetchActivity(), refetchPerformance()]);
  };

  return {
    stats,
    assignedReports: assignedReports ?? [],
    recentActivity: activity ?? [],
    performance,
    isLoading,
    user,
    refreshAll,
  };
}
