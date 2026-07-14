import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { RecyclerCard } from '@/presentation/components/molecules/recycler-card';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

const HORIZONTAL_CARD_MIN_WIDTH = 280;
const HORIZONTAL_CARD_MAX_WIDTH = 360;

function useHorizontalCardWidth() {
  const { width } = useWindowDimensions();
  return Math.min(Math.max(width * 0.82, HORIZONTAL_CARD_MIN_WIDTH), HORIZONTAL_CARD_MAX_WIDTH);
}

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
  const { t } = useTranslation();
  const cardWidth = useHorizontalCardWidth();

  if (isLoading) {
    return (
      <View>
        <SectionHeader title={t('recycling.centers')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
        <View style={styles.listContainer}>
          {[0, 1].map((i) => (
            <Card key={i} variant="elevated" padding="lg" style={[styles.skeletonCard, { width: cardWidth }]}>
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
        <SectionHeader title={t('recycling.centers')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="recycle"
            title={t('recycling.noCentersNearby')}
            description={t('recycling.noCentersArea')}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title={t('recycling.centers')} actionLabel={t('common.viewAll')} onActionPress={onViewAllPress} />
      <FlatList
        data={centers}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
          <View style={[styles.cardWrapper, { width: cardWidth }]}>
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
    flexShrink: 0,
  },
  card: {
    width: '100%',
  },
});
