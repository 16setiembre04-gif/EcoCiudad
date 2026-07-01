import { View, StyleSheet } from 'react-native';
import { StatusTimeline } from '@/components/molecules/status-timeline';
import { SectionHeader } from '@/components/atoms/section-header';
import { ThemedText } from '@/components/atoms/text';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';
import { type ReportTimelineProps } from './types';

export function ReportTimeline({ entries, currentStatus, style }: ReportTimelineProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title="Status Timeline" />
      <View style={styles.content}>
        <StatusTimeline entries={entries} currentStatus={currentStatus} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
});
