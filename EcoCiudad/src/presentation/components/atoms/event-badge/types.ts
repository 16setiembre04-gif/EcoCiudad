import { type ViewStyle } from 'react-native';
import { type EventStatus } from '@/domain/entities';

export interface EventBadgeProps {
  status: EventStatus;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}
