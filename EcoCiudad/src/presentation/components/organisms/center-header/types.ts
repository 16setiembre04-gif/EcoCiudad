import { type ViewStyle } from 'react-native';
import { type RecyclingCenter } from '@/domain/entities';

export interface CenterHeaderProps {
  center: RecyclingCenter;
  distanceKm?: number;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  onDirectionsPress?: () => void;
  onCallPress?: () => void;
  onSharePress?: () => void;
  onBackPress?: () => void;
  style?: ViewStyle;
}
