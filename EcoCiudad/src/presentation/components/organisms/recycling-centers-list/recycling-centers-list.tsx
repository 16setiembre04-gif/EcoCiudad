import { View, FlatList, StyleSheet } from 'react-native';
import { RecyclerCard } from '@/components/molecules/recycler-card';
import { SectionHeader } from '@/components/atoms/section-header';
import { EmptyState } from '@/components/atoms/empty-state';
import { Skeleton } from '@/components/atoms/skeleton';
import { Card } from '@/components/atoms/card';
import { spacing } from '@/theme/spacing';

export interface RecyclingCenterItem {
  id: string;
  name: string;
  materials: string[];
  rating: number;
  phone?: string;
  email?: string;
  distance?: string;
}

export interface RecyclingCentersListProps {
  centers: RecyclingCenterItem[];
  isLoading?: boolean;
  onCenterPress?: (id: string) => void;
  onViewAllPress?: () => void;
}

export function RecyclingCentersList({
  centers,
  isLoading = false,
  onCenterPress,
  onViewAllPress,
}: RecyclingCentersListProps) {
  if (isLoading) {
    return (
      <View>
        <SectionHeader title="Nearby Recycling Centers" actionLabel="View All" onActionPress={onViewAllPress} />
        <View style={styles.listContainer}>
          {[0, 1].map((i) => (
            <Card key={i} variant="elevated" padding="lg" style={styles.skeletonCard}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (centers.length === 0) {
    return (
      <View>
        <SectionHeader title="Nearby Recycling Centers" actionLabel="View All" onActionPress={onViewAllPress} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="recycle"
            title="No centers nearby"
            description="Recycling centers will appear here based on your location"
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title="Nearby Recycling Centers" actionLabel="View All" onActionPress={onViewAllPress} />
      <FlatList
        data={centers}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <RecyclerCard
              name={item.name}
              materials={item.materials}
              rating={item.rating}
              phone={item.phone}
              email={item.email}
              distance={item.distance}
              onPress={onCenterPress ? () => onCenterPress(item.id) : undefined}
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
