import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { citizenSignUpSchema, type CitizenSignUpFormData } from '@/lib/validations';
import { Button, Input, ThemedText } from '@/presentation/components/atoms';
import { PasswordField } from '@/presentation/components/molecules/password-field';
import { TermsCheckbox } from '@/presentation/components/molecules/terms-checkbox';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { type RegisterFormProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  accentColor,
}: RegisterFormProps) {
  const theme = useTheme();
  const shakeValue = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CitizenSignUpFormData>({
    resolver: zodResolver(citizenSignUpSchema),
    defaultValues: {
      displayName: '',
      email: '',
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

  const handleFormSubmit = (data: CitizenSignUpFormData) => {
    if (error) triggerShake();
    onSubmit(data);
  };

  return (
    <View style={styles.container}>
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
            accentColor={accentColor}
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
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        disabled={isLoading}
        iconName="arrow-right"
        iconPosition="right"
      >
        Create Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
