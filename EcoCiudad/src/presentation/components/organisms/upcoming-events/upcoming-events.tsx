import { type Event } from '@/domain/entities';
import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { EventCard } from '@/presentation/components/molecules/event-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, StyleSheet, View } from 'react-native';

export interface UpcomingEventsListProps {
  events: Event[];
  isLoading?: boolean;
  onEventPress?: (id: string) => void;
  onViewAllPress?: () => void;
}

export function UpcomingEventsList({
  events,
  isLoading = false,
  onEventPress,
  onViewAllPress,
}: UpcomingEventsListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View>
        <SectionHeader title={t('events.upcoming')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
        <View style={styles.listContainer}>
          {[0, 1].map((i) => (
            <Card key={i} variant="elevated" padding="lg" style={styles.skeletonCard}>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="50%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View>
        <SectionHeader title={t('events.upcoming')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="calendar"
            title={t('events.noUpcomingEvents')}
            description={t('events.registerFirst')}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title={t('events.upcoming')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EventCard
              event={item}
              onPress={onEventPress ? () => onEventPress(item.id) : undefined}
              containerStyle={styles.card}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonCard: {
    gap: spacing.sm,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  cardWrapper: {
    width: 300,
  },
  card: {
    width: '100%',
  },
});
