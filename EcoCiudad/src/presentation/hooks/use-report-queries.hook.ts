import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Report, type ReportComment, type ReportTimelineEntry } from '@/domain/entities';
import { type ReportFilters } from '@/domain/repositories';
import { container } from '@/presentation/navigation/container';
import { useAuthStore } from '@/presentation/stores';
import { QUERY_KEYS } from '@/constants';

export function useMyReports(filters?: ReportFilters) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, 'my', user?.id, filters],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const result = await container.reportUseCases.getMyReports.execute(user.id, filters);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!user,
  });
}

export function useReportComments(reportId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, reportId, 'comments'],
    queryFn: async () => {
      const result = await container.reportUseCases.getReportComments.execute(reportId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!reportId,
  });
}

export function useAddReportComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: Omit<ReportComment, 'id' | 'createdAt'>) => {
      const result = await container.reportUseCases.addReportComment.execute(comment);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS, variables.reportId, 'comments'] });
    },
  });
}

export function useReportTimeline(reportId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, reportId, 'timeline'],
    queryFn: async () => {
      const result = await container.reportUseCases.getReportTimeline.execute(reportId);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!reportId,
  });
}

export function useCreateReportWithImages() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (data: {
      report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;
      images: string[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const reportWithUser = {
        ...data.report,
        reporterId: user.id,
      };

      const result = await container.reportUseCases.createReport.execute(reportWithUser);
      if (result.left) throw result.left;

      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS, 'my'] });
    },
  });
}
