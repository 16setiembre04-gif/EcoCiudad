import { Chip } from '@/presentation/components/atoms/chip';
import { Icon, type IconName } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

export interface MapLayer {
  key: string;
  label: string;
  icon: IconName;
  color: string;
  activeColor: string;
  count?: number;
}

export interface MapFilterBarProps {
  layers: MapLayer[];
  activeLayers: string[];
  onToggleLayer: (key: string) => void;
  onActivateAll?: () => void;
  style?: import('react-native').ViewStyle;
}

export function MapFilterBar({
  layers,
  activeLayers,
  onToggleLayer,
  onActivateAll,
  style,
}: MapFilterBarProps) {
  const theme = useTheme();
  const allActive = layers.length > 0 && layers.every((layer) => activeLayers.includes(layer.key));

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          onPress={onActivateAll}
          style={[
            styles.allButton,
            {
              backgroundColor: allActive ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: allActive }}
        >
          <Icon
            name="map"
            size={16}
            color={allActive ? theme.colors.onPrimary : theme.colors.textSecondary}
          />
          <ThemedText
            type="bodySmall"
            color={allActive ? theme.colors.onPrimary : theme.colors.textSecondary}
            style={styles.allLabel}
          >
            Todo
          </ThemedText>
        </Pressable>

        {layers.map((layer) => {
          const isActive = activeLayers.includes(layer.key);
          return (
          <Chip
            key={layer.key}
            variant={isActive ? 'filled' : 'outlined'}
            size="sm"
            iconName={layer.icon}
            onPress={() => onToggleLayer(layer.key)}
            style={StyleSheet.flatten([
              styles.chip,
              isActive ? { backgroundColor: layer.activeColor, borderColor: layer.activeColor } : undefined,
            ]) as ViewStyle}
            textStyle={isActive ? { color: '#FFFFFF' } : undefined}
          >
              {layer.label}
              {layer.count !== undefined && ` (${layer.count})`}
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  allButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    gap: spacing.xs,
  },
  allLabel: {
    fontWeight: '600',
  },
  chip: {
    borderRadius: 999,
  },
});
