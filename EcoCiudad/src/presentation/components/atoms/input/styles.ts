import { type InputVariant, type InputSize, type InputState } from './types';
import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface InputSizeConfig {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  iconSize: number;
}

const sizeConfig: Record<InputSize, InputSizeConfig> = {
  sm: { height: 40, paddingHorizontal: spacing.md, fontSize: 14, iconSize: 16 },
  md: { height: 48, paddingHorizontal: spacing.lg, fontSize: 16, iconSize: 20 },
  lg: { height: 56, paddingHorizontal: spacing.lg, fontSize: 16, iconSize: 24 },
};

export const getInputStyles = (
  variant: InputVariant,
  size: InputSize,
  state: InputState,
  colors: ThemeColors,
) => {
  const sizeStyles = sizeConfig[size];

  const getBorderColor = () => {
    switch (state) {
      case 'focused': return colors.primary;
      case 'error': return colors.error;
      case 'success': return colors.success;
      case 'disabled': return colors.border;
      default: return colors.border;
    }
  };

  const baseContainer = {
    gap: spacing.xs,
  };

  const baseInputWrapper = {
    height: sizeStyles.height,
    borderRadius: borderRadius.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  };

  const variantStyles = {
    outlined: {
      inputWrapper: {
        ...baseInputWrapper,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: getBorderColor(),
      },
    },
    filled: {
      inputWrapper: {
        ...baseInputWrapper,
        backgroundColor: colors.surfaceVariant,
        borderBottomWidth: 2,
        borderBottomColor: getBorderColor(),
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
      },
    },
  };

  const inputStyle = {
    flex: 1,
    height: '100%' as const,
    fontSize: sizeStyles.fontSize,
    color: state === 'disabled' ? colors.disabled : colors.textPrimary,
    paddingHorizontal: sizeStyles.paddingHorizontal,
  };

  return {
    container: baseContainer,
    inputWrapper: variantStyles[variant].inputWrapper,
    input: inputStyle,
    iconSize: sizeStyles.iconSize,
  };
};

export const getLabelStyles = (state: InputState, colors: ThemeColors) => {
  const getColor = () => {
    switch (state) {
      case 'focused': return colors.primary;
      case 'error': return colors.error;
      case 'success': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return {
    color: getColor(),
    fontSize: 14,
    fontWeight: '500' as const,
  };
};

export const getHelperTextStyles = (state: InputState, colors: ThemeColors) => {
  const getColor = () => {
    switch (state) {
      case 'error': return colors.error;
      case 'success': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return {
    color: getColor(),
    fontSize: 12,
  };
};
