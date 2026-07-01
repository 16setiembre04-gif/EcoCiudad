import { type ViewStyle } from 'react-native';
import { type OperatorPerformance } from '@/domain/entities';

export interface PerformanceSummaryProps {
  performance: OperatorPerformance;
  onPeriodChange?: (period: 'day' | 'week' | 'month' | 'year') => void;
  style?: ViewStyle;
}
