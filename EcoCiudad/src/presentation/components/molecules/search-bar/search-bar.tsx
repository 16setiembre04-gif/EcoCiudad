import { Input } from '@/presentation/components/atoms/input';
import { SearchBarProps } from './types';

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onSubmit,
  disabled,
  containerStyle,
  testID,
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmit}
      placeholder={placeholder}
      leftIcon="search"
      rightIcon={value.length > 0 ? 'close' : undefined}
      onRightIconPress={value.length > 0 ? handleClear : undefined}
      disabled={disabled}
      containerStyle={containerStyle}
      returnKeyType="search"
      testID={testID}
    />
  );
}
