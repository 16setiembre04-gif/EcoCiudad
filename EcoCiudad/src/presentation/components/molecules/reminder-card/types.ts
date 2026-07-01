import { type ViewStyle } from 'react-native';

export interface ReminderCardProps {
  reminderBefore: number;
  reminderType: 'push' | 'email' | 'sms';
  isActive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}
