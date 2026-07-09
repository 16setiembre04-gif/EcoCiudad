import { type ViewStyle } from 'react-native';
import { type IconName } from '@/presentation/components/atoms/icon';
import { type ReportCategory } from '@/domain/entities';

export interface CategoryChipProps {
  category?: ReportCategory;
  label?: string;
  iconName?: IconName;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}
