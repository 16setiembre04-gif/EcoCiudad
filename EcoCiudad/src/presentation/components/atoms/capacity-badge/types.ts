import { type ViewStyle } from 'react-native';

export interface CapacityBadgeProps {
  current: number;
  max?: number;
  style?: ViewStyle;
}
