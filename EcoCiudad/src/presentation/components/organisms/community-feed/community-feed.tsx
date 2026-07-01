import { View, FlatList } from 'react-native';
import { SearchBar } from '@/components/molecules/search-bar';
import { CommunityCard } from '@/components/molecules/community-card';
import { EmptyState } from '@/components/atoms/empty-state';
import { Loader } from '@/components/atoms/loader';
import { spacing } from '@/theme/spacing';
import { CommunityFeedProps } from './types';

export function CommunityFeed({
  items,
  searchValue,
  onSearchChange,
  onItemPress,
  onJoinPress,
  isLoading = false,
  emptyMessage = 'No communities found',
  containerStyle,
  testID,
}: CommunityFeedProps) {
  if (isLoading) {
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, containerStyle]}>
        <Loader size="lg" />
      </View>
    );
  }

  return (
    <View style={[{ flex: 1 }, containerStyle]} testID={testID}>
      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
        <SearchBar
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder="Search communities..."
        />
      </View>

      {items.length === 0 ? (
        <EmptyState
          iconName="community"
          title={emptyMessage}
          description="Try adjusting your search or explore different categories"
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
              <CommunityCard
                {...item}
                onPress={() => onItemPress(item.id)}
                action={
                  onJoinPress && !item.isJoined ? (
                    <View />
                  ) : undefined
                }
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
