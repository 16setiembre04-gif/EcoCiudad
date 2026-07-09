import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInFormData } from '@/lib/validations';
import { useAuth } from '@/presentation/hooks';
import { GuestGuard } from '@/presentation/components/organisms/auth-guard';
import { Button, Input, ThemedText } from '@/presentation/components/atoms';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';

function LoginScreenContent() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { signIn, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    clearError();
    await signIn(data);
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
            {t('auth.welcomeBack')}
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('auth.signInSubtitle')}
          </ThemedText>
        </View>

        <View style={styles.form}>
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
                placeholder={t('auth.enterPassword')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.password?.message}
                state={errors.password ? 'error' : 'default'}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                size="lg"
                rightIcon={showPassword ? 'eye-off' : 'eye'}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: '#FEE2E2' }]}>
              <ThemedText style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </ThemedText>
            </View>
          )}

          <View style={styles.forgotPassword}>
            <Link href="/(auth)/forgot-password" asChild>
              <Button variant="ghost" size="sm">
                {t('auth.forgotPassword')}
              </Button>
            </Link>
          </View>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
          >
            {t('auth.signIn')}
          </Button>

          <View style={styles.registerContainer}>
            <ThemedText style={{ color: theme.colors.textSecondary }}>
              {t('auth.dontHaveAccount')}{' '}
            </ThemedText>
            <Link href="/(auth)/register" asChild>
              <Button variant="ghost" size="sm">
                {t('auth.signUp')}
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function LoginScreen() {
  return (
    <GuestGuard>
      <LoginScreenContent />
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
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
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: -spacing.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
