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
import { useTranslation } from '@/localization';
import { type RegisterFormProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  accentColor,
}: RegisterFormProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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
      department: '',
      district: '',
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
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
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
            leftIcon="user"
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
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
            leftIcon="user"
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

      <Controller
        control={control}
        name="department"
        render={({ field: { onChange, onBlur, value } }) => (
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
        )}
      />

      <Controller
        control={control}
        name="district"
        render={({ field: { onChange, onBlur, value } }) => (
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
            leftIcon="location"
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
            label={t('citizenRegister.createPassword')}
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
        {t('citizenRegister.createAccount')}
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
