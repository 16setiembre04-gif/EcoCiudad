import { type ViewStyle } from 'react-native';

export interface MaterialChipProps {
  material: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}
