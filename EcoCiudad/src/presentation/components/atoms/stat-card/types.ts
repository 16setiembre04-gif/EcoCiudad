import { type IconName } from '@/presentation/components/atoms/icon';
import { type StyleProp, type ViewStyle } from 'react-native';

export interface StatCardProps {
  label: string;
  value: string | number;
  iconName: IconName;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
