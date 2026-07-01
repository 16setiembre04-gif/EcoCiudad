import { type ViewStyle } from 'react-native';
import { type Event } from '@/domain/entities';

export interface UpcomingEventsListProps {
  events: Event[];
  isLoading?: boolean;
  favorites?: string[];
  registeredEvents?: string[];
  onEventPress?: (id: string) => void;
  onFavoritePress?: (id: string) => void;
  onViewAllPress?: () => void;
  title?: string;
  horizontal?: boolean;
  style?: ViewStyle;
}
