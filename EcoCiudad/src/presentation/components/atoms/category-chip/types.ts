import { type ViewStyle } from 'react-native';
import { type ReportCategory } from '@/domain/entities';

export interface CategoryChipProps {
  category: ReportCategory;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}
