import { type ViewStyle } from 'react-native';
import { type Event } from '@/domain/entities';

export interface CalendarViewProps {
  events: Event[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventPress?: (id: string) => void;
  style?: ViewStyle;
}
