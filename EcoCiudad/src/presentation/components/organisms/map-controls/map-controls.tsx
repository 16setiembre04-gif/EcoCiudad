import { Badge } from '@/presentation/components/atoms/badge';
import { Icon } from '@/presentation/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Pressable, View } from 'react-native';
import { MapControlsProps } from './types';

export function MapControls({
  items,
  onItemPress,
  position = 'right',
  containerStyle,
  testID,
}: MapControlsProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          position: 'absolute',
          [position]: spacing.lg,
          top: spacing.lg,
          gap: spacing.md,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onItemPress(item.key)}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            position: 'relative',
          }}
          accessibilityRole="button"
          accessibilityLabel={item.label || item.key}
        >
          <Icon name={item.icon} size={22} color={theme.colors.textPrimary} />
          {item.badge !== undefined && item.badge > 0 && (
            <View style={{ position: 'absolute', top: -2, right: -2 }}>
              <Badge variant="filled" color="primary">
                {item.badge > 9 ? '9+' : item.badge}
              </Badge>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}
