import { type CardVariant, type CardPadding } from './types';
import { type ThemeColors, type ElevationLevel } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { elevation } from '@/theme/elevation';

export const getCardStyles = (
  variant: CardVariant,
  padding: CardPadding,
  elevationLevel: ElevationLevel,
  colors: ThemeColors,
) => {
  const paddingMap = {
    none: 0,
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
  };

  const baseStyles = {
    borderRadius: borderRadius.xl,
    padding: paddingMap[padding],
  };

  const variantStyles = {
    elevated: {
      backgroundColor: colors.surface,
      ...elevation[elevationLevel],
    },
    filled: {
      backgroundColor: colors.surfaceVariant,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
  };

  return { ...baseStyles, ...variantStyles[variant] };
};
