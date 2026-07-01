import { type ViewStyle } from 'react-native';
import { type OperatorActivityLog } from '@/domain/entities';

export interface ActivityCardProps {
  activity: OperatorActivityLog;
  containerStyle?: ViewStyle;
}
