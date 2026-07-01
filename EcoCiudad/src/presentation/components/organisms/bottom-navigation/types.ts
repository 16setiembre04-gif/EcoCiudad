import { type ViewStyle } from 'react-native';
import { type IconName } from '@/components/atoms/icon';

export interface BottomNavigationItem {
  key: string;
  label: string;
  icon: IconName;
  badge?: number;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  activeKey: string;
  onItemPress: (key: string) => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
