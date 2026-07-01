import { type ViewStyle } from 'react-native';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  variant?: SkeletonVariant;
  style?: ViewStyle;
}
