import { type ViewStyle } from 'react-native';

export interface OperatorAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  style?: ViewStyle;
}
