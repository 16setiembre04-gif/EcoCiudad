import { SectionHeader } from '@/presentation/components/atoms/section-header';
import { StatusTimeline } from '@/presentation/components/molecules/status-timeline';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';
import { type ReportTimelineProps } from './types';

export function ReportTimeline({ entries, currentStatus, style }: ReportTimelineProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={t('reports.timeline')} />
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
