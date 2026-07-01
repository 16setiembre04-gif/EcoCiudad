import { type ViewStyle } from 'react-native';
import { type IconName } from '@/components/atoms/icon';

export interface ReportFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  images?: string[];
}

export interface ReportFormProps {
  onSubmit: (data: ReportFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  categories?: Array<{ value: string; label: string; icon: IconName }>;
  containerStyle?: ViewStyle;
  testID?: string;
}
