import { Pressable, Text, View } from 'react-native';
import { ChipProps } from './types';
import { getChipStyles } from './styles';
import { useTheme } from '@/theme/context';
import { Icon } from '../icon';

export function Chip({
  children,
  variant = 'tonal',
  size = 'md',
  iconName,
  selected = false,
  onPress,
  onDismiss,
  dismissAccessibilityLabel = 'Cerrar',
  style,
  textStyle,
}: ChipProps) {
  const theme = useTheme();
  const styles = getChipStyles(variant, size, selected, theme.colors);

  const content = (
    <>
      {iconName && <Icon name={iconName} size={styles.iconSize} color={styles.iconColor} />}
      <Text style={[styles.text, { flex: 1, flexShrink: 1 }, textStyle]} numberOfLines={1} ellipsizeMode="tail" adjustsFontSizeToFit>
        {children}
      </Text>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={dismissAccessibilityLabel}
        >
          <Icon name="close" size={styles.iconSize} color={styles.iconColor} />
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={[styles.container, style]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {content}
    </View>
  );
}
