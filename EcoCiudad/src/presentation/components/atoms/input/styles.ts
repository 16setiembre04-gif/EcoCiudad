import { type InputVariant, type InputSize, type InputState } from './types';
import { type ThemeColors } from '@/theme';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { textStyles } from '@/theme/typography';

interface InputSizeConfig {
  minHeight: number;
  paddingHorizontal: number;
  iconSize: number;
}

const sizeConfig: Record<InputSize, InputSizeConfig> = {
  sm: { minHeight: 40, paddingHorizontal: spacing.md, iconSize: 16 },
  md: { minHeight: 48, paddingHorizontal: spacing.lg, iconSize: 20 },
  lg: { minHeight: 56, paddingHorizontal: spacing.lg, iconSize: 24 },
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
    minHeight: sizeStyles.minHeight,
    borderRadius: borderRadius.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  };

  const variantStyles = {
    outlined: {
      inputWrapper: {
        ...baseInputWrapper,
        backgroundColor: state === 'focused' ? colors.surface : colors.surfaceVariant,
        borderWidth: state === 'focused' ? 1.5 : 1,
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
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  };

  const inputStyle = {
    flex: 1,
    minHeight: sizeStyles.minHeight,
    paddingVertical: spacing.sm,
    ...textStyles.body,
    color: state === 'disabled' ? colors.textDisabled : colors.textPrimary,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    textAlignVertical: 'center' as const,
  };

  return {
    container: baseContainer,
    inputWrapper: variantStyles[variant].inputWrapper,
    input: inputStyle,
    iconSize: sizeStyles.iconSize,
    iconContainerSize: sizeStyles.minHeight,
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
    ...textStyles.bodySmall,
    color: getColor(),
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
    ...textStyles.caption,
    color: getColor(),
  };
};
