import { useTheme } from '@/theme/context';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Icon } from '../icon';
import { Loader } from '../loader';
import { ThemedText } from '../text';
import { getButtonStyles } from './styles';
import { ButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconName,
  iconPosition = 'left',
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const styles = getButtonStyles(variant, size, theme.colors, disabled || loading);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: unknown) => {
    scale.value = withSpring(0.96, {
      damping: 12,
      stiffness: 180,
    });
    onPressIn?.(e as never);
  };

  const handlePressOut = (e: unknown) => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 180,
    });
    onPressOut?.(e as never);
  };

  const renderIcon = () => {
    if (!iconName || loading) return null;
    return (
      <Icon
        name={iconName}
        size={styles.iconSize}
        color={styles.iconColor}
      />
    );
  };

  return (
    <AnimatedPressable
      disabled={disabled || loading}
      style={[
        styles.container,
        fullWidth && { width: '100%' },
        animatedStyle,
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...props}
    >
      {loading ? (
        <Loader size="sm" color={styles.iconColor} />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <ThemedText
            type="button"
            style={[styles.text, { flex: 1, flexShrink: 1, textAlign: 'center' }, textStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
          >
            {children}
          </ThemedText>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </AnimatedPressable>
  );
}
