import { type ViewStyle } from 'react-native';
import { type RecyclingCenter } from '@/domain/entities';

export interface NearbyCentersListProps {
  centers: RecyclingCenter[];
  userLocation?: { latitude: number; longitude: number };
  isLoading?: boolean;
  favorites?: string[];
  onCenterPress?: (id: string) => void;
  onFavoritePress?: (id: string) => void;
  onViewAllPress?: () => void;
  title?: string;
  horizontal?: boolean;
  style?: ViewStyle;
}
