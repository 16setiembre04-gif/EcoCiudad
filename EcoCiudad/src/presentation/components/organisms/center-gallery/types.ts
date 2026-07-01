import { type ViewStyle } from 'react-native';

export interface CenterGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
  style?: ViewStyle;
}
