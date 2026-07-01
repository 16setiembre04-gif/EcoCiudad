import { type ViewStyle } from 'react-native';
import { type RecyclingCenter } from '@/domain/entities';

export interface CenterCardProps {
  center: RecyclingCenter;
  distanceKm?: number;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
