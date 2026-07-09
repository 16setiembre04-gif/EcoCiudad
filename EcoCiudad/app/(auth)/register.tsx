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
import { useTranslation } from '@/localization';
import { type UserRole } from '@/domain/entities';

function RegisterScreenContent() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { signUp, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ROLES: { value: UserRole; label: string; description: string }[] = [
    { value: 'citizen', label: t('auth.citizen'), description: t('auth.communityJoin') },
    { value: 'operator', label: t('auth.operator'), description: t('auth.operatorManage') },
    { value: 'admin', label: t('auth.admin'), description: t('auth.adminFull') },
  ];

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
          <ThemedText type="display" style={[styles.title, { color: theme.colors.textPrimary }]}>
            {t('citizenRegister.createAccount')}
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('auth.joinEcoCiudad')}
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('operatorRegister.fullName')}
                placeholder={t('operatorRegister.fullNamePlaceholder')}
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
                label={t('auth.email')}
                placeholder={t('citizenRegister.emailPlaceholder')}
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
                label={t('auth.password')}
                placeholder={t('citizenRegister.createPassword')}
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
                label={t('auth.confirmPassword')}
                placeholder={t('citizenRegister.confirmPasswordPlaceholder')}
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
              {t('auth.selectRole')}
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
                  {t('auth.termsAgreement')}
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
            {t('citizenRegister.createAccount')}
          </Button>

          <View style={styles.loginContainer}>
            <ThemedText style={{ color: theme.colors.textSecondary }}>
              {t('auth.haveAccount')}{' '}
            </ThemedText>
            <Link href="/(auth)/login" asChild>
              <Button variant="ghost" size="sm">
                {t('auth.signIn')}
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
