import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { textStyles } from '@/theme/typography';
import { type ButtonSize, type ButtonVariant } from './types';

interface ButtonStyleConfig {
  height: number;
  paddingHorizontal: number;
  iconSize: number;
}

const sizeConfig: Record<ButtonSize, ButtonStyleConfig> = {
  sm: { height: 36, paddingHorizontal: spacing.lg, iconSize: 16 },
  md: { height: 48, paddingHorizontal: spacing.xl, iconSize: 20 },
  lg: { height: 56, paddingHorizontal: spacing['2xl'], iconSize: 24 },
};

export const getButtonStyles = (
  variant: ButtonVariant,
  size: ButtonSize,
  colors: ThemeColors,
  disabled: boolean,
) => {
  const sizeStyles = sizeConfig[size];

  const baseContainer: ViewStyle = {
    height: sizeStyles.height,
    minHeight: sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  };

  const baseText = {
    ...textStyles.button,
    color: disabled ? colors.textDisabled : colors.onPrimary,
  };

  const disabledShadow = {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  };

  const softShadow = {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  };

  const variantMap = {
    primary: {
      container: {
        backgroundColor: disabled ? colors.surfaceVariant : colors.primary,
        ...(disabled ? disabledShadow : softShadow),
      },
      text: { ...baseText, color: disabled ? colors.textDisabled : colors.onPrimary },
      iconColor: disabled ? colors.textDisabled : colors.onPrimary,
    },
    secondary: {
      container: {
        backgroundColor: disabled ? colors.surfaceVariant : colors.secondary,
        ...(disabled ? disabledShadow : softShadow),
      },
      text: { ...baseText, color: disabled ? colors.textDisabled : colors.onSecondary },
      iconColor: disabled ? colors.textDisabled : colors.onSecondary,
    },
    outlined: {
      container: {
        backgroundColor: disabled ? colors.surfaceVariant : 'transparent',
        borderWidth: 1,
        borderColor: disabled ? colors.border : colors.primary,
      },
      text: { ...baseText, color: disabled ? colors.textDisabled : colors.primary },
      iconColor: disabled ? colors.textDisabled : colors.primary,
    },
    ghost: {
      container: {
        backgroundColor: disabled ? colors.surfaceVariant : 'transparent',
        paddingHorizontal: spacing.md,
      },
      text: { ...baseText, color: disabled ? colors.textDisabled : colors.primary },
      iconColor: disabled ? colors.textDisabled : colors.primary,
    },
    destructive: {
      container: {
        backgroundColor: disabled ? colors.surfaceVariant : colors.error,
        ...(disabled ? disabledShadow : softShadow),
      },
      text: { ...baseText, color: disabled ? colors.textDisabled : '#FFFFFF' },
      iconColor: disabled ? colors.textDisabled : '#FFFFFF',
    },
  };

  return {
    container: { ...baseContainer, ...variantMap[variant].container },
    text: variantMap[variant].text,
    iconColor: variantMap[variant].iconColor,
    iconSize: sizeStyles.iconSize,
  };
};

type ViewStyle = import('react-native').ViewStyle;
