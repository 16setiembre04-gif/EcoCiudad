import { type ViewStyle } from 'react-native';
import { type RecyclingCenter } from '@/domain/entities';

export interface MapContainerProps {
  centers: RecyclingCenter[];
  userLocation?: { latitude: number; longitude: number };
  selectedCenterId?: string;
  onMarkerPress?: (centerId: string) => void;
  onRegionChange?: (region: { latitude: number; longitude: number }) => void;
  style?: ViewStyle;
}
