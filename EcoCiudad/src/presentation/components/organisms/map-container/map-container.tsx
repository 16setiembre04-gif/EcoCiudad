import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { type MapContainerProps } from './types';

export function MapContainer({
  centers,
  userLocation,
  selectedCenterId,
  onMarkerPress,
  onRegionChange,
  style,
}: MapContainerProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }, style]}>
      <View style={styles.placeholder}>
        <Icon name="map" size={64} color={theme.colors.textSecondary} />
        <ThemedText type="title" color={theme.colors.textSecondary}>
          Map View
        </ThemedText>
        <ThemedText type="bodySmall" color={theme.colors.textSecondary} style={styles.subtitle}>
          {centers.length} recycling center{centers.length !== 1 ? 's' : ''} nearby
        </ThemedText>
        {userLocation && (
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  subtitle: {
    textAlign: 'center',
  },
});
