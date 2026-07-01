import { type ViewStyle } from 'react-native';
import { type Event } from '@/domain/entities';

export interface EventHeaderProps {
  event: Event;
  isFavorite?: boolean;
  isRegistered?: boolean;
  onFavoritePress?: () => void;
  onSharePress?: () => void;
  onBackPress?: () => void;
  style?: ViewStyle;
}
