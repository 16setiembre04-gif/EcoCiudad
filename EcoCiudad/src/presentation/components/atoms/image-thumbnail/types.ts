import { type ViewStyle } from 'react-native';

export interface ImageThumbnailProps {
  uri: string;
  size?: number;
  onPress?: () => void;
  onRemove?: () => void;
  style?: ViewStyle;
}
