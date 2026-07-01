import { type ViewStyle } from 'react-native';
import { type Report } from '@/domain/entities';

export interface AssignedReportsListProps {
  reports: Report[];
  isLoading?: boolean;
  onReportPress?: (id: string) => void;
  onViewAllPress?: () => void;
  title?: string;
  horizontal?: boolean;
  style?: ViewStyle;
}
