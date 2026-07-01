import { type ViewStyle } from 'react-native';
import { type Report } from '@/domain/entities';

export interface AssignedReportCardProps {
  report: Report;
  onPress?: () => void;
  onStatusChange?: (status: Report['status']) => void;
  containerStyle?: ViewStyle;
}
