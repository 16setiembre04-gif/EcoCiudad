import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { useAuth } from '@/presentation/hooks';
import { GuestGuard } from '@/presentation/components/organisms/auth-guard';
import { Button, Input, ThemedText } from '@/presentation/components/atoms';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';

const AnimatedView = Animated.createAnimatedComponent(View);

function ForgotPasswordContent() {
  const theme = useTheme();
  const router = useRouter();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const shakeValue = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    const result = await resetPassword(data.email);

    if (result.success) {
      setSentEmail(data.email);
      setIsSuccess(true);
    } else {
      triggerShake();
    }
  };

  if (isSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AnimatedView entering={FadeInDown.duration(animations.duration.slow)} style={styles.successContent}>
          <View style={[styles.successIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <ThemedText style={styles.successEmoji}>✉️</ThemedText>
          </View>
          <ThemedText type="headline" style={[styles.successTitle, { color: theme.colors.textPrimary }]}>
            Check Your Email
          </ThemedText>
          <ThemedText type="body" style={[styles.successText, { color: theme.colors.textSecondary }]}>
            We've sent a password reset link to:
          </ThemedText>
          <ThemedText type="body" style={[styles.emailText, { color: theme.colors.primary }]}>
            {sentEmail}
          </ThemedText>
          <ThemedText type="bodySmall" style={[styles.instructionsText, { color: theme.colors.textSecondary }]}>
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </ThemedText>

          <View style={styles.successActions}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.push('/(auth)/role-selection')}
            >
              Back to Login
            </Button>
            <Button
              variant="ghost"
              size="md"
              onPress={() => {
                setIsSuccess(false);
                setSentEmail('');
              }}
            >
              Send Again
            </Button>
          </View>
        </AnimatedView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AnimatedView entering={FadeInDown.duration(animations.duration.slow)} style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <ThemedText style={styles.logoText}>🔑</ThemedText>
          </View>
          <ThemedText type="displayLarge" style={[styles.title, { color: theme.colors.textPrimary }]}>
            Forgot Password?
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            No worries, we'll send you reset instructions
          </ThemedText>
        </AnimatedView>

        <AnimatedView entering={FadeInUp.duration(animations.duration.slow).delay(100)} style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.email?.message}
                state={errors.email ? 'error' : 'default'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                size="lg"
                leftIcon="email"
              />
            )}
          />

          {error && (
            <AnimatedView style={[styles.errorContainer, { backgroundColor: theme.colors.errorLight }, shakeStyle]}>
              <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </ThemedText>
            </AnimatedView>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            iconName="send"
            iconPosition="right"
          >
            Send Reset Link
          </Button>

          <View style={styles.backContainer}>
            <Link href="/(auth)/role-selection" asChild>
              <Button variant="ghost" size="md">
                Back to Login
              </Button>
            </Link>
          </View>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function ForgotPasswordScreen() {
  return (
    <GuestGuard>
      <ForgotPasswordContent />
    </GuestGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  errorContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  backContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  successEmoji: {
    fontSize: 48,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successText: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emailText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing['2xl'],
  },
  instructionsText: {
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  successActions: {
    width: '100%',
    gap: spacing.md,
  },
});
