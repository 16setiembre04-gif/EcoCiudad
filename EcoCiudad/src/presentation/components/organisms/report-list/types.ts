import { type ViewStyle } from 'react-native';
import { type Report } from '@/domain/entities';

export interface ReportListProps {
  reports: Report[];
  isLoading?: boolean;
  onReportPress?: (id: string) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}
