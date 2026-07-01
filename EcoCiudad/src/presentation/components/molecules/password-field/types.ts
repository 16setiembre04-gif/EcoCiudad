import { type TextInputProps } from 'react-native';

export interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  errorText?: string;
  hasError?: boolean;
  disabled?: boolean;
  showStrength?: boolean;
  size?: 'sm' | 'md' | 'lg';
  autoComplete?: TextInputProps['autoComplete'];
}
