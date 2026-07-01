import { type ViewStyle } from 'react-native';
import { type EventParticipant } from '@/domain/entities';

export interface ParticipantCardProps {
  participant: EventParticipant;
  onPress?: () => void;
  containerStyle?: ViewStyle;
}
