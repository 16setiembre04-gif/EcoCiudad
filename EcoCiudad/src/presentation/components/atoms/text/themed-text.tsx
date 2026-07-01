import { Text as RNText } from 'react-native';
import { ThemedTextProps } from './types';
import { useTheme } from '@/theme/context';
import { textStyles } from '@/theme/typography';

export function ThemedText({ type = 'default', color, style, ...props }: ThemedTextProps) {
  const theme = useTheme();

  const textStyle = type === 'default'
    ? { ...textStyles.body, color: color ?? theme.colors.textPrimary }
    : { ...textStyles[type], color: color ?? theme.colors.textPrimary };

  return <RNText style={[textStyle, style]} {...props} />;
}
