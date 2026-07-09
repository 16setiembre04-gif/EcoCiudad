import { Chip } from '@/presentation/components/atoms/chip';
import { type AssignmentChipProps } from './types';

export function AssignmentChip({
  label,
  count,
  color: _color,
  onPress,
  style,
}: AssignmentChipProps) {
  const displayLabel = count !== undefined ? `${label} (${count})` : label;

  return (
    <Chip
      variant="tonal"
      size="sm"
      iconName="tasks"
      onPress={onPress}
      style={style}
    >
      {displayLabel}
    </Chip>
  );
}
