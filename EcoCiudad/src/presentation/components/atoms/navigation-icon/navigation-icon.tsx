import { Icon } from '@/presentation/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { useTranslation } from '@/localization';
import { Pressable, StyleSheet } from 'react-native';
import { type NavigationIconProps } from './types';

export function NavigationIcon({
  onPress,
  size = 24,
  style,
}: NavigationIconProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.colors.primary }, style]}
      accessibilityRole="button"
      accessibilityLabel={t('common.getDirections')}
    >
      <Icon name="route" size={size} color={theme.colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
