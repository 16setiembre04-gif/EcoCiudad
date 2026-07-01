import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { Chip } from '@/components/atoms/chip';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type PerformanceSummaryProps } from './types';

export function PerformanceSummary({
  performance,
  onPeriodChange,
  style,
}: PerformanceSummaryProps) {
  const theme = useTheme();

  const periodLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Performance</ThemedText>
        <View style={styles.periodSelector}>
          {(['day', 'week', 'month', 'year'] as const).map((period) => (
            <Chip
              key={period}
              variant={performance.period === period ? 'filled' : 'tonal'}
              size="sm"
              onPress={() => onPeriodChange?.(period)}
            >
              {periodLabels[period]}
            </Chip>
          ))}
        </View>
      </View>

      <Card variant="elevated" padding="md">
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Icon name="tasks" size={24} color={theme.colors.primary} />
            <ThemedText type="headline">{performance.totalReports}</ThemedText>
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              Total
            </ThemedText>
          </View>

          <View style={styles.statItem}>
            <Icon name="success" size={24} color={theme.colors.success} />
            <ThemedText type="headline">{performance.resolvedReports}</ThemedText>
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              Resolved
            </ThemedText>
          </View>

          <View style={styles.statItem}>
            <Icon name="error" size={24} color={theme.colors.error} />
            <ThemedText type="headline">{performance.rejectedReports}</ThemedText>
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              Rejected
            </ThemedText>
          </View>

          <View style={styles.statItem}>
            <Icon name="achievement" size={24} color={theme.colors.secondary} />
            <ThemedText type="headline">{performance.completionRate}%</ThemedText>
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              Rate
            </ThemedText>
          </View>
        </View>

        {performance.topCategories.length > 0 && (
          <View style={styles.categoriesSection}>
            <ThemedText type="body" style={{ fontWeight: '600' }}>
              Top Categories
            </ThemedText>
            <View style={styles.categoriesList}>
              {performance.topCategories.map((cat, index) => (
                <View key={index} style={styles.categoryItem}>
                  <ThemedText type="bodySmall">{cat.category}</ThemedText>
                  <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                    {cat.count}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card>
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
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoriesSection: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  categoriesList: {
    gap: spacing.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
