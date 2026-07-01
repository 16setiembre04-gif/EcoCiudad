import { type ViewStyle } from 'react-native';
import { type CenterReview } from '@/domain/entities';

export interface ReviewsSectionProps {
  reviews: CenterReview[];
  isLoading?: boolean;
  onReviewPress?: (reviewId: string) => void;
  onHelpfulPress?: (reviewId: string) => void;
  onAddReviewPress?: () => void;
  style?: ViewStyle;
}
