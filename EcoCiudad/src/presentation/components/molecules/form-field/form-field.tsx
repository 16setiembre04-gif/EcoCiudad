import { Input } from '@/components/atoms/input';
import { FormFieldProps } from './types';

export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  icon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  disabled,
  multiline,
  numberOfLines,
  containerStyle,
  inputStyle,
  labelStyle,
  required,
  testID,
}: FormFieldProps) {
  const displayLabel = required ? `${label} *` : label;

  return (
    <Input
      label={displayLabel}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      errorText={error}
      helperText={helperText}
      leftIcon={icon}
      rightIcon={rightIcon}
      onRightIconPress={onRightIconPress}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      disabled={disabled}
      multiline={multiline}
      numberOfLines={numberOfLines}
      containerStyle={containerStyle}
      inputStyle={inputStyle}
      labelStyle={labelStyle}
      state={error ? 'error' : 'default'}
      testID={testID}
    />
  );
}
