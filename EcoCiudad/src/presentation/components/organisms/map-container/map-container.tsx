import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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
  const { t } = useTranslation();

  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: -25.2637,
        longitude: -57.5759,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  if (centers.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }, style]}>
        <View style={styles.placeholder}>
          <Icon name="map" size={64} color={theme.colors.textSecondary} />
          <ThemedText type="title" color={theme.colors.textSecondary}>
            {t('common.mapView')}
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary} style={styles.subtitle}>
            {t('common.noCentersNearby')}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }, style]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={(region) => onRegionChange?.({ latitude: region.latitude, longitude: region.longitude })}
        showsUserLocation
      >
        {centers.map((center) => (
          <Marker
            key={center.id}
            coordinate={{
              latitude: center.latitude,
              longitude: center.longitude,
            }}
            title={center.name}
            description={center.address}
            pinColor={selectedCenterId === center.id ? theme.colors.primary : undefined}
            onPress={() => onMarkerPress?.(center.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
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
