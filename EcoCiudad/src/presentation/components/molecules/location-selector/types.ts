import { type ViewStyle } from 'react-native';
import { type GeoLocation } from '@/domain/entities';

export interface LocationSelectorProps {
  location?: GeoLocation;
  onPickLocation: () => void;
  onClear?: () => void;
  style?: ViewStyle;
}
