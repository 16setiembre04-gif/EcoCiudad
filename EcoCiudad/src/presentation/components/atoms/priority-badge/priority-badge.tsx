import { REPORT_PRIORITIES } from '@/constants/operator.constants';
import { Badge } from '@/presentation/components/atoms/badge';
import { useTranslation } from '@/localization';
import { type PriorityBadgeProps } from './types';

export function PriorityBadge({ priority, size = 'md', style }: PriorityBadgeProps) {
  const { t } = useTranslation();
  const config = REPORT_PRIORITIES[priority];

  return (
    <Badge
      variant="tonal"
      color={config.color as any}
      size={size}
      iconName={config.icon}
      style={style}
    >
      {t(config.labelKey)}
    </Badge>
  );
}
