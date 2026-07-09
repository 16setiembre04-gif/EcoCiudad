import { REPORT_CATEGORY_CONFIG } from '@/constants';
import { type ReportsByCategory } from '@/domain/entities';
import { Card } from '@/presentation/components/atoms/card';
import { HorizontalBarChart } from '@/presentation/components/atoms/horizontal-bar-chart';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet } from 'react-native';

export interface CategoryChartProps {
  data: ReportsByCategory[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const chartData = data.map((item) => ({
    label: t(REPORT_CATEGORY_CONFIG[item.category]?.labelKey ?? item.category),
    value: item.count,
    percentage: item.percentage,
    color: REPORT_CATEGORY_CONFIG[item.category]?.color ?? theme.colors.textSecondary,
  }));

  return (
    <Card variant="elevated" padding="lg" style={styles.container}>
      <ThemedText type="subtitle">{t('common.reportsByCategory')}</ThemedText>
      <HorizontalBarChart data={chartData} maxItems={6} />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
