import { REPORT_CATEGORIES, REPORT_STATUSES } from '@/constants/report.constants';
import { CategoryChip } from '@/presentation/components/atoms/category-chip';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { type ReportFiltersProps } from './types';

export function ReportFilters({
  selectedCategory,
  selectedStatus,
  selectedSeverity,
  onCategoryChange,
  onStatusChange,
  onSeverityChange,
  onClearFilters,
  style,
}: ReportFiltersProps) {
  const theme = useTheme();
  const hasFilters = selectedCategory || selectedStatus || selectedSeverity;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Filters</ThemedText>
        {hasFilters && onClearFilters && (
          <Pressable onPress={onClearFilters} accessibilityRole="button" accessibilityLabel="Clear filters">
            <ThemedText type="bodySmall" color={theme.colors.error}>
              Clear All
            </ThemedText>
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {Object.entries(REPORT_CATEGORIES).map(([key, config]) => (
          <CategoryChip
            key={key}
            category={key as keyof typeof REPORT_CATEGORIES}
            selected={selectedCategory === key}
            onPress={() => onCategoryChange?.(selectedCategory === key ? undefined : key as keyof typeof REPORT_CATEGORIES)}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {Object.entries(REPORT_STATUSES).map(([key, config]) => (
          <CategoryChip
            key={key}
            category="other"
            selected={selectedStatus === key}
            onPress={() => onStatusChange?.(selectedStatus === key ? undefined : key as keyof typeof REPORT_STATUSES)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  chipRow: {
    paddingHorizontal: spacing.lg,
  },
});
