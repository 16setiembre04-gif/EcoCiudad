import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Icon, type IconName } from '@/components/atoms/icon';
import { ThemedText } from '@/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { animations } from '@/theme/animations';

interface OnboardingScreenProps {
  icon: IconName;
  title: string;
  description: string;
}

export function OnboardingScreen({ icon, title, description }: OnboardingScreenProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.duration(animations.duration.slow)}
        style={styles.iconContainer}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.colors.primaryLight },
          ]}
        >
          <Icon name={icon} size={80} color={theme.colors.primary} />
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
    width: 160,
    height: 160,
    borderRadius: 80,
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
