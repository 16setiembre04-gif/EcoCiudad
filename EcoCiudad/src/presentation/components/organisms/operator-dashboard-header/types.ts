import { type ViewStyle } from 'react-native';
import { type OperatorStats } from '@/domain/entities';

export interface OperatorDashboardHeaderProps {
  stats: OperatorStats;
  operatorName: string;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  containerStyle?: ViewStyle;
}
