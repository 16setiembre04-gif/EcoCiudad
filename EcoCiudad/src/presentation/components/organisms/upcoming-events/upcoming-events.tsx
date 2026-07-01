import { View, FlatList, StyleSheet } from 'react-native';
import { EventCard } from '@/components/molecules/event-card';
import { SectionHeader } from '@/components/atoms/section-header';
import { EmptyState } from '@/components/atoms/empty-state';
import { Skeleton } from '@/components/atoms/skeleton';
import { Card } from '@/components/atoms/card';
import { spacing } from '@/theme/spacing';
import { type EventCategory } from '@/domain/entities';

export interface UpcomingEventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: EventCategory;
  attendees: number;
  maxAttendees?: number;
  imageUrl?: string;
}

export interface UpcomingEventsListProps {
  events: UpcomingEventItem[];
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
  if (isLoading) {
    return (
      <View>
        <SectionHeader title="Upcoming Events" actionLabel="View All" onActionPress={onViewAllPress} />
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
        <SectionHeader title="Upcoming Events" actionLabel="View All" onActionPress={onViewAllPress} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="calendar"
            title="No upcoming events"
            description="Join community events to earn eco points"
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title="Upcoming Events" actionLabel="View All" onActionPress={onViewAllPress} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EventCard
              title={item.title}
              date={item.date}
              location={item.location}
              category={item.category}
              attendees={item.attendees}
              maxAttendees={item.maxAttendees}
              imageUrl={item.imageUrl}
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
