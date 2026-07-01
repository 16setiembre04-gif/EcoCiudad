import { type ViewStyle } from 'react-native';
import { type IconName } from '@/components/atoms/icon';

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
