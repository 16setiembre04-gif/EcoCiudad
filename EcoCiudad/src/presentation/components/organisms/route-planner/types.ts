import { type ViewStyle } from 'react-native';
import { type Report } from '@/domain/entities';

export interface RoutePlannerProps {
  route: Report[];
  isLoading?: boolean;
  onOptimize?: () => void;
  onStartRoute?: () => void;
  onReportPress?: (id: string) => void;
  style?: ViewStyle;
}
