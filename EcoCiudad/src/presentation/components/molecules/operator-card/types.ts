import { type ViewStyle } from 'react-native';
import { type User } from '@/domain/entities';

export interface OperatorCardProps {
  operator: User;
  stats?: {
    assigned: number;
    resolved: number;
    pending: number;
  };
  onPress?: () => void;
  containerStyle?: ViewStyle;
}
