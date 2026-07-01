import { type ViewStyle } from 'react-native';
import { type ReportStatus } from '@/domain/entities';

export interface StatusIndicatorProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  style?: ViewStyle;
}
