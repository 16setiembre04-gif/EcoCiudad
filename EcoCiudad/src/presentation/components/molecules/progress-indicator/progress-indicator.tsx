import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function ProgressIndicator({ totalSteps, currentStep }: ProgressIndicatorProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <ProgressDot
            key={index}
            isActive={isActive}
            isCompleted={isCompleted}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.border}
          />
        );
      })}
    </View>
  );
}

interface ProgressDotProps {
  isActive: boolean;
  isCompleted: boolean;
  activeColor: string;
  inactiveColor: string;
}

function ProgressDot({ isActive, isCompleted, activeColor, inactiveColor }: ProgressDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? 32 : 8, {
        duration: animations.duration.normal,
      }),
      backgroundColor: withTiming(
        isActive || isCompleted ? activeColor : inactiveColor,
        { duration: animations.duration.normal }
      ),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: borderRadius.full,
  },
});
