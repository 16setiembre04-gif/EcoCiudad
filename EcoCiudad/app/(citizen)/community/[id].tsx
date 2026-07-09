import { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Card } from '@/presentation/components/atoms/card';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Badge } from '@/presentation/components/atoms/badge';
import { Button } from '@/presentation/components/atoms/button';
import { Icon } from '@/presentation/components/atoms/icon';
import { Divider } from '@/presentation/components/atoms/divider';
import { Loader } from '@/presentation/components/atoms/loader';
import { useCommunity, useIsMember, useJoinCommunity, useLeaveCommunity, useCommunityMembers } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { COMMUNITY_CATEGORIES } from '@/constants';
import { type CommunityMember } from '@/domain/entities/community';

export default function CommunityDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const { data: community, isLoading, refetch } = useCommunity(id ?? '');
  const { data: isMember, refetch: refetchMembership } = useIsMember(id ?? '');
  const { data: members } = useCommunityMembers(id ?? '');
  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchMembership()]);
    setRefreshing(false);
  }, [refetch, refetchMembership]);

  const handleJoin = useCallback(async () => {
    if (!id) return;
    try {
      await joinMutation.mutateAsync(id);
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToJoin'));
    }
  }, [id, joinMutation, t]);

  const handleLeave = useCallback(async () => {
    if (!id) return;
    try {
      await leaveMutation.mutateAsync(id);
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToLeaveCommunity'));
    }
  }, [id, leaveMutation, t]);

  const handleMembersPress = useCallback(() => {
    if (!id) return;
    router.push(`/(citizen)/community/${id}/members` as any);
  }, [id, router]);

  const handleEditPress = useCallback(() => {
    if (!id) return;
    router.push(`/(citizen)/community/${id}/edit` as any);
  }, [id, router]);

  if (isLoading || !community) {
    return (
      <CommunityTemplate>
        <Loader size="lg" />
      </CommunityTemplate>
    );
  }

  const categoryConfig = COMMUNITY_CATEGORIES[community.category as keyof typeof COMMUNITY_CATEGORIES];
  const adminMembers = members?.filter((m: CommunityMember) => m.role === 'owner' || m.role === 'admin') ?? [];

  return (
    <CommunityTemplate
      header={
        <Header
          title={community.name}
          showBackButton
          rightIcon="settings"
          onRightIconPress={handleEditPress}
        />
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Cover & Avatar */}
        <View style={[styles.coverContainer, { backgroundColor: categoryConfig?.color ?? theme.colors.primary }]}>
          {community.coverImageUrl && (
            <Avatar uri={community.coverImageUrl} name={community.name} size="xl" />
          )}
        </View>

        {/* Info Card */}
        <Card variant="elevated" padding="lg" style={styles.infoCard}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="title" style={{ fontWeight: '700' }}>
                {community.name}
              </ThemedText>
              <View style={styles.badgeRow}>
                <Badge variant="tonal" color="primary">
                  {categoryConfig?.label ?? community.category}
                </Badge>
                <Badge variant="tonal" color={community.privacy === 'public' ? 'success' : 'warning'}>
                  {community.privacy === 'public' ? t('common.public') : t('common.private')}
                </Badge>
              </View>
            </View>
          </View>

          <Divider orientation="horizontal" />

          <ThemedText type="body" color={theme.colors.textSecondary}>
            {community.description}
          </ThemedText>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="community" size={20} color={theme.colors.primary} />
              <ThemedText type="title" style={{ fontWeight: '600' }}>
                {community.memberCount}
              </ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {t('common.members')}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <Icon name="message" size={20} color={theme.colors.secondary} />
              <ThemedText type="title" style={{ fontWeight: '600' }}>
                {community.postCount}
              </ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {t('common.posts')}
              </ThemedText>
            </View>
          </View>

          {/* Location */}
          {community.location && (
            <View style={styles.locationRow}>
              <Icon name="location" size={16} color={theme.colors.textSecondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {community.location.department}, {community.location.district}
              </ThemedText>
            </View>
          )}

          {/* Rules */}
          {community.rules && community.rules.length > 0 && (
            <View style={styles.rulesSection}>
              <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
                {t('common.rules')}
              </ThemedText>
              {community.rules.map((rule: string, index: number) => (
                <View key={index} style={styles.ruleRow}>
                  <ThemedText type="bodySmall" color={theme.colors.primary} style={{ fontWeight: '600' }}>
                    {index + 1}.
                  </ThemedText>
                  <ThemedText type="bodySmall" color={theme.colors.textSecondary} style={{ flex: 1 }}>
                    {rule}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* Admins */}
          {adminMembers.length > 0 && (
            <View style={styles.adminsSection}>
              <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
                {t('common.administrators')}
              </ThemedText>
              <View style={styles.adminsRow}>
                {adminMembers.slice(0, 5).map((member: CommunityMember) => (
                  <Avatar
                    key={member.id}
                    uri={member.user?.avatarUrl}
                    name={member.user?.displayName ?? t('common.user')}
                    size="md"
                  />
                ))}
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsRow}>
            {isMember ? (
              <>
                <Button
                  variant="outlined"
                  size="lg"
                  onPress={handleLeave}
                  loading={leaveMutation.isPending}
                  style={{ flex: 1 }}
                >
                  {t('common.leave')}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onPress={handleMembersPress}
                  style={{ flex: 1 }}
                >
                  {t('common.members')}
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onPress={handleJoin}
                loading={joinMutation.isPending}
              >
                {t('common.joinCommunity')}
              </Button>
            )}
          </View>
        </Card>
      </ScrollView>
    </CommunityTemplate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  coverContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    margin: spacing.lg,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rulesSection: {
    gap: spacing.sm,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  adminsSection: {
    gap: spacing.sm,
  },
  adminsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
