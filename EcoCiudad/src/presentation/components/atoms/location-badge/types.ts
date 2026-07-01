import { type ViewStyle } from 'react-native';

export interface LocationBadgeProps {
  address: string;
  isVirtual?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
}
