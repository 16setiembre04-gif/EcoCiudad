import { type ViewStyle } from 'react-native';
import { type ReportStatus } from '@/domain/entities';

export interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}
