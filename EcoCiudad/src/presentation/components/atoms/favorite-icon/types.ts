import { type ViewStyle } from 'react-native';

export interface FavoriteIconProps {
  isFavorite: boolean;
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
}
