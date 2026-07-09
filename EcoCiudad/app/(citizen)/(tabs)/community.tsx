import { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { CommunityCard } from '@/presentation/components/molecules/community-card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { Loader } from '@/presentation/components/atoms/loader';
import { Button } from '@/presentation/components/atoms/button';
import { useCommunities, useMyCommunities, useJoinCommunity } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { type Community } from '@/domain/entities/community';

export default function CommunitiesHomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data: communities, isLoading, refetch } = useCommunities({ search: search || undefined });
  const { data: myCommunities } = useMyCommunities();
  const joinMutation = useJoinCommunity();

  const myCommunityIds = myCommunities?.map((c: Community) => c.id) ?? [];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCommunityPress = useCallback(
    (id: string) => {
      router.push(`/(citizen)/community/${id}` as any);
    },
    [router]
  );

  const handleCreatePress = useCallback(() => {
    router.push('/(citizen)/community/create' as any);
  }, [router]);

  const handleJoinPress = useCallback(
    async (communityId: string) => {
      try {
        await joinMutation.mutateAsync(communityId);
      } catch {
        // handled by mutation
      }
    },
    [joinMutation]
  );

  const handleMyCommunitiesPress = useCallback(() => {
    router.push('/(citizen)/community/my-communities' as any);
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: Community }) => {
      const isJoined = myCommunityIds.includes(item.id);

      return (
        <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
          <CommunityCard
            name={item.name}
            description={item.description}
            memberCount={item.memberCount}
            imageUrl={item.coverImageUrl}
            isJoined={isJoined}
            onPress={() => handleCommunityPress(item.id)}
            action={
              !isJoined ? (
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => handleJoinPress(item.id)}
                  loading={joinMutation.isPending}
                >
                  {t('communities.join')}
                </Button>
              ) : undefined
            }
          />
        </View>
      );
    },
    [myCommunityIds, handleCommunityPress, handleJoinPress, joinMutation.isPending, t]
  );

  if (isLoading) {
    return (
      <CommunityTemplate>
        <Loader size="lg" />
      </CommunityTemplate>
    );
  }

  return (
    <CommunityTemplate
      header={
        <Header
          title={t('communities.title')}
          rightIcon="plus"
          onRightIconPress={handleCreatePress}
        />
      }
      search={
        <View style={{ gap: spacing.md }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={t('communities.searchPlaceholder')}
          />
          <Button
            variant="outlined"
            size="md"
            onPress={handleMyCommunitiesPress}
          >
            {t('communities.myCommunities')}
          </Button>
        </View>
      }
    >
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="community"
            title={t('communities.noCommunitiesFound')}
            description={t('communities.trySearch')}
          />
        }
      />
    </CommunityTemplate>
  );
}
