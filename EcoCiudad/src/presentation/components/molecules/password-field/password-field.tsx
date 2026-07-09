import { useState, useMemo } from 'react';
import { View } from 'react-native';
import { Input } from '@/presentation/components/atoms/input';
import { PasswordStrength } from '@/presentation/components/molecules/password-strength';
import { useTranslation } from '@/localization';
import { type PasswordFieldProps } from './types';

export function PasswordField({
  value,
  onChangeText,
  onBlur,
  label,
  placeholder,
  errorText,
  hasError = false,
  disabled = false,
  showStrength = false,
  size = 'lg',
  autoComplete = 'password',
}: PasswordFieldProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => {
    if (!showStrength || !value) return undefined;
    return value;
  }, [showStrength, value]);

  return (
    <View>
      <Input
        label={label ?? t('common.password')}
        placeholder={placeholder ?? t('common.enterYourPassword')}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        errorText={errorText}
        state={hasError ? 'error' : 'default'}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete={autoComplete}
        size={size}
        disabled={disabled}
        leftIcon="lock"
        rightIcon={showPassword ? 'eye-off' : 'eye'}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />
      {strength !== undefined && (
        <PasswordStrength password={strength} />
      )}
    </View>
  );
}
