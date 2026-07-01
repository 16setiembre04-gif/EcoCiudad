import { Badge } from '@/components/atoms/badge';
import { REPORT_PRIORITIES } from '@/constants/operator.constants';
import { type PriorityBadgeProps } from './types';

export function PriorityBadge({ priority, size = 'md', style }: PriorityBadgeProps) {
  const config = REPORT_PRIORITIES[priority];

  return (
    <Badge
      variant="tonal"
      color={config.color as any}
      size={size}
      iconName={config.icon}
      style={style}
    >
      {config.label}
    </Badge>
  );
}
