import { type ReactNode } from 'react';
import { type ViewStyle, type TextStyle } from 'react-native';
import { type IconName } from '../icon';

export type BadgeVariant = 'filled' | 'outlined' | 'tonal';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  iconName?: IconName;
  dot?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
