import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type AdminActivityLog, type User, type UserRole, type Report, type ReportStatus, type ReportPriority } from '@/domain/entities';
import { type AnalyticsFilters, type ActivityLogFilters, type AdminFilters, type ReportFilters } from '@/domain/repositories';
import { container } from '@/presentation/navigation/container';
import { QUERY_KEYS, ADMIN_CONSTANTS } from '@/constants';

// Dashboard Hooks
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

// Users Management Hooks
export function useAdminUsers(filters?: AdminFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, 'users', filters],
    queryFn: async () => {
      const result = await container.adminUseCases.getUsers.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, 'users', id],
    queryFn: async () => {
      const result = await container.adminUseCases.getUserById.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!id,
  });
}

export function useAdminUserStatistics(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, 'users', id, 'statistics'],
    queryFn: async () => {
      const result = await container.adminUseCases.getUserStatistics.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!id,
  });
}

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const result = await container.adminUseCases.updateUser.execute(id, data);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users', variables.id] });
    },
  });
}

export function useAdminActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.adminUseCases.activateUser.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users', id] });
    },
  });
}

export function useAdminDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.adminUseCases.deactivateUser.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users', id] });
    },
  });
}

export function useAdminSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const result = await container.adminUseCases.suspendUser.execute(id, reason);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users', variables.id] });
    },
  });
}

export function useAdminRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.adminUseCases.restoreUser.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users', id] });
    },
  });
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await container.adminUseCases.deleteUser.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users'] });
    },
  });
}

export function useAdminAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
      const result = await container.adminUseCases.assignRole.execute(id, role);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'users', variables.id] });
    },
  });
}

export function useAdminResetPassword() {
  return useMutation({
    mutationFn: async ({ id, newPassword }: { id: string; newPassword: string }) => {
      const result = await container.adminUseCases.resetPassword.execute(id, newPassword);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

// Reports Management Hooks
export function useAdminReports(filters?: ReportFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, 'reports', filters],
    queryFn: async () => {
      const result = await container.adminUseCases.getReports.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useAdminReport(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN, 'reports', id],
    queryFn: async () => {
      const result = await container.adminUseCases.getReportById.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!id,
  });
}

export function useAdminAssignReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, operatorId }: { reportId: string; operatorId: string }) => {
      const result = await container.adminUseCases.assignReport.execute(reportId, operatorId);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'reports'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'reports', variables.reportId] });
    },
  });
}

export function useAdminUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: ReportStatus }) => {
      const result = await container.adminUseCases.updateReportStatus.execute(reportId, status);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'reports'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'reports', variables.reportId] });
    },
  });
}

export function useAdminUpdateReportPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, priority }: { reportId: string; priority: ReportPriority }) => {
      const result = await container.adminUseCases.updateReportPriority.execute(reportId, priority);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'reports'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN, 'reports', variables.reportId] });
    },
  });
}
