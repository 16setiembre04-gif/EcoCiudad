import { type ViewStyle } from 'react-native';
import { type ReactNode } from 'react';

export interface RecyclerCardProps {
  name: string;
  materials: string[];
  rating: number;
  phone?: string;
  email?: string;
  distance?: string;
  action?: ReactNode;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
