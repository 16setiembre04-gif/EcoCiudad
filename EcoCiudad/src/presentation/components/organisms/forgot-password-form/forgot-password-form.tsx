import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { Button, Input, ThemedText } from '@/presentation/components/atoms';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { useTranslation } from '@/localization';
import { type ForgotPasswordFormProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
  error,
}: ForgotPasswordFormProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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

  const handleFormSubmit = (data: ForgotPasswordFormData) => {
    if (error) triggerShake();
    onSubmit(data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('common.email')}
            placeholder={t('common.enterYourEmail')}
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
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        disabled={isLoading}
        iconName="send"
        iconPosition="right"
      >
        {t('common.sendResetLink')}
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
});
