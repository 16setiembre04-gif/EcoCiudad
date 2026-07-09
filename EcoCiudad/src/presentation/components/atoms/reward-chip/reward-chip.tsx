import { Chip } from '@/presentation/components/atoms/chip';
import { useTranslation } from '@/localization';
import { type RewardChipProps } from './types';

export function RewardChip({ points, style }: RewardChipProps) {
  const { t } = useTranslation();

  return (
    <Chip variant="filled" size="sm" iconName="eco-points" style={style}>
      +{points} {t('common.points')}
    </Chip>
  );
}
