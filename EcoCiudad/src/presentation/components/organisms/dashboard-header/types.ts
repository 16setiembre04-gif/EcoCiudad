import { type ViewStyle } from 'react-native';

export interface DashboardHeaderProps {
  userName: string;
  greeting?: string;
  avatarUri?: string;
  points?: number;
  level?: number;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  notificationCount?: number;
  containerStyle?: ViewStyle;
  testID?: string;
}
