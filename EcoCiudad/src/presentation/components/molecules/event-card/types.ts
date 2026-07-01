import { type ViewStyle } from 'react-native';
import { type Event, type EventCategory, type EventStatus } from '@/domain/entities';

export interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
  isRegistered?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
