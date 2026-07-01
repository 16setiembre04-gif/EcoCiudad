import { type ViewStyle } from 'react-native';
import { type ReportPriority } from '@/domain/entities';

export interface PriorityBadgeProps {
  priority: ReportPriority;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}
