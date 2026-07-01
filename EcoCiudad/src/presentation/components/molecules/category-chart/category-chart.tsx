import { StyleSheet } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { HorizontalBarChart } from '@/components/atoms/horizontal-bar-chart';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type ReportsByCategory } from '@/domain/entities';
import { REPORT_CATEGORY_CONFIG } from '@/constants';

export interface CategoryChartProps {
  data: ReportsByCategory[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const theme = useTheme();

  const chartData = data.map((item) => ({
    label: REPORT_CATEGORY_CONFIG[item.category]?.label ?? item.category,
    value: item.count,
    percentage: item.percentage,
    color: REPORT_CATEGORY_CONFIG[item.category]?.color ?? theme.colors.textSecondary,
  }));

  return (
    <Card variant="elevated" padding="lg" style={styles.container}>
      <ThemedText type="subtitle">Reports by Category</ThemedText>
      <HorizontalBarChart data={chartData} maxItems={6} />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
