import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { Pressable, StyleSheet, View } from 'react-native';
import { type LocationSelectorProps } from './types';

export function LocationSelector({
  location,
  onPickLocation,
  onClear,
  style,
}: LocationSelectorProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.surfaceVariant }]}
        onPress={onPickLocation}
        accessibilityRole="button"
        accessibilityLabel={location ? 'Change location' : 'Pick location'}
      >
        <Icon name="location" size={20} color={theme.colors.primary} />
        <View style={styles.textContainer}>
          {location?.address ? (
            <ThemedText type="bodySmall" numberOfLines={2}>
              {location.address}
            </ThemedText>
          ) : (
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Tap to select location on map
            </ThemedText>
          )}
        </View>
        <Icon name="chevron-right" size={16} color={theme.colors.textSecondary} />
      </Pressable>
      {location && onClear && (
        <Pressable
          onPress={onClear}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear location"
        >
          <ThemedText type="bodySmall" color={theme.colors.error}>
            Clear
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  clearButton: {
    alignSelf: 'flex-end',
    padding: spacing.xs,
  },
});
