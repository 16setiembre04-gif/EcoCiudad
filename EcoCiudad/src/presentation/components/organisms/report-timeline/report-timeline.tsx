import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { StatusTimeline } from '@/presentation/components/molecules/status-timeline';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
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
