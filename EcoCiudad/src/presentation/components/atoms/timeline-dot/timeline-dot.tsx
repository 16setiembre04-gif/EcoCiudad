import { Icon } from '@/presentation/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { StyleSheet, View } from 'react-native';
import { type TimelineDotProps } from './types';

export function TimelineDot({ variant, style }: TimelineDotProps) {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'completed':
        return theme.colors.success;
      case 'current':
        return theme.colors.primary;
      case 'pending':
        return theme.colors.border;
    }
  };

  const getIcon = () => {
    if (variant === 'completed') {
      return <Icon name="check" size={12} color={theme.colors.onPrimary} />;
    }
    return null;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      {getIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
