import { Input } from '@/presentation/components/atoms/input';
import { useTranslation } from '@/localization';
import { SearchBarProps } from './types';

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onClear,
  onSubmit,
  disabled,
  containerStyle,
  testID,
}: SearchBarProps) {
  const { t } = useTranslation();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmit}
      placeholder={placeholder ?? t('common.search')}
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
