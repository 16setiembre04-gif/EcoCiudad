import { type ViewStyle } from 'react-native';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: CheckboxSize;
  disabled?: boolean;
  error?: boolean;
  accentColor?: string;
  label?: string;
  style?: ViewStyle;
}
