import { type ViewStyle } from 'react-native';
import { type IconName } from '@/components/atoms/icon';

export interface MapControlItem {
  key: string;
  icon: IconName;
  label?: string;
  badge?: number;
}

export interface MapControlsProps {
  items: MapControlItem[];
  onItemPress: (key: string) => void;
  position?: 'left' | 'right';
  containerStyle?: ViewStyle;
  testID?: string;
}
