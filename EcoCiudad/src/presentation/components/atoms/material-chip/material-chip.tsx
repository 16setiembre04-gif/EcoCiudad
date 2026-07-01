import { Chip } from '@/components/atoms/chip';
import { RECYCLING_MATERIALS } from '@/constants/recycling.constants';
import { type MaterialChipProps } from './types';

export function MaterialChip({ material, selected, onPress, style }: MaterialChipProps) {
  const materialKey = material.toLowerCase() as keyof typeof RECYCLING_MATERIALS;
  const config = RECYCLING_MATERIALS[materialKey];

  if (!config) {
    return (
      <Chip variant="tonal" size="sm" selected={selected} onPress={onPress} style={style}>
        {material}
      </Chip>
    );
  }

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
