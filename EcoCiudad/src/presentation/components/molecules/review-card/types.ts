import { type ViewStyle } from 'react-native';
import { type CenterReview } from '@/domain/entities';

export interface ReviewCardProps {
  review: CenterReview;
  onHelpfulPress?: () => void;
  containerStyle?: ViewStyle;
}
