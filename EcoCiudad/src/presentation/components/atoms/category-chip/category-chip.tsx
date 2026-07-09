import { REPORT_CATEGORIES } from '@/constants/report.constants';
import { Chip } from '@/presentation/components/atoms/chip';
import { useTranslation } from '@/localization';
import { type CategoryChipProps } from './types';

export function CategoryChip({ category, label, iconName, selected, onPress, style }: CategoryChipProps) {
  const { t } = useTranslation();
  const config = category ? REPORT_CATEGORIES[category] : undefined;

  return (
    <Chip
      variant={selected ? 'filled' : 'tonal'}
      size="sm"
      iconName={iconName ?? config?.icon}
      selected={selected}
      onPress={onPress}
      style={style}
    >
      {label ?? (config ? t(config.labelKey) : '')}
    </Chip>
  );
}
