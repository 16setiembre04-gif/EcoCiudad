import { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { Button } from '@/presentation/components/atoms/button';
import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Header } from '@/presentation/components/organisms/header';
import { DashboardTemplate } from '@/presentation/components/templates';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useSignOutMutation } from '@/presentation/hooks';

export default function CitizenProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const signOutMutation = useSignOutMutation();

  const handleSignOut = useCallback(() => {
    Alert.alert(
      t('profile.logout'),
      t('profile.confirmLogout'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            signOutMutation.mutate(undefined, {
              onSuccess: () => {
                router.replace('/(auth)/role-selection');
              },
            });
          },
        },
      ]
    );
  }, [t, signOutMutation, router]);

  if (!user) {
    return (
      <DashboardTemplate>
        <View style={styles.loadingContainer}>
          <ThemedText>{t('profile.loadingProfile')}</ThemedText>
        </View>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      header={
        <Header
          title={t('profile.title')}
          showBackButton={false}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" padding="lg" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar uri={user.avatarUrl} name={user.displayName} size="xl" />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <ThemedText type="headline" numberOfLines={1}>
                  {user.displayName}
                </ThemedText>
                <Badge variant="tonal" color="primary">
                  {t('auth.citizen')}
                </Badge>
              </View>
              <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
                {user.email}
              </ThemedText>
            </View>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/(citizen)/settings')}
            >
              <Icon name="settings" size={20} color={theme.colors.textPrimary} />
            </Button>
          </View>

          <View style={styles.ecoPointsSection}>
            <View style={styles.ecoPointsItem}>
              <Icon name="achievement" size={20} color={theme.colors.primary} />
              <ThemedText type="bodySmall" color={theme.colors.primary}>
                {t('profile.level')} {user.level ?? 1}
              </ThemedText>
            </View>
            <View style={styles.ecoPointsItem}>
              <Icon name="eco-points" size={20} color={theme.colors.secondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {user.ecoPoints ?? 0} {t('profile.points')}
              </ThemedText>
            </View>
          </View>

          <Button
            variant="outlined"
            size="md"
            fullWidth
            onPress={() => router.push('/(citizen)/settings')}
            iconName="edit"
          >
            {t('profile.editProfile')}
          </Button>
        </Card>

        <Card variant="elevated" padding="md" style={styles.statsCard}>
          <ThemedText type="subtitle">{t('profile.stats')}</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="report" size={24} color={theme.colors.primary} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {t('dashboard.reports')}
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <Icon name="calendar" size={24} color={theme.colors.secondary} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {t('dashboard.events')}
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <Icon name="community" size={24} color={theme.colors.success} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {t('dashboard.communities')}
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <Icon name="achievement" size={24} color={theme.colors.warning} />
              <ThemedText type="headline">0</ThemedText>
              <ThemedText type="caption" color={theme.colors.textSecondary}>
                {t('profile.achievements')}
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card variant="elevated" padding="md" style={styles.actionsCard}>
          <ThemedText type="subtitle">{t('profile.actions')}</ThemedText>
          <View style={styles.actionsList}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => router.push('/(citizen)/settings')}
              iconName="settings"
              iconPosition="left"
            >
              {t('profile.settings')}
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => router.push('/(citizen)/(tabs)/reports')}
              iconName="report"
              iconPosition="left"
            >
              {t('profile.myReports')}
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => router.push('/(citizen)/events/my-events')}
              iconName="calendar"
              iconPosition="left"
            >
              {t('profile.myEvents')}
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => router.push('/(citizen)/community/my-communities')}
              iconName="community"
              iconPosition="left"
            >
              {t('profile.myCommunities')}
            </Button>
          </View>
        </Card>

        <Card variant="elevated" padding="md" style={styles.logoutCard}>
          <Button
            variant="destructive"
            size="md"
            fullWidth
            onPress={handleSignOut}
            iconName="logout"
            iconPosition="left"
            loading={signOutMutation.isPending}
          >
            {t('profile.logout')}
          </Button>
        </Card>
      </ScrollView>
    </DashboardTemplate>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    gap: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ecoPointsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  ecoPointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statsCard: {
    gap: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 80,
  },
  actionsCard: {
    gap: spacing.md,
  },
  actionsList: {
    gap: spacing.sm,
  },
  logoutCard: {
    marginTop: spacing.md,
  },
});
