import { View, FlatList, StyleSheet } from 'react-native';
import { ParticipantCard } from '@/components/molecules/participant-card';
import { SectionHeader } from '@/components/atoms/section-header';
import { EmptyState } from '@/components/atoms/empty-state';
import { Skeleton } from '@/components/atoms/skeleton';
import { spacing } from '@/theme/spacing';
import { type ParticipantsListProps } from './types';

export function ParticipantsList({
  participants,
  isLoading = false,
  onParticipantPress,
  title = 'Participants',
  style,
}: ParticipantsListProps) {
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={title} />
        <View style={styles.listContainer}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.skeletonItem}>
              <Skeleton variant="circle" width={40} height={40} />
              <View style={styles.skeletonText}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={12} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (participants.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <SectionHeader title={title} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="community"
            title="No participants yet"
            description="Be the first to register for this event"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={`${title} (${participants.length})`} />
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ParticipantCard
            participant={item}
            onPress={onParticipantPress ? () => onParticipantPress(item.userId) : undefined}
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
  listContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  skeletonText: {
    flex: 1,
    gap: spacing.xs,
  },
});
