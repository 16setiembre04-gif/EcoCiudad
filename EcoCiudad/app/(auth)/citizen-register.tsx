import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { citizenSignUpSchema, type CitizenSignUpFormData } from '@/lib/validations';
import { useAuth } from '@/presentation/hooks';
import { GuestGuard } from '@/presentation/components/organisms/auth-guard';
import { Button, Input, ThemedText } from '@/presentation/components/atoms';
import { PasswordField } from '@/presentation/components/molecules/password-field';
import { TermsCheckbox } from '@/presentation/components/molecules/terms-checkbox';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { animations } from '@/theme/animations';
import { useTranslation } from '@/localization';

const AnimatedView = Animated.createAnimatedComponent(View);

function CitizenRegisterContent() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { signUp, isLoading, error, clearError } = useAuth();
  const shakeValue = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CitizenSignUpFormData>({
    resolver: zodResolver(citizenSignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      department: '',
      district: '',
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

  const onSubmit = async (data: CitizenSignUpFormData) => {
    clearError();
    const result = await signUp({
      displayName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      role: 'citizen',
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
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <ThemedText style={styles.logoText}>&#x1F331;</ThemedText>
          </View>
          <ThemedText type="display" style={[styles.title, { color: theme.colors.textPrimary }]}>
            {t('citizenRegister.title')}
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('citizenRegister.subtitle')}
          </ThemedText>
        </AnimatedView>

        <AnimatedView entering={FadeInUp.duration(animations.duration.slow).delay(100)} style={styles.form}>
          <View style={styles.nameRow}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.nameField}>
                  <Input
                    label={t('citizenRegister.firstName')}
                    placeholder={t('citizenRegister.firstNamePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorText={errors.firstName?.message}
                    state={errors.firstName ? 'error' : 'default'}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    size="lg"
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.nameField}>
                  <Input
                    label={t('citizenRegister.lastName')}
                    placeholder={t('citizenRegister.lastNamePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorText={errors.lastName?.message}
                    state={errors.lastName ? 'error' : 'default'}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    size="lg"
                  />
                </View>
              )}
            />
          </View>

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
                leftIcon="email"
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('citizenRegister.phone')}
                placeholder={t('citizenRegister.phonePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.phone?.message}
                state={errors.phone ? 'error' : 'default'}
                keyboardType="phone-pad"
                autoComplete="tel"
                size="lg"
                leftIcon="phone"
              />
            )}
          />

          <View style={styles.nameRow}>
            <Controller
              control={control}
              name="department"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.nameField}>
                  <Input
                    label={t('citizenRegister.department')}
                    placeholder={t('citizenRegister.departmentPlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorText={errors.department?.message}
                    state={errors.department ? 'error' : 'default'}
                    autoCapitalize="words"
                    size="lg"
                    leftIcon="location"
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="district"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.nameField}>
                  <Input
                    label={t('citizenRegister.district')}
                    placeholder={t('citizenRegister.districtPlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorText={errors.district?.message}
                    state={errors.district ? 'error' : 'default'}
                    autoCapitalize="words"
                    size="lg"
                    leftIcon="map"
                  />
                </View>
              )}
            />
          </View>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                label={t('auth.password')}
                placeholder={t('citizenRegister.createPassword')}
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
                label={t('auth.confirmPassword')}
                placeholder={t('citizenRegister.confirmPasswordPlaceholder')}
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
                accentColor={theme.colors.primary}
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
            {t('citizenRegister.createAccount')}
          </Button>

          <View style={styles.loginContainer}>
            <ThemedText style={{ color: theme.colors.textSecondary }}>
              {t('auth.haveAccount')}{' '}
            </ThemedText>
            <Link href="/(auth)/citizen-login" asChild>
              <Button variant="ghost" size="sm">
                {t('auth.signIn')}
              </Button>
            </Link>
          </View>

          <View style={styles.changeRoleContainer}>
            <Link href="/(auth)/role-selection" asChild>
              <Button variant="ghost" size="sm">
                {t('auth.changeRole')}
              </Button>
            </Link>
          </View>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function CitizenRegisterScreen() {
  return (
    <GuestGuard>
      <CitizenRegisterContent />
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
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  nameField: {
    flex: 1,
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
