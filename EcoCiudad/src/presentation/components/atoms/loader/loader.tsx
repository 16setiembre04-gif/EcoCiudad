import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/context';

export type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  color?: string;
  style?: ViewStyle;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 40,
};

export function Loader({ size = 'md', color, style }: LoaderProps) {
  const theme = useTheme();

  return (
    <View style={style}>
      <ActivityIndicator
        size={sizeMap[size]}
        color={color ?? theme.colors.primary}
      />
    </View>
  );
}
