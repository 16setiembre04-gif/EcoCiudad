import { Card } from '@/presentation/components/atoms/card';
import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';
import { type PerformanceCardProps } from './types';

export function PerformanceCard({ performance, containerStyle }: PerformanceCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const periodLabels = {
    day: t('common.today'),
    week: t('common.thisWeek'),
    month: t('common.thisMonth'),
    year: t('common.thisYear'),
  };

  return (
    <Card variant="elevated" padding="md" style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Icon name="achievement" size={24} color={theme.colors.primary} />
        <ThemedText type="title">{t('common.performance')} - {periodLabels[performance.period]}</ThemedText>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.primary }}>
            {performance.totalReports}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {t('common.totalReports')}
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.success }}>
            {performance.resolvedReports}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {t('common.resolved')}
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.error }}>
            {performance.rejectedReports}
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {t('common.rejected')}
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="headline" style={{ color: theme.colors.secondary }}>
            {performance.completionRate}%
          </ThemedText>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {t('common.completionRate')}
          </ThemedText>
        </View>
      </View>

      {performance.topCategories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <ThemedText type="body" style={{ fontWeight: '600' }}>
            {t('common.topCategories')}
          </ThemedText>
          <View style={styles.categoriesList}>
            {performance.topCategories.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                <ThemedText type="bodySmall">{cat.category}</ThemedText>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {t('common.reportsCount', { count: cat.count })}
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
    flex: 1,
    minWidth: 72,
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
