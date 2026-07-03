import { type IconName } from '@/presentation/components/atoms/icon';
import { type ViewStyle } from 'react-native';

export interface QuickActionItem {
  key: string;
  label: string;
  icon: IconName;
  color?: string;
}

export interface QuickActionsProps {
  items: QuickActionItem[];
  onItemPress: (key: string) => void;
  columns?: 2 | 3 | 4;
  containerStyle?: ViewStyle;
  testID?: string;
}
