import { type ViewStyle } from 'react-native';

export interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUri?: string;
  role?: string;
  points?: number;
  level?: number;
  reportsCount?: number;
  eventsCount?: number;
  communitiesCount?: number;
  onEditPress?: () => void;
  onSettingsPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
