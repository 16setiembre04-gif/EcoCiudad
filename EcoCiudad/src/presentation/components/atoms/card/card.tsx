import { Pressable, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { CardProps } from './types';
import { getCardStyles } from './styles';
import { useTheme } from '@/theme/context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  elevationLevel = 'low',
  onPress,
  style,
  ...props
}: CardProps) {
  const theme = useTheme();
  const styles = getCardStyles(variant, padding, elevationLevel, theme.colors);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  };

  if (onPress) {
    return (
      <AnimatedPressable
        style={[styles, animatedStyle, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={[styles, style]} accessibilityRole="summary" {...props}>
      {children}
    </View>
  );
}
