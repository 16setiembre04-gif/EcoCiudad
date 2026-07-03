import { type CommunityCardProps } from '@/presentation/components/molecules/community-card';
import { type ViewStyle } from 'react-native';

export interface CommunityFeedItem extends CommunityCardProps {
  id: string;
}

export interface CommunityFeedProps {
  items: CommunityFeedItem[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  onItemPress: (id: string) => void;
  onJoinPress?: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}
