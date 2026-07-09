import { useCallback, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { CommunityCard } from '@/presentation/components/molecules/community-card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { Loader } from '@/presentation/components/atoms/loader';
import { useMyCommunities } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type Community } from '@/domain/entities/community';
import { useTranslation } from '@/localization';

export default function MyCommunitiesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const { data: communities, isLoading, refetch } = useMyCommunities();

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
        <Header title={t('common.myCommunities')} showBackButton />
      }
    >
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Community }) => (
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
            <CommunityCard
              name={item.name}
              description={item.description}
              memberCount={item.memberCount}
              imageUrl={item.coverImageUrl}
              isJoined
              onPress={() => handleCommunityPress(item.id)}
            />
          </View>
        )}
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
            title={t('common.noCommunitiesYet')}
            description={t('common.joinOrCreateCommunity')}
          />
        }
      />
    </CommunityTemplate>
  );
}
