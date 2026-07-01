import { View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  color?: string;
  style?: ViewStyle;
}

export function Divider({
  orientation = 'horizontal',
  spacing: spacingValue,
  color,
  style,
}: DividerProps) {
  const theme = useTheme();
  const dividerColor = color ?? theme.colors.divider;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          {
            width: 1,
            alignSelf: 'stretch',
            backgroundColor: dividerColor,
            marginHorizontal: spacingValue ?? spacing.sm,
          },
          style,
        ]}
        accessibilityRole="none"
      />
    );
  }

  return (
    <View
      style={[
        {
          height: 1,
          alignSelf: 'stretch',
          backgroundColor: dividerColor,
          marginVertical: spacingValue ?? spacing.sm,
        },
        style,
      ]}
      accessibilityRole="none"
    />
  );
}
