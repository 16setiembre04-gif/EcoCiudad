import { type IconName } from '@/presentation/components/atoms/icon';
import { type ViewStyle } from 'react-native';

export interface ReportCardProps {
  title: string;
  description: string;
  status: 'pending' | 'in-review' | 'resolved' | 'rejected';
  category: IconName;
  location: string;
  date: string;
  imageUrl?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
