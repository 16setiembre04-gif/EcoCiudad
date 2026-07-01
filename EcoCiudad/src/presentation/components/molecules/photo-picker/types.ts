import { type ViewStyle } from 'react-native';

export interface PhotoPickerProps {
  images: string[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  style?: ViewStyle;
}
