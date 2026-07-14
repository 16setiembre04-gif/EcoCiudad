import { Icon, type IconName } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { animations } from '@/theme/animations';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const ICON_CIRCLE_MIN_SIZE = 120;
const ICON_CIRCLE_MAX_SIZE = 200;
const ICON_MIN_SIZE = 56;
const ICON_MAX_SIZE = 96;

interface OnboardingScreenProps {
  icon: IconName;
  title: string;
  description: string;
}

function useOnboardingIconSize() {
  const { width } = useWindowDimensions();
  const circleSize = Math.min(Math.max(width * 0.35, ICON_CIRCLE_MIN_SIZE), ICON_CIRCLE_MAX_SIZE);
  const iconSize = Math.min(Math.max(width * 0.15, ICON_MIN_SIZE), ICON_MAX_SIZE);
  return { circleSize, iconSize };
}

export function OnboardingScreen({ icon, title, description }: OnboardingScreenProps) {
  const theme = useTheme();
  const { circleSize, iconSize } = useOnboardingIconSize();

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.duration(animations.duration.slow)}
        style={styles.iconContainer}
      >
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: theme.colors.primaryLight,
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
            },
          ]}
        >
          <Icon name={icon} size={iconSize} color={theme.colors.primary} />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(animations.duration.slow).delay(100)}
        style={styles.content}
      >
        <ThemedText type="headline" style={styles.title}>
          {title}
        </ThemedText>

        <ThemedText type="body" style={styles.description}>
          {description}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing['3xl'],
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
});
