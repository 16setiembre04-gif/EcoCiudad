import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Icon } from '@/components/atoms/icon';
import { ThemedText } from '@/components/atoms/text';
import { Card } from '@/components/atoms/card';
import { GuestGuard } from '@/components/organisms/auth-guard';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';

const AnimatedCard = Animated.createAnimatedComponent(Card);

function RoleSelectionContent() {
  const theme = useTheme();
  const router = useRouter();

  const citizenScale = useSharedValue(1);
  const operatorScale = useSharedValue(1);

  const citizenAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: citizenScale.value }],
  }));

  const operatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: operatorScale.value }],
  }));

  const handleCitizenPress = () => {
    citizenScale.value = withSpring(0.95, { damping: 15 }, () => {
      citizenScale.value = withSpring(1);
    });
    setTimeout(() => {
      router.push('/(auth)/citizen-login');
    }, 200);
  };

  const handleOperatorPress = () => {
    operatorScale.value = withSpring(0.95, { damping: 15 }, () => {
      operatorScale.value = withSpring(1);
    });
    setTimeout(() => {
      router.push('/(auth)/operator-login');
    }, 200);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.duration(animations.duration.slow)} style={styles.header}>
        <ThemedText type="displayLarge" style={[styles.title, { color: theme.colors.textPrimary }]}>
          Welcome to EcoCiudad
        </ThemedText>
        <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Choose your role to get started
        </ThemedText>
      </Animated.View>

      <View style={styles.rolesContainer}>
        <AnimatedCard
          entering={FadeInDown.duration(animations.duration.slow).delay(100)}
          style={[styles.roleCard, citizenAnimatedStyle]}
          variant="elevated"
          padding="lg"
        >
          <Pressable
            onPress={handleCitizenPress}
            style={styles.roleContent}
            accessibilityRole="button"
            accessibilityLabel="Continue as Citizen"
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <Icon name="user" size={48} color={theme.colors.primary} />
            </View>
            <ThemedText type="title" style={[styles.roleTitle, { color: theme.colors.textPrimary }]}>
              Citizen
            </ThemedText>
            <ThemedText type="bodySmall" style={[styles.roleDescription, { color: theme.colors.textSecondary }]}>
              Report issues, join communities, and earn eco points
            </ThemedText>
          </Pressable>
        </AnimatedCard>

        <AnimatedCard
          entering={FadeInDown.duration(animations.duration.slow).delay(200)}
          style={[styles.roleCard, operatorAnimatedStyle]}
          variant="elevated"
          padding="lg"
        >
          <Pressable
            onPress={handleOperatorPress}
            style={styles.roleContent}
            accessibilityRole="button"
            accessibilityLabel="Continue as Operator"
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondaryLight }]}>
              <Icon name="truck" size={48} color={theme.colors.secondary} />
            </View>
            <ThemedText type="title" style={[styles.roleTitle, { color: theme.colors.textPrimary }]}>
              Operator
            </ThemedText>
            <ThemedText type="bodySmall" style={[styles.roleDescription, { color: theme.colors.textSecondary }]}>
              Manage reports, coordinate routes, and oversee operations
            </ThemedText>
          </Pressable>
        </AnimatedCard>
      </View>
    </View>
  );
}

export default function RoleSelectionScreen() {
  return (
    <GuestGuard>
      <RoleSelectionContent />
    </GuestGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
    marginBottom: spacing['4xl'],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  rolesContainer: {
    gap: spacing.xl,
  },
  roleCard: {
    borderRadius: borderRadius.xl,
  },
  roleContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  roleTitle: {
    textAlign: 'center',
  },
  roleDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
