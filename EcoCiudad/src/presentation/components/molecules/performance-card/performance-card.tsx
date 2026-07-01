import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type PerformanceCardProps } from './types';

export function PerformanceCard({ performance, containerStyle }: PerformanceCardProps) {
  const theme = useTheme();

  const periodLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
  };

  return (
    <Card variant="elevated" padding="md" style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Icon name="achievement" size={24} color={theme.colors.primary} />
        <ThemedText type="title">Performance - {periodLabels[performance.period]}</ThemedText>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.primary }}>
            {performance.totalReports}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Total Reports
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.success }}>
            {performance.resolvedReports}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Resolved
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.error }}>
            {performance.rejectedReports}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Rejected
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.secondary }}>
            {performance.completionRate}%
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Completion Rate
          </ThemedText>
        </View>
      </View>

      {performance.topCategories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <ThemedText type="body" style={{ fontWeight: '600' }}>
            Top Categories
          </ThemedText>
          <View style={styles.categoriesList}>
            {performance.topCategories.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                <ThemedText type="bodySmall">{cat.category}</ThemedText>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {cat.count} reports
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  categoriesContainer: {
    gap: spacing.sm,
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
