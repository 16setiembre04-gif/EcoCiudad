import { type ViewStyle } from 'react-native';
import { type EventParticipant } from '@/domain/entities';

export interface ParticipantsListProps {
  participants: EventParticipant[];
  isLoading?: boolean;
  onParticipantPress?: (userId: string) => void;
  title?: string;
  style?: ViewStyle;
}
