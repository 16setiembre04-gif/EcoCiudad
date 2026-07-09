import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { EventCard } from '@/presentation/components/molecules/event-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, StyleSheet, View } from 'react-native';
import { type UpcomingEventsListProps } from './types';

export function UpcomingEventsList({
  events,
  isLoading = false,
  favorites = [],
  registeredEvents = [],
  onEventPress,
  onFavoritePress,
  onViewAllPress,
  title,
  horizontal = true,
  style,
}: UpcomingEventsListProps) {
  const { t } = useTranslation();
  const sectionTitle = title ?? t('events.upcoming');

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={sectionTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
        <View style={horizontal ? styles.skeletonHorizontal : styles.skeletonVertical}>
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="elevated" padding="none" style={horizontal ? styles.skeletonCardH : styles.skeletonCardV}>
              <Skeleton width="100%" height={140} variant="rect" />
              <View style={styles.skeletonContent}>
                <Skeleton width="40%" height={14} />
                <Skeleton width="80%" height={20} />
                <Skeleton width="60%" height={14} />
              </View>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={sectionTitle} />
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

  if (horizontal) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={sectionTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <View style={styles.horizontalCard}>
              <EventCard
                event={item}
                isFavorite={favorites.includes(item.id)}
                isRegistered={registeredEvents.includes(item.id)}
                onPress={onEventPress ? () => onEventPress(item.id) : undefined}
                onFavoritePress={onFavoritePress ? () => onFavoritePress(item.id) : undefined}
              />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={sectionTitle} actionLabel={onViewAllPress ? t('common.viewAll') : undefined} onActionPress={onViewAllPress} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.verticalList}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavorite={favorites.includes(item.id)}
            isRegistered={registeredEvents.includes(item.id)}
            onPress={onEventPress ? () => onEventPress(item.id) : undefined}
            onFavoritePress={onFavoritePress ? () => onFavoritePress(item.id) : undefined}
            containerStyle={styles.verticalCard}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  horizontalCard: {
    width: 300,
  },
  verticalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  verticalCard: {
    width: '100%',
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  skeletonHorizontal: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonVertical: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonCardH: {
    width: 300,
    overflow: 'hidden',
    borderRadius: 20,
  },
  skeletonCardV: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  skeletonContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
