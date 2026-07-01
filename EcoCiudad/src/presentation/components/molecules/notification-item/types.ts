import { type ViewStyle } from 'react-native';
import { type IconName } from '@/components/atoms/icon';

export interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  icon: IconName;
  isRead?: boolean;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
