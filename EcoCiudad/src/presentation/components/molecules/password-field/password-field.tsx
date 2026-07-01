import { useState, useMemo } from 'react';
import { View } from 'react-native';
import { Input } from '@/presentation/components/atoms/input';
import { PasswordStrength } from '@/presentation/components/molecules/password-strength';
import { type PasswordFieldProps } from './types';

export function PasswordField({
  value,
  onChangeText,
  onBlur,
  label = 'Password',
  placeholder = 'Enter your password',
  errorText,
  hasError = false,
  disabled = false,
  showStrength = false,
  size = 'lg',
  autoComplete = 'password',
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => {
    if (!showStrength || !value) return undefined;
    return value;
  }, [showStrength, value]);

  return (
    <View>
      <Input
        label={label}
        placeholder={placeholder}
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
