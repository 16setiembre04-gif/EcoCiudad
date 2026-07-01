import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations';
import { useAuth } from '@/presentation/hooks';
import { Button, ThemedText } from '@/presentation/components/atoms';
import { PasswordField } from '@/presentation/components/molecules/password-field';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';

const AnimatedView = Animated.createAnimatedComponent(View);

function ResetPasswordContent() {
  const theme = useTheme();
  const router = useRouter();
  const { updatePassword, isLoading, error, clearError } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const shakeValue = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    clearError();
    const result = await updatePassword(data.password);

    if (result.success) {
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
            <ThemedText style={styles.successEmoji}>&#x2705;</ThemedText>
          </View>
          <ThemedText type="headline" style={[styles.successTitle, { color: theme.colors.textPrimary }]}>
            Password Reset!
          </ThemedText>
          <ThemedText type="body" style={[styles.successText, { color: theme.colors.textSecondary }]}>
            Your password has been successfully reset. You can now sign in with your new password.
          </ThemedText>

          <View style={styles.successActions}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.replace('/(auth)/role-selection')}
            >
              Sign In
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
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <ThemedText style={styles.iconText}>&#x1F512;</ThemedText>
          </View>
          <ThemedText type="displayLarge" style={[styles.title, { color: theme.colors.textPrimary }]}>
            Reset Password
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Create a new strong password for your account
          </ThemedText>
        </AnimatedView>

        <AnimatedView entering={FadeInUp.duration(animations.duration.slow).delay(100)} style={styles.form}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                label="New Password"
                placeholder="Enter new password"
                errorText={errors.password?.message}
                hasError={!!errors.password}
                showStrength
                autoComplete="password-new"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                label="Confirm Password"
                placeholder="Confirm new password"
                errorText={errors.confirmPassword?.message}
                hasError={!!errors.confirmPassword}
                autoComplete="password-new"
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
            iconName="check"
            iconPosition="right"
          >
            Reset Password
          </Button>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function ResetPasswordScreen() {
  return <ResetPasswordContent />;
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconText: {
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
    marginBottom: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  successActions: {
    width: '100%',
    gap: spacing.md,
  },
});
