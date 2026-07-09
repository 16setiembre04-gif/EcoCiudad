import { type BadgeVariant, type BadgeSize, type BadgeColor } from './types';
import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { textStyles } from '@/theme/typography';

interface BadgeSizeConfig {
  height: number;
  minWidth: number;
  paddingHorizontal: number;
}

const sizeConfig: Record<BadgeSize, BadgeSizeConfig> = {
  sm: { height: 20, minWidth: 20, paddingHorizontal: spacing.sm },
  md: { height: 24, minWidth: 24, paddingHorizontal: spacing.md },
  lg: { height: 28, minWidth: 28, paddingHorizontal: spacing.md },
};

export const getBadgeStyles = (
  variant: BadgeVariant,
  size: BadgeSize,
  color: BadgeColor,
  colors: ThemeColors,
) => {
  const sizeStyles = sizeConfig[size];

  const colorMap = {
    primary: { main: colors.primary, light: colors.primaryContainer, onMain: colors.onPrimary, onLight: colors.onPrimaryContainer },
    secondary: { main: colors.secondary, light: colors.secondaryLight, onMain: colors.onSecondary, onLight: colors.onSecondary },
    success: { main: colors.success, light: colors.successLight, onMain: '#FFFFFF', onLight: '#166534' },
    warning: { main: colors.warning, light: colors.warningLight, onMain: '#FFFFFF', onLight: '#92400E' },
    error: { main: colors.error, light: colors.errorLight, onMain: '#FFFFFF', onLight: '#991B1B' },
    info: { main: colors.info, light: colors.infoLight, onMain: '#FFFFFF', onLight: '#1E40AF' },
  };

  const colorScheme = colorMap[color];

  const baseContainer = {
    minHeight: sizeStyles.height,
    minWidth: sizeStyles.minWidth,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: borderRadius.full,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: spacing.xs,
  };

  const baseText = {
    ...textStyles.caption,
    fontWeight: '600' as const,
  };

  const variantStyles = {
    filled: {
      container: { backgroundColor: colorScheme.main },
      text: { ...baseText, color: colorScheme.onMain },
      dotColor: colorScheme.onMain,
    },
    outlined: {
      container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colorScheme.main },
      text: { ...baseText, color: colorScheme.main },
      dotColor: colorScheme.main,
    },
    tonal: {
      container: { backgroundColor: colorScheme.light },
      text: { ...baseText, color: colorScheme.onLight },
      dotColor: colorScheme.main,
    },
  };

  return {
    container: { ...baseContainer, ...variantStyles[variant].container },
    text: variantStyles[variant].text,
    dotColor: variantStyles[variant].dotColor,
  };
};
