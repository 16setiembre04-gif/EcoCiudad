import { type ViewStyle } from 'react-native';
import { type CommunityCardProps } from '@/components/molecules/community-card';

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
