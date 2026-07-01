import { type TextProps as RNTextProps, type StyleProp, type TextStyle } from 'react-native';
import { type TextStyleName } from '@/theme/typography';

export interface ThemedTextProps extends Omit<RNTextProps, 'style'> {
  type?: TextStyleName | 'default';
  color?: string;
  style?: StyleProp<TextStyle>;
}
