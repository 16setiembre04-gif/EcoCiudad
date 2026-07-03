import { type IconName } from '@/presentation/components/atoms/icon';
import { type ViewStyle } from 'react-native';

export interface StatCardProps {
  label: string;
  value: string | number;
  iconName: IconName;
  color?: string;
  style?: ViewStyle;
}
