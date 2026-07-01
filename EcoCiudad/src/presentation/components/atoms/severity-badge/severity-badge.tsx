import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { REPORT_SEVERITIES } from '@/constants/report.constants';
import { type SeverityBadgeProps } from './types';

export function SeverityBadge({ severity, style }: SeverityBadgeProps) {
  const config = REPORT_SEVERITIES[severity];

  return (
    <View style={[styles.container, { backgroundColor: config.color + '20' }, style]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <ThemedText type="caption" style={[styles.text, { color: config.color }]}>
        {config.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '600',
  },
});
