import { View, FlatList, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { PriorityBadge } from '@/components/atoms/priority-badge';
import { StatusIndicator } from '@/components/atoms/status-indicator';
import { EmptyState } from '@/components/atoms/empty-state';
import { Skeleton } from '@/components/atoms/skeleton';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type RoutePlannerProps } from './types';

export function RoutePlanner({
  route,
  isLoading = false,
  onOptimize,
  onStartRoute,
  onReportPress,
  style,
}: RoutePlannerProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Skeleton width={150} height={24} />
          <Skeleton width={100} height={36} />
        </View>
        <View style={styles.list}>
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="elevated" padding="md" style={styles.skeletonCard}>
              <Skeleton width="100%" height={20} />
              <Skeleton width="60%" height={16} />
            </Card>
          ))}
        </View>
      </View>
    );
  }

  if (route.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Today's Route</ThemedText>
        </View>
        <EmptyState
          iconName="route"
          title="No route planned"
          description="You don't have any reports assigned for today"
        />
      </View>
    );
  }

  const totalDistance = route.length * 2.5; // Estimate 2.5km per stop
  const estimatedTime = route.length * 15; // Estimate 15 minutes per stop

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">Today's Route</ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {route.length} stops • ~{totalDistance.toFixed(1)}km • ~{estimatedTime} min
          </ThemedText>
        </View>
        {onOptimize && (
          <Button variant="outlined" size="sm" onPress={onOptimize} iconName="refresh">
            Optimize
          </Button>
        )}
      </View>

      <FlatList
        data={route}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Card
            variant="elevated"
            padding="md"
            onPress={onReportPress ? () => onReportPress(item.id) : undefined}
            style={styles.routeCard}
          >
            <View style={styles.routeCardHeader}>
              <View style={[styles.stopNumber, { backgroundColor: theme.colors.primary }]}>
                <ThemedText type="body" style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>
                  {index + 1}
                </ThemedText>
              </View>
              <View style={styles.routeCardInfo}>
                <ThemedText type="body" numberOfLines={1}>
                  {item.title}
                </ThemedText>
                <ThemedText type="caption" color={theme.colors.textSecondary} numberOfLines={1}>
                  {item.location.address || 'No address'}
                </ThemedText>
              </View>
              {item.priority && <PriorityBadge priority={item.priority} size="sm" />}
            </View>
          </Card>
        )}
      />

      {onStartRoute && (
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={onStartRoute}
            iconName="route"
            iconPosition="right"
          >
            Start Route
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonCard: {
    gap: spacing.sm,
  },
  routeCard: {
    gap: spacing.sm,
  },
  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeCardInfo: {
    flex: 1,
    gap: 2,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
