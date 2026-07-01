import { type ReactNode } from 'react';
import { type ViewStyle } from 'react-native';
import { type IconName } from '../icon';

export interface EmptyStateProps {
  iconName?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: ViewStyle;
}
