import { Badge } from '@/components/atoms/badge';
import { EVENT_STATUSES } from '@/constants/event.constants';
import { type EventBadgeProps } from './types';

export function EventBadge({ status, size = 'md', style }: EventBadgeProps) {
  const config = EVENT_STATUSES[status];

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
