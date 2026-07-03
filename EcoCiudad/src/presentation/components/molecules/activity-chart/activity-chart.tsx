import { type ActivityData } from '@/domain/entities';
import { BarChart } from '@/presentation/components/atoms/bar-chart';
import { Card } from '@/presentation/components/atoms/card';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';

export interface ActivityChartProps {
  data: ActivityData[];
  period: 'weekly' | 'monthly';
  onPeriodChange?: (period: 'weekly' | 'monthly') => void;
}

export function ActivityChart({ data, period }: ActivityChartProps) {
  const theme = useTheme();

  const chartData = data.map((item) => {
    const date = new Date(item.date);
    const label = period === 'weekly'
      ? date.toLocaleDateString('en-US', { weekday: 'short' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      label,
      value: item.reports,
      color: theme.colors.primary,
    };
  });

  return (
    <Card variant="elevated" padding="lg" style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Activity Overview</ThemedText>
        <View style={styles.periodSelector}>
          <View style={[styles.periodChip, period === 'weekly' && { backgroundColor: theme.colors.primary }]}>
            <ThemedText
              type="caption"
              style={{ color: period === 'weekly' ? theme.colors.onPrimary : theme.colors.textSecondary }}
            >
              Weekly
            </ThemedText>
          </View>
          <View style={[styles.periodChip, period === 'monthly' && { backgroundColor: theme.colors.primary }]}>
            <ThemedText
              type="caption"
              style={{ color: period === 'monthly' ? theme.colors.onPrimary : theme.colors.textSecondary }}
            >
              Monthly
            </ThemedText>
          </View>
        </View>
      </View>
      <BarChart data={chartData} height={140} />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
          <ThemedText type="caption" color={theme.colors.textSecondary}>Reports</ThemedText>
        </View>
      </View>
    </Card>
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
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  periodChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
