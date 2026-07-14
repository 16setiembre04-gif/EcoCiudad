import { type IconName } from '@/presentation/components/atoms/icon';
import { type ViewStyle } from 'react-native';

export interface BottomNavigationItem {
  key: string;
  label: string;
  icon: IconName;
  badge?: number;
  primary?: boolean;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  activeKey: string;
  onItemPress: (key: string) => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
