import { Chip } from '@/presentation/components/atoms/chip';
import { type TimeChipProps } from './types';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function TimeChip({ startTime, endTime, style }: TimeChipProps) {
  const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

  return (
    <Chip variant="tonal" size="sm" iconName="calendar" style={style}>
      {timeRange}
    </Chip>
  );
}
