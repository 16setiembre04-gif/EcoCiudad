import { REPORT_STATUSES } from '@/constants/report.constants';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTranslation } from '@/localization';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type StatusIndicatorProps } from './types';

const sizeMap = {
  sm: { dot: 8, icon: 12, text: 'caption' as const },
  md: { dot: 10, icon: 14, text: 'bodySmall' as const },
  lg: { dot: 12, icon: 16, text: 'body' as const },
};

export function StatusIndicator({
  status,
  size = 'md',
  showLabel = true,
  style,
}: StatusIndicatorProps) {
  const { t } = useTranslation();
  const config = REPORT_STATUSES[status];
  const sizeConfig = sizeMap[size];

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.dot,
          {
            width: sizeConfig.dot,
            height: sizeConfig.dot,
            borderRadius: sizeConfig.dot / 2,
            backgroundColor: config.color,
          },
        ]}
      />
      {showLabel && (
        <ThemedText type={sizeConfig.text} style={{ color: config.color, fontWeight: '600' }}>
          {t(config.labelKey)}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    // Size is set dynamically
  },
});
