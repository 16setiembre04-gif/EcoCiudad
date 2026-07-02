import { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Badge } from '@/presentation/components/atoms/badge';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { Loader } from '@/presentation/components/atoms/loader';
import { Card } from '@/presentation/components/atoms/card';
import { useCommunityMembers } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { MEMBER_ROLES } from '@/constants';
import { type CommunityMember } from '@/domain/entities/community';

export default function CommunityMembersScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data: members, isLoading, refetch } = useCommunityMembers(id ?? '');

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredMembers = members?.filter((m: CommunityMember) =>
    m.user?.displayName.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const renderMember = useCallback(
    ({ item }: { item: CommunityMember }) => {
      const roleConfig = MEMBER_ROLES[item.role as keyof typeof MEMBER_ROLES];

      return (
        <Card variant="elevated" padding="md" style={{ marginBottom: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Avatar
              uri={item.user?.avatarUrl}
              name={item.user?.displayName ?? 'User'}
              size="md"
            />
            <View style={{ flex: 1 }}>
              <ThemedText type="body" style={{ fontWeight: '600' }}>
                {item.user?.displayName ?? 'Unknown'}
              </ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                Joined {new Date(item.joinedAt).toLocaleDateString()}
              </ThemedText>
            </View>
            <Badge variant="tonal" color={roleConfig?.color === '#EF4444' ? 'error' : roleConfig?.color === '#F59E0B' ? 'warning' : roleConfig?.color === '#3B82F6' ? 'info' : 'primary'}>
              {roleConfig?.label ?? item.role}
            </Badge>
          </View>
        </Card>
      );
    },
    [theme.colors.textSecondary]
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
        <Header title="Members" showBackButton />
      }
      search={
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search members..."
        />
      }
    >
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
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
            title="No members found"
            description="Try adjusting your search"
          />
        }
      />
    </CommunityTemplate>
  );
}
