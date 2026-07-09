import { useQuery } from '@tanstack/react-query';
import { type ReportFilters } from '@/domain/repositories';
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


