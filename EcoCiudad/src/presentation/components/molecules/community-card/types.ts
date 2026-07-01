import { type ViewStyle } from 'react-native';
import { type ReactNode } from 'react';

export interface CommunityCardProps {
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  isJoined?: boolean;
  action?: ReactNode;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
