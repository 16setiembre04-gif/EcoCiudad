import { REPORT_STATUSES } from '@/constants/report.constants';
import { Badge } from '@/presentation/components/atoms/badge';
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
