import { type ReactNode } from 'react';
import { type PressableProps, type ViewStyle, type TextStyle } from 'react-native';
import { type IconName } from '../icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconName?: IconName;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}
