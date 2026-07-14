import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Button } from '@/presentation/components/atoms/button';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';

interface ActivityCardProps {
  icon: 'calendar' | 'community';
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

function ActivityCard({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryPress,
  onSecondaryPress,
}: ActivityCardProps) {
  const theme = useTheme();

  return (
    <Card variant="elevated" padding="lg" style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <Icon name={icon} size={28} color={theme.colors.primary} />
        </View>
        <View style={styles.cardText}>
          <ThemedText type="subtitle">{title}</ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {description}
          </ThemedText>
        </View>
      </View>
      <View style={styles.cardActions}>
        <Button variant="primary" onPress={onPrimaryPress} style={styles.flexButton}>
          {primaryAction}
        </Button>
        {secondaryAction && onSecondaryPress && (
          <Button variant="outlined" onPress={onSecondaryPress} style={styles.flexButton}>
            {secondaryAction}
          </Button>
        )}
      </View>
    </Card>
  );
}

export default function ActivityHubScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <DashboardTemplate
      header={<Header title={t('common.activity')} showBackButton={false} />}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="body" color={theme.colors.textSecondary}>
          {t('common.activityOverview')}
        </ThemedText>

        <ActivityCard
          icon="calendar"
          title={t('events.title')}
          description={t('events.upcomingEvents')}
          primaryAction={t('events.title')}
          secondaryAction={t('events.myEvents')}
          onPrimaryPress={() => router.push('/(citizen)/(tabs)/events')}
          onSecondaryPress={() => router.push('/(citizen)/events/my-events')}
        />

        <ActivityCard
          icon="community"
          title={t('communities.title')}
          description={t('communities.noCommunitiesFound')}
          primaryAction={t('communities.title')}
          secondaryAction={t('communities.myCommunities')}
          onPrimaryPress={() => router.push('/(citizen)/(tabs)/community')}
          onSecondaryPress={() => router.push('/(citizen)/community/my-communities')}
        />
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
  card: {
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: spacing.xs,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flexButton: {
    flex: 1,
  },
});
