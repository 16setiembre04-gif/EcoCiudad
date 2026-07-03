import { Chip } from '@/presentation/components/atoms/chip';
import { type RewardChipProps } from './types';

export function RewardChip({ points, style }: RewardChipProps) {
  return (
    <Chip variant="filled" size="sm" iconName="eco-points" style={style}>
      +{points} pts
    </Chip>
  );
}
