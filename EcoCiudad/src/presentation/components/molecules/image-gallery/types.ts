import { type ViewStyle } from 'react-native';

export interface ImageGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
  style?: ViewStyle;
}
