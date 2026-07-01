import { Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ButtonProps } from './types';
import { getButtonStyles } from './styles';
import { useTheme } from '@/theme/context';
import { Icon } from '../icon';
import { Loader } from '../loader';

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
    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 200,
    });
    onPressIn?.(e as never);
  };

  const handlePressOut = (e: unknown) => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
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
          <Text style={[styles.text, textStyle]}>{children}</Text>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </AnimatedPressable>
  );
}
