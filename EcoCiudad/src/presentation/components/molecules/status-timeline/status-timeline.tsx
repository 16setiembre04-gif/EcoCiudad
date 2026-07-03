import { REPORT_STATUSES } from '@/constants/report.constants';
import { ThemedText } from '@/presentation/components/atoms/text';
import { TimelineDot } from '@/presentation/components/atoms/timeline-dot';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type StatusTimelineProps } from './types';

const STATUS_ORDER = ['pending', 'in_review', 'resolved'] as const;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function StatusTimeline({ entries, currentStatus, style }: StatusTimelineProps) {
  const theme = useTheme();

  const currentIndex = STATUS_ORDER.indexOf(currentStatus as typeof STATUS_ORDER[number]);

  return (
    <View style={[styles.container, style]}>
      {STATUS_ORDER.map((status, index) => {
        const config = REPORT_STATUSES[status];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const entry = entries.find((e) => e.status === status);

        return (
          <View key={status} style={styles.step}>
            <View style={styles.dotContainer}>
              <TimelineDot
                variant={isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}
              />
              {index < STATUS_ORDER.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted
                        ? theme.colors.success
                        : theme.colors.border,
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.labelContainer}>
              <ThemedText
                type="bodySmall"
                style={{
                  fontWeight: isCurrent ? '600' : '400',
                  color: isCompleted || isCurrent
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary,
                }}
              >
                {config.label}
              </ThemedText>
              {entry && (
                <ThemedText type="caption" color={theme.colors.textSecondary}>
                  {formatDate(entry.createdAt)}
                </ThemedText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dotContainer: {
    alignItems: 'center',
  },
  line: {
    width: 2,
    height: 40,
  },
  labelContainer: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
});
