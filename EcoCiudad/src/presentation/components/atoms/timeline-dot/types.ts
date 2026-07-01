import { type ViewStyle } from 'react-native';

export type TimelineDotVariant = 'completed' | 'current' | 'pending';

export interface TimelineDotProps {
  variant: TimelineDotVariant;
  style?: ViewStyle;
}
