import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@/lib/validations';
import { useAuth } from '@/presentation/hooks';
import { GuestGuard } from '@/presentation/components/organisms/auth-guard';
import { Button, Input, ThemedText } from '@/presentation/components/atoms';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type UserRole } from '@/domain/entities';

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'citizen', label: 'Citizen', description: 'Report issues and join community events' },
  { value: 'operator', label: 'Operator', description: 'Manage reports and collection routes' },
  { value: 'admin', label: 'Administrator', description: 'Full system access and management' },
];

function RegisterScreenContent() {
  const theme = useTheme();
  const { signUp, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'citizen',
      acceptTerms: false,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignUpFormData) => {
    clearError();
    const result = await signUp(data);

    if (result.success) {
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: data.email },
      });
    }
  };

  const selectRole = (role: UserRole) => {
    setValue('role', role, { shouldValidate: true });
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
        <View style={styles.header}>
          <ThemedText type="displayLarge" style={[styles.title, { color: theme.colors.textPrimary }]}>
            Create Account
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Join EcoCiudad and make a difference
          </ThemedText>
        </View>

        <View style={styles.form}>
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
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Create a password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.password?.message}
                state={errors.password ? 'error' : 'default'}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                size="lg"
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.confirmPassword?.message}
                state={errors.confirmPassword ? 'error' : 'default'}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                size="lg"
                rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          />

          <View style={styles.roleSection}>
            <ThemedText type="subtitle" style={{ color: theme.colors.textPrimary }}>
              Select Your Role
            </ThemedText>
            <View style={styles.roleOptions}>
              {ROLES.map((role) => (
                <Pressable
                  key={role.value}
                  style={[
                    styles.roleOption,
                    {
                      backgroundColor: selectedRole === role.value
                        ? theme.colors.primaryLight
                        : theme.colors.surface,
                      borderColor: selectedRole === role.value
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                  ]}
                  onPress={() => selectRole(role.value)}
                >
                  <ThemedText
                    type="button"
                    style={{
                      color: selectedRole === role.value
                        ? theme.colors.onPrimary
                        : theme.colors.textPrimary,
                    }}
                  >
                    {role.label}
                  </ThemedText>
                  <ThemedText
                    type="bodySmall"
                    style={{
                      color: selectedRole === role.value
                        ? theme.colors.onPrimary
                        : theme.colors.textSecondary,
                      marginTop: 4,
                    }}
                  >
                    {role.description}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {errors.role && (
              <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.role.message}
              </ThemedText>
            )}
          </View>

          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <Pressable
                style={styles.termsContainer}
                onPress={() => onChange(!value)}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: value ? theme.colors.primary : theme.colors.border,
                      backgroundColor: value ? theme.colors.primary : 'transparent',
                    },
                  ]}
                >
                  {value && (
                    <ThemedText style={{ color: theme.colors.onPrimary, fontSize: 12 }}>
                      ✓
                    </ThemedText>
                  )}
                </View>
                <ThemedText type="bodySmall" style={{ color: theme.colors.textSecondary, flex: 1 }}>
                  I agree to the Terms of Service and Privacy Policy
                </ThemedText>
              </Pressable>
            )}
          />
          {errors.acceptTerms && (
            <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.acceptTerms.message}
            </ThemedText>
          )}

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: '#FEE2E2' }]}>
              <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </ThemedText>
            </View>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>

          <View style={styles.loginContainer}>
            <ThemedText style={{ color: theme.colors.textSecondary }}>
              Already have an account?{' '}
            </ThemedText>
            <Link href="/(auth)/login" asChild>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function RegisterScreen() {
  return (
    <GuestGuard>
      <RegisterScreenContent />
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
    padding: spacing.lg,
    paddingVertical: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
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
  roleSection: {
    gap: spacing.md,
  },
  roleOptions: {
    gap: spacing.md,
  },
  roleOption: {
    padding: spacing.lg,
    borderRadius: 14,
    borderWidth: 2,
  },
  errorContainer: {
    padding: spacing.md,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
