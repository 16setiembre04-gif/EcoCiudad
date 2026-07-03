import { Chip } from '@/presentation/components/atoms/chip';
import { type DateChipProps } from './types';

function formatDate(date: Date, compact: boolean): string {
  if (compact) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DateChip({ date, compact = false, style }: DateChipProps) {
  return (
    <Chip variant="tonal" size="sm" iconName="calendar" style={style}>
      {formatDate(date, compact)}
    </Chip>
  );
}
