import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type ReportFilters } from '@/domain/repositories';
import { type Report } from '@/domain/entities';
import { container } from '@/presentation/navigation/container';

export function useReports(filters?: ReportFilters) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const result = await container.reportUseCases.getReports.execute(filters);
      if (result.left) throw result.left;
      return result.right;
    },
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: async () => {
      const result = await container.reportUseCases.getReportById.execute(id);
      if (result.left) throw result.left;
      return result.right;
    },
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await container.reportUseCases.createReport.execute(data);
      if (result.left) throw result.left;
      return result.right;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
