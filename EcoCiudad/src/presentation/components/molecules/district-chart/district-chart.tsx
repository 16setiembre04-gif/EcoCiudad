import { type ReportsByDistrict } from '@/domain/entities';
import { Card } from '@/presentation/components/atoms/card';
import { HorizontalBarChart } from '@/presentation/components/atoms/horizontal-bar-chart';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet } from 'react-native';

export interface DistrictChartProps {
  data: ReportsByDistrict[];
}

export function DistrictChart({ data }: DistrictChartProps) {
  const theme = useTheme();

  const chartData = data.map((item, index) => ({
    label: item.district,
    value: item.count,
    percentage: item.percentage,
    color: getDistrictColor(index, theme.colors.primary),
  }));

  return (
    <Card variant="elevated" padding="lg" style={styles.container}>
      <ThemedText type="subtitle">Reports by District</ThemedText>
      <HorizontalBarChart data={chartData} maxItems={5} />
    </Card>
  );
}

function getDistrictColor(index: number, baseColor: string): string {
  const colors = ['#3B82F6', '#EF4444', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899'];
  return colors[index % colors.length] ?? baseColor;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
