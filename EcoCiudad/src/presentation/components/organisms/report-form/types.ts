import { type IconName } from '@/presentation/components/atoms/icon';
import { type ViewStyle } from 'react-native';

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
