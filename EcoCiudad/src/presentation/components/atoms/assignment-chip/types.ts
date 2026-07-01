import { type ViewStyle } from 'react-native';

export interface AssignmentChipProps {
  label: string;
  count?: number;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}
