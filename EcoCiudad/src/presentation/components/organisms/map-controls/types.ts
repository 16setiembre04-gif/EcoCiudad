import { type IconName } from '@/presentation/components/atoms/icon';
import { type ViewStyle } from 'react-native';

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
