import { type ViewStyle } from 'react-native';
import { type OperatorAction } from '@/domain/entities';

export interface OperatorTimelineDotProps {
  action: OperatorAction;
  isActive?: boolean;
  style?: ViewStyle;
}
