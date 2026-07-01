import { type ButtonVariant, type ButtonSize } from './types';
import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface ButtonStyleConfig {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  iconSize: number;
}

const sizeConfig: Record<ButtonSize, ButtonStyleConfig> = {
  sm: { height: 36, paddingHorizontal: spacing.lg, fontSize: 14, iconSize: 16 },
  md: { height: 48, paddingHorizontal: spacing.xl, fontSize: 16, iconSize: 20 },
  lg: { height: 56, paddingHorizontal: spacing['2xl'], fontSize: 16, iconSize: 24 },
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
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  };

  const variantMap = {
    primary: {
      container: {
        backgroundColor: disabled ? colors.disabled : colors.primary,
      },
      text: {
        color: disabled ? colors.surface : colors.onPrimary,
        fontSize: sizeStyles.fontSize,
        fontWeight: '600' as const,
      },
      iconColor: disabled ? colors.surface : colors.onPrimary,
    },
    secondary: {
      container: {
        backgroundColor: disabled ? colors.disabled : colors.secondary,
      },
      text: {
        color: disabled ? colors.surface : colors.onSecondary,
        fontSize: sizeStyles.fontSize,
        fontWeight: '600' as const,
      },
      iconColor: disabled ? colors.surface : colors.onSecondary,
    },
    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: disabled ? colors.disabled : colors.primary,
      },
      text: {
        color: disabled ? colors.disabled : colors.primary,
        fontSize: sizeStyles.fontSize,
        fontWeight: '600' as const,
      },
      iconColor: disabled ? colors.disabled : colors.primary,
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
        paddingHorizontal: spacing.md,
      },
      text: {
        color: disabled ? colors.disabled : colors.primary,
        fontSize: sizeStyles.fontSize,
        fontWeight: '600' as const,
      },
      iconColor: disabled ? colors.disabled : colors.primary,
    },
    destructive: {
      container: {
        backgroundColor: disabled ? colors.disabled : colors.error,
      },
      text: {
        color: disabled ? colors.surface : '#FFFFFF',
        fontSize: sizeStyles.fontSize,
        fontWeight: '600' as const,
      },
      iconColor: disabled ? colors.surface : '#FFFFFF',
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
