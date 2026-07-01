import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { operatorSignUpSchema, type OperatorSignUpFormData } from '@/lib/validations';
import { useAuth } from '@/presentation/hooks';
import { GuestGuard } from '@/presentation/components/organisms/auth-guard';
import { Button, Input, ThemedText } from '@/presentation/components/atoms';
import { PasswordField } from '@/presentation/components/molecules/password-field';
import { TermsCheckbox } from '@/presentation/components/molecules/terms-checkbox';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';

const AnimatedView = Animated.createAnimatedComponent(View);

function OperatorRegisterContent() {
  const theme = useTheme();
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuth();

  const shakeValue = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OperatorSignUpFormData>({
    resolver: zodResolver(operatorSignUpSchema),
    defaultValues: {
      displayName: '',
      email: '',
      employeeId: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
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

  const onSubmit = async (data: OperatorSignUpFormData) => {
    clearError();
    const result = await signUp({
      ...data,
      role: 'operator',
    });
    if (result.success) {
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: data.email },
      });
    } else {
      triggerShake();
    }
  };

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
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.secondaryLight }]}>
            <ThemedText style={styles.logoText}>🏢</ThemedText>
          </View>
          <ThemedText type="displayLarge" style={[styles.title, { color: theme.colors.textPrimary }]}>
            Operator Registration
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Join our professional team
          </ThemedText>
        </AnimatedView>

        <AnimatedView entering={FadeInUp.duration(animations.duration.slow).delay(100)} style={styles.form}>
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.displayName?.message}
                state={errors.displayName ? 'error' : 'default'}
                autoCapitalize="words"
                autoComplete="name"
                size="lg"
                leftIcon="user"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Official Email"
                placeholder="Enter your official email"
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

          <Controller
            control={control}
            name="employeeId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Employee ID"
                placeholder="Enter your employee ID"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.employeeId?.message}
                state={errors.employeeId ? 'error' : 'default'}
                autoCapitalize="none"
                size="lg"
                leftIcon="tasks"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                label="Password"
                placeholder="Create a password"
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
                placeholder="Confirm your password"
                errorText={errors.confirmPassword?.message}
                hasError={!!errors.confirmPassword}
                autoComplete="password-new"
              />
            )}
          />

          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <TermsCheckbox
                checked={value}
                onCheckedChange={onChange}
                error={!!errors.acceptTerms}
                accentColor={theme.colors.secondary}
              />
            )}
          />
          {errors.acceptTerms && (
            <ThemedText style={[styles.errorFieldText, { color: theme.colors.error }]}>
              {errors.acceptTerms.message}
            </ThemedText>
          )}

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
            iconName="arrow-right"
            iconPosition="right"
          >
            Create Account
          </Button>

          <View style={styles.loginContainer}>
            <ThemedText style={{ color: theme.colors.textSecondary }}>
              Already have an account?{' '}
            </ThemedText>
            <Link href="/(auth)/operator-login" asChild>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          </View>

          <View style={styles.changeRoleContainer}>
            <Link href="/(auth)/role-selection" asChild>
              <Button variant="ghost" size="sm">
                Change Role
              </Button>
            </Link>
          </View>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function OperatorRegisterScreen() {
  return (
    <GuestGuard>
      <OperatorRegisterContent />
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
    paddingVertical: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
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
  errorFieldText: {
    fontSize: 14,
    marginTop: -spacing.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  changeRoleContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
