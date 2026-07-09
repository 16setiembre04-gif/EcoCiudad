import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { type CheckboxProps, type CheckboxSize } from './types';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const sizeMap: Record<CheckboxSize, number> = {
  sm: 18,
  md: 22,
  lg: 26,
};

const iconSizeMap: Record<CheckboxSize, number> = {
  sm: 12,
  md: 14,
  lg: 18,
};

export function Checkbox({
  checked,
  onCheckedChange,
  size = 'md',
  disabled = false,
  error = false,
  accentColor,
  style,
}: CheckboxProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const boxSize = sizeMap[size];
  const iconSize = iconSizeMap[size];
  const activeColor = accentColor ?? theme.colors.primary;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSpring(0.85, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onCheckedChange(!checked);
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (checked) return activeColor;
    return theme.colors.border;
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceVariant;
    if (checked) return activeColor;
    return 'transparent';
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.container,
        {
          width: boxSize,
          height: boxSize,
          borderRadius: borderRadius.sm,
          borderWidth: 2,
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      {checked && (
        <Check
          size={iconSize}
          color={disabled ? theme.colors.textDisabled : theme.colors.onPrimary}
          strokeWidth={3}
        />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
