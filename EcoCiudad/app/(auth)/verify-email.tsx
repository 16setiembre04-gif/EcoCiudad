import { useState, useEffect } from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAuth } from '@/presentation/hooks';
import { GuestGuard } from '@/presentation/components/organisms/auth-guard';
import { Button, ThemedText } from '@/presentation/components/atoms';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';

const AnimatedView = Animated.createAnimatedComponent(View);

function VerifyEmailContent() {
  const theme = useTheme();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { resendVerification, isLoading, error, clearError } = useAuth();
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const shakeValue = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeValue.value }],
  }));

  const triggerShake = () => {
    shakeValue.value = withTiming(-10, { duration: 50 }, () => {
      shakeValue.value = withTiming(10, { duration: 50 }, () => {
        shakeValue.value = withTiming(-10, { duration: 50 }, () => {
          shakeValue.value = withTiming(10, { duration: 50 }, () => {
            shakeValue.value = withTiming(0, { duration: 50 });
          });
        });
      });
    });
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
    return undefined;
  }, [countdown]);

  const handleResend = async () => {
    if (!email) return;
    clearError();
    const result = await resendVerification(email);
    if (result.success) {
      setCountdown(60);
      setCanResend(false);
    } else {
      triggerShake();
    }
  };

  const handleOpenMailApp = async () => {
    const mailUrl = Platform.OS === 'ios' ? 'message://' : 'mailto:';
    try {
      const supported = await Linking.canOpenURL(mailUrl);
      if (supported) {
        await Linking.openURL(mailUrl);
      }
    } catch {
      // silently fail if mail app cannot be opened
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedView entering={FadeInDown.duration(animations.duration.slow)} style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
          <ThemedText style={styles.icon}>📧</ThemedText>
        </View>

        <ThemedText type="displayLarge" style={[styles.title, { color: theme.colors.textPrimary }]}>
          Verify Your Email
        </ThemedText>

        <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          We've sent a verification link to:
        </ThemedText>

        <ThemedText type="body" style={[styles.emailText, { color: theme.colors.primary }]}>
          {email}
        </ThemedText>

        <ThemedText type="bodySmall" style={[styles.instructions, { color: theme.colors.textSecondary }]}>
          Please check your inbox and click the verification link to activate your account.
        </ThemedText>

        {error && (
          <AnimatedView style={[styles.errorContainer, { backgroundColor: theme.colors.errorLight }, shakeStyle]}>
            <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </ThemedText>
          </AnimatedView>
        )}

        <AnimatedView entering={FadeInUp.duration(animations.duration.slow).delay(100)} style={styles.actions}>
          <Button
            variant="outlined"
            size="lg"
            fullWidth
            onPress={handleOpenMailApp}
            iconName="email"
          >
            Open Mail App
          </Button>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleResend}
            loading={isLoading}
            disabled={isLoading || !canResend}
            iconName="refresh"
          >
            {canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
          </Button>

          <Button
            variant="ghost"
            size="md"
            onPress={() => router.push('/(auth)/role-selection')}
          >
            Back to Login
          </Button>
        </AnimatedView>

        <AnimatedView entering={FadeInUp.duration(animations.duration.slow).delay(200)} style={[styles.tipContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <ThemedText type="button" style={[styles.tipTitle, { color: theme.colors.textSecondary }]}>
            Didn't receive the email?
          </ThemedText>
          <ThemedText type="bodySmall" style={{ color: theme.colors.textSecondary }}>
            {'\u2022'} Check your spam folder{'\n'}
            {'\u2022'} Make sure the email address is correct{'\n'}
            {'\u2022'} Wait a few minutes for the email to arrive
          </ThemedText>
        </AnimatedView>
      </AnimatedView>
    </View>
  );
}

export default function VerifyEmailScreen() {
  return (
    <GuestGuard>
      <VerifyEmailContent />
    </GuestGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  icon: {
    fontSize: 48,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emailText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing['2xl'],
  },
  instructions: {
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  errorContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  tipContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    width: '100%',
  },
  tipTitle: {
    marginBottom: spacing.sm,
  },
});
