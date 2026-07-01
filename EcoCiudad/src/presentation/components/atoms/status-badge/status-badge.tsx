import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Badge } from '@/components/atoms/badge';
import { REPORT_STATUSES } from '@/constants/report.constants';
import { type StatusBadgeProps } from './types';

export function StatusBadge({ status, size = 'md', style }: StatusBadgeProps) {
  const config = REPORT_STATUSES[status];

  return (
    <Badge
      variant="tonal"
      color={config.color}
      size={size}
      style={style}
    >
      {config.label}
    </Badge>
  );
}
