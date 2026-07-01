import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { CategoryChip } from '@/components/atoms/category-chip';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { REPORT_CATEGORIES, REPORT_STATUSES, REPORT_SEVERITIES } from '@/constants/report.constants';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';
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
