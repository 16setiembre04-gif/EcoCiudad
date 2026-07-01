import { type ViewStyle } from 'react-native';

export interface RewardCardProps {
  points: number;
  title: string;
  description?: string;
  earned?: boolean;
  style?: ViewStyle;
}
