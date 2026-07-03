import { type IconName } from '@/presentation/components/atoms/icon';
import { type ViewStyle } from 'react-native';

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
