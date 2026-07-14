import { Button } from '@/presentation/components/atoms/button';
import { Card } from '@/presentation/components/atoms/card';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { PriorityBadge } from '@/presentation/components/atoms/priority-badge';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { calculateDistance } from '@/infrastructure/maps';
import { FlatList, StyleSheet, View } from 'react-native';
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
  const { t } = useTranslation();

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
          <ThemedText type="subtitle">{t('common.todaysRoute')}</ThemedText>
        </View>
        <EmptyState
          iconName="route"
          title={t('common.noRoutePlanned')}
          description={t('common.noReportsAssignedToday')}
        />
      </View>
    );
  }

  // Calculo real de distancia usando Haversine entre paradas consecutivas
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const from = route[i].location;
    const to = route[i + 1].location;
    if (from && to) {
      totalDistance += calculateDistance(from, to);
    }
  }
  // Estimacion de tiempo: 40 km/h promedio en ciudad + 10 min por parada
  const estimatedTime = Math.round((totalDistance / 40) * 60 + route.length * 10);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">{t('common.todaysRoute')}</ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.routeSummary', { stops: route.length, distance: totalDistance.toFixed(1), time: estimatedTime })}
          </ThemedText>
        </View>
        {onOptimize && (
          <Button variant="outlined" size="sm" onPress={onOptimize} iconName="refresh">
            {t('common.optimize')}
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
                  {item.location.address || t('common.noAddress')}
                </ThemedText>
              </View>
              {item.priority && (
                <View style={styles.badgeContainer}>
                  <PriorityBadge priority={item.priority} size="sm" />
                </View>
              )}
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
            {t('common.startRoute')}
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
    minWidth: 0,
  },
  badgeContainer: {
    flexShrink: 0,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
