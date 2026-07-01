import { type ReactNode } from 'react';
import { type ViewStyle, type TextStyle } from 'react-native';
import { type IconName } from '../icon';

export type ChipVariant = 'filled' | 'outlined' | 'tonal';
export type ChipSize = 'sm' | 'md';

export interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  iconName?: IconName;
  selected?: boolean;
  onPress?: () => void;
  onDismiss?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
