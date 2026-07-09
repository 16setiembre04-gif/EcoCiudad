import { type ReactNode } from 'react';
import { type ViewStyle, type PressableProps, type StyleProp } from 'react-native';
import { type ElevationLevel } from '@/theme';

export type CardVariant = 'elevated' | 'filled' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  elevationLevel?: ElevationLevel;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
