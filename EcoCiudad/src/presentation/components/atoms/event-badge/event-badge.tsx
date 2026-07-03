import { EVENT_STATUSES } from '@/constants/event.constants';
import { Badge } from '@/presentation/components/atoms/badge';
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
