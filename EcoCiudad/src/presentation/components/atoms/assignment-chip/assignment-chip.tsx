import { Chip } from '@/components/atoms/chip';
import { useTheme } from '@/theme/context';
import { type AssignmentChipProps } from './types';

export function AssignmentChip({
  label,
  count,
  color,
  onPress,
  style,
}: AssignmentChipProps) {
  const theme = useTheme();
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
