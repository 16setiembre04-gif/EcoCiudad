import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { Loader } from '@/presentation/components/atoms/loader';
import { CommunityCard } from '@/presentation/components/molecules/community-card';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, View } from 'react-native';
import { CommunityFeedProps } from './types';

export function CommunityFeed({
  items,
  searchValue,
  onSearchChange,
  onItemPress,
  onJoinPress,
  isLoading = false,
  containerStyle,
  testID,
}: CommunityFeedProps) {
  const { t } = useTranslation();

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
          placeholder={t('communities.searchPlaceholder')}
        />
      </View>

      {items.length === 0 ? (
        <EmptyState
          iconName="community"
          title={t('communities.noCommunitiesFound')}
          description={t('communities.trySearch')}
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
