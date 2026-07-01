import { type ViewStyle } from 'react-native';
import { type IconName } from '@/components/atoms/icon';

export interface StatCardProps {
  label: string;
  value: string | number;
  iconName: IconName;
  color?: string;
  style?: ViewStyle;
}
