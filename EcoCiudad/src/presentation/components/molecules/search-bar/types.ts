import { type ViewStyle } from 'react-native';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
}
