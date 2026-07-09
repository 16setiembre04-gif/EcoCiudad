import { Card } from '@/presentation/components/atoms/card';
import { CategoryChip } from '@/presentation/components/atoms/category-chip';
import { Icon } from '@/presentation/components/atoms/icon';
import { PriorityBadge } from '@/presentation/components/atoms/priority-badge';
import { StatusIndicator } from '@/presentation/components/atoms/status-indicator';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';
import { type AssignedReportCardProps } from './types';

export function AssignedReportCard({
  report,
  onPress,
  containerStyle,
}: AssignedReportCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(t('common.locale'), {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      variant="elevated"
      padding="md"
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" numberOfLines={2}>
            {report.title}
          </ThemedText>
          <View style={styles.badges}>
            {report.priority && <PriorityBadge priority={report.priority} size="sm" />}
            <StatusIndicator status={report.status} size="sm" />
          </View>
        </View>
      </View>

      <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={2}>
        {report.description}
      </ThemedText>

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Icon name="location" size={16} color={theme.colors.textSecondary} />
          <ThemedText type="caption" color={theme.colors.textSecondary} numberOfLines={1}>
            {report.location.address || t('common.noAddress')}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={16} color={theme.colors.textSecondary} />
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {formatDate(report.createdAt)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <CategoryChip category={report.category} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  footer: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryContainer: {
    paddingTop: spacing.xs,
  },
});
