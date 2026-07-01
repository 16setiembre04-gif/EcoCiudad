import { type ViewStyle } from 'react-native';

export interface OpenStatusProps {
  openingHours: Record<string, string>;
  style?: ViewStyle;
}
