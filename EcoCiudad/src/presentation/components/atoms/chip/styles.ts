import { type ChipVariant, type ChipSize } from './types';
import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

export const getChipStyles = (
  variant: ChipVariant,
  size: ChipSize,
  selected: boolean,
  colors: ThemeColors,
) => {
  const sizeConfig = {
    sm: { height: 28, paddingHorizontal: spacing.md, fontSize: 12, iconSize: 14 },
    md: { height: 36, paddingHorizontal: spacing.lg, fontSize: 14, iconSize: 16 },
  };

  const sizeStyles = sizeConfig[size];

  const baseContainer = {
    height: sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: borderRadius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: spacing.xs,
  };

  const variantStyles = {
    filled: {
      container: {
        backgroundColor: selected ? colors.primary : colors.surfaceVariant,
      },
      text: {
        color: selected ? colors.onPrimary : colors.textPrimary,
        fontSize: sizeStyles.fontSize,
        fontWeight: '500' as const,
      },
      iconColor: selected ? colors.onPrimary : colors.textPrimary,
    },
    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
      },
      text: {
        color: selected ? colors.primary : colors.textPrimary,
        fontSize: sizeStyles.fontSize,
        fontWeight: '500' as const,
      },
      iconColor: selected ? colors.primary : colors.textPrimary,
    },
    tonal: {
      container: {
        backgroundColor: selected ? colors.primaryLight : colors.surfaceVariant,
      },
      text: {
        color: selected ? colors.primary : colors.textPrimary,
        fontSize: sizeStyles.fontSize,
        fontWeight: '500' as const,
      },
      iconColor: selected ? colors.primary : colors.textPrimary,
    },
  };

  return {
    container: { ...baseContainer, ...variantStyles[variant].container },
    text: variantStyles[variant].text,
    iconColor: variantStyles[variant].iconColor,
    iconSize: sizeStyles.iconSize,
  };
};
