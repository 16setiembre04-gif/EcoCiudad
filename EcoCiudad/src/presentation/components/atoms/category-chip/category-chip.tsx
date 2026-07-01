import { Chip } from '@/components/atoms/chip';
import { REPORT_CATEGORIES } from '@/constants/report.constants';
import { type CategoryChipProps } from './types';

export function CategoryChip({ category, selected, onPress, style }: CategoryChipProps) {
  const config = REPORT_CATEGORIES[category];

  return (
    <Chip
      variant={selected ? 'filled' : 'tonal'}
      size="sm"
      iconName={config.icon}
      selected={selected}
      onPress={onPress}
      style={style}
    >
      {config.label}
    </Chip>
  );
}
