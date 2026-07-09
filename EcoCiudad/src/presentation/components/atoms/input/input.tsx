import { useState } from 'react';
import { TextInput, Text, View, Pressable } from 'react-native';
import { InputProps } from './types';
import { getInputStyles, getLabelStyles, getHelperTextStyles } from './styles';
import { useTheme } from '@/theme/context';
import { Icon } from '../icon';
import { spacing } from '@/theme/spacing';

export function Input({
  label,
  helperText,
  errorText,
  successText,
  variant = 'outlined',
  size = 'md',
  state: externalState,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  disabled,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [internalState, setInternalState] = useState<'default' | 'focused'>('default');

  const state = externalState ?? (disabled ? 'disabled' : internalState);
  const styles = getInputStyles(variant, size, state, theme.colors);
  const labelStyles = getLabelStyles(state, theme.colors);

  const displayText = state === 'error' ? errorText : state === 'success' ? successText : helperText;
  const helperStyles = getHelperTextStyles(state, theme.colors);

  const handleFocus = (e: any) => {
    if (!disabled) setInternalState('focused');
    onFocusProp?.(e);
  };

  const handleBlur = (e: any) => {
    setInternalState('default');
    onBlurProp?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[labelStyles, { marginBottom: spacing.xs }, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        {leftIcon && (
          <View
            style={{
              width: styles.iconContainerSize,
              height: styles.iconContainerSize,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name={leftIcon} size={styles.iconSize} color={theme.colors.textSecondary} />
          </View>
        )}
        <TextInput
          style={[styles.input, inputStyle]}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.textDisabled}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          {...props}
        />
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={{
              width: styles.iconContainerSize,
              height: styles.iconContainerSize,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityRole={onRightIconPress ? 'button' : 'none'}
          >
            <Icon
              name={rightIcon}
              size={styles.iconSize}
              color={onRightIconPress ? theme.colors.primary : theme.colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {displayText && (
        <Text style={[helperStyles, { marginTop: spacing.xs }]}>
          {displayText}
        </Text>
      )}
    </View>
  );
}
