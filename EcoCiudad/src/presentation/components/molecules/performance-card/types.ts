import { type ViewStyle } from 'react-native';
import { type OperatorPerformance } from '@/domain/entities';

export interface PerformanceCardProps {
  performance: OperatorPerformance;
  containerStyle?: ViewStyle;
}
