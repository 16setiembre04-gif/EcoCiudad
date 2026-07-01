import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import Animated from 'react-native-reanimated';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { Header } from '@/components/organisms/header';
import { MapContainer } from '@/components/organisms/map-container';
import { ThemedText } from '@/components/atoms/text';
import { useAssignedReports } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';

export default function OperatorMapScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  const { data: reports, isLoading } = useAssignedReports();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to show your position');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleMarkerPress = (reportId: string) => {
    router.push(`/(operator)/reports/${reportId}`);
  };

  return (
    <OperatorLayout
      header={
        <Header
          title="Map View"
          onBackPress={() => router.back()}
        />
      }
    >
      <View style={styles.container}>
        <MapContainer
          centers={reports ?? []}
          userLocation={userLocation}
          onMarkerPress={handleMarkerPress}
          style={styles.map}
        />

        <View style={styles.infoContainer}>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {reports?.length ?? 0} report{(reports?.length ?? 0) !== 1 ? 's' : ''} assigned
          </ThemedText>
        </View>
      </View>
    </OperatorLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    margin: spacing.lg,
  },
  infoContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
});
