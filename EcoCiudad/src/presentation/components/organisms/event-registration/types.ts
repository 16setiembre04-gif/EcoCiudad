import { type ViewStyle } from 'react-native';
import { type Event } from '@/domain/entities';

export interface EventRegistrationProps {
  event: Event;
  isRegistered?: boolean;
  isRegistering?: boolean;
  isFull?: boolean;
  onRegister?: () => void;
  onCancelRegistration?: () => void;
  style?: ViewStyle;
}
