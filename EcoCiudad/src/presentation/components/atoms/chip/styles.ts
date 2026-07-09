import { type ChipVariant, type ChipSize } from './types';
import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { textStyles } from '@/theme/typography';

export const getChipStyles = (
  variant: ChipVariant,
  size: ChipSize,
  selected: boolean,
  colors: ThemeColors,
) => {
  const sizeConfig = {
    sm: { height: 32, paddingHorizontal: spacing.md, iconSize: 14 },
    md: { height: 40, paddingHorizontal: spacing.lg, iconSize: 16 },
  };

  const sizeStyles = sizeConfig[size];

  const baseContainer = {
    minHeight: sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: borderRadius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: spacing.xs,
  };

  const baseText = {
    ...textStyles.bodySmall,
    fontWeight: '500' as const,
  };

  const variantStyles = {
    filled: {
      container: {
        backgroundColor: selected ? colors.primary : colors.surfaceVariant,
      },
      text: {
        ...baseText,
        color: selected ? colors.onPrimary : colors.textPrimary,
      },
      iconColor: selected ? colors.onPrimary : colors.textPrimary,
    },
    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
      },
      text: {
        ...baseText,
        color: selected ? colors.primary : colors.textPrimary,
      },
      iconColor: selected ? colors.primary : colors.textPrimary,
    },
    tonal: {
      container: {
        backgroundColor: selected ? colors.primaryContainer : colors.surfaceVariant,
      },
      text: {
        ...baseText,
        color: selected ? colors.onPrimaryContainer : colors.textPrimary,
      },
      iconColor: selected ? colors.onPrimaryContainer : colors.textPrimary,
    },
  };

  return {
    container: { ...baseContainer, ...variantStyles[variant].container },
    text: variantStyles[variant].text,
    iconColor: variantStyles[variant].iconColor,
    iconSize: sizeStyles.iconSize,
  };
};
