import { type IconName } from '@/presentation/components/atoms/icon';
import { type ReactNode } from 'react';
import { type ViewStyle } from 'react-native';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: IconName;
  onLeftIconPress?: () => void;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  rightContent?: ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
