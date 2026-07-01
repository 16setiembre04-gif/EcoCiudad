import { type BadgeVariant, type BadgeSize, type BadgeColor } from './types';
import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface BadgeSizeConfig {
  height: number;
  minWidth: number;
  paddingHorizontal: number;
  fontSize: number;
}

const sizeConfig: Record<BadgeSize, BadgeSizeConfig> = {
  sm: { height: 20, minWidth: 20, paddingHorizontal: spacing.sm, fontSize: 10 },
  md: { height: 24, minWidth: 24, paddingHorizontal: spacing.md, fontSize: 12 },
  lg: { height: 28, minWidth: 28, paddingHorizontal: spacing.lg, fontSize: 14 },
};

export const getBadgeStyles = (
  variant: BadgeVariant,
  size: BadgeSize,
  color: BadgeColor,
  colors: ThemeColors,
) => {
  const sizeStyles = sizeConfig[size];

  const colorMap = {
    primary: { main: colors.primary, light: colors.primaryLight, onMain: colors.onPrimary },
    secondary: { main: colors.secondary, light: colors.primaryLight, onMain: colors.onSecondary },
    success: { main: colors.success, light: '#DCFCE7', onMain: '#FFFFFF' },
    warning: { main: colors.warning, light: '#FEF9C3', onMain: '#000000' },
    error: { main: colors.error, light: '#FEE2E2', onMain: '#FFFFFF' },
    info: { main: colors.info, light: '#DBEAFE', onMain: '#FFFFFF' },
  };

  const colorScheme = colorMap[color];

  const baseContainer = {
    height: sizeStyles.height,
    minWidth: sizeStyles.minWidth,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: borderRadius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: spacing.xs,
  };

  const variantStyles = {
    filled: {
      container: { backgroundColor: colorScheme.main },
      text: { color: colorScheme.onMain, fontSize: sizeStyles.fontSize, fontWeight: '600' as const },
      dotColor: colorScheme.onMain,
    },
    outlined: {
      container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colorScheme.main },
      text: { color: colorScheme.main, fontSize: sizeStyles.fontSize, fontWeight: '600' as const },
      dotColor: colorScheme.main,
    },
    tonal: {
      container: { backgroundColor: colorScheme.light },
      text: { color: colorScheme.main, fontSize: sizeStyles.fontSize, fontWeight: '600' as const },
      dotColor: colorScheme.main,
    },
  };

  return {
    container: { ...baseContainer, ...variantStyles[variant].container },
    text: variantStyles[variant].text,
    dotColor: variantStyles[variant].dotColor,
  };
};
