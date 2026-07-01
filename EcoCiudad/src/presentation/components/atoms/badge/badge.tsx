import { Text, View } from 'react-native';
import { BadgeProps } from './types';
import { getBadgeStyles } from './styles';
import { useTheme } from '@/theme/context';
import { Icon } from '../icon';

export function Badge({
  children,
  variant = 'filled',
  size = 'md',
  color = 'primary',
  iconName,
  dot,
  style,
  textStyle,
}: BadgeProps) {
  const theme = useTheme();
  const styles = getBadgeStyles(variant, size, color, theme.colors);

  if (dot) {
    return (
      <View
        style={[
          { width: 8, height: 8, borderRadius: 4, backgroundColor: styles.dotColor },
          style,
        ]}
        accessibilityRole="image"
      />
    );
  }

  return (
    <View style={[styles.container, style]} accessibilityRole="text">
      {iconName && <Icon name={iconName} size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} color={styles.text.color} />}
      {children && <Text style={[styles.text, textStyle]}>{children}</Text>}
    </View>
  );
}
