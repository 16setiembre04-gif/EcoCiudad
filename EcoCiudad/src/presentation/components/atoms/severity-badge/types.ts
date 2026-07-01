import { type ViewStyle } from 'react-native';
import { type ReportSeverity } from '@/domain/entities';

export interface SeverityBadgeProps {
  severity: ReportSeverity;
  style?: ViewStyle;
}
