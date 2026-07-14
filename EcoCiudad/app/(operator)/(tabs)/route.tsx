import { Header } from '@/presentation/components/organisms/header';
import { RoutePlanner } from '@/presentation/components/organisms/route-planner';
import { MapViewer } from '@/presentation/components/organisms/map-viewer';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useOptimizeRoute, useTodayRoute } from '@/presentation/hooks';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Linking, Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function OperatorRouteScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: route, isLoading, refetch } = useTodayRoute();
  const { mutate: optimizeRoute } = useOptimizeRoute();

  const handleOptimize = useCallback(() => {
    if (!route || route.length === 0) return;
    const reportIds = route.map(r => r.id);
    optimizeRoute(reportIds, {
      onSuccess: () => {
        refetch();
      },
    });
  }, [route, optimizeRoute, refetch]);

  const handleStartRoute = useCallback(() => {
    if (!route || route.length === 0) return;

    const start = route[0].location;
    const destination = route[route.length - 1].location;
    const viaPoints = route.slice(1, -1);

    const viaParams = viaPoints
      .map((r) => `&via=${r.location.latitude}%2C${r.location.longitude}`)
      .join('');

    const url = Platform.select({
      ios: `https://www.openstreetmap.org/directions?from=${start.latitude},${start.longitude}&to=${destination.latitude},${destination.longitude}${viaParams}`,
      default: `https://www.openstreetmap.org/directions?from=${start.latitude},${start.longitude}&to=${destination.latitude},${destination.longitude}${viaParams}`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        return Linking.openURL(url);
      })
      .catch(() => {
        Alert.alert(t('common.error'), t('common.failedToOpenMaps'));
      });
  }, [route, t]);

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(operator)/reports/${id}`);
  }, [router]);

  return (
    <OperatorLayout
      header={
        <Header
          title={t('common.routePlanning')}
          onBackPress={() => router.back()}
        />
      }
    >
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {route && route.length > 0 && (
          <View style={styles.mapSection}>
            <MapViewer
              points={route
                .filter((r) => r.location?.latitude && r.location?.longitude)
                .map((r, index) => ({
                  id: r.id,
                  latitude: r.location.latitude,
                  longitude: r.location.longitude,
                  title: `${index + 1}. ${r.title}`,
                  description: r.location.address ?? '',
                  icon: 'report',
                }))}
              routeCoordinates={route
                .filter((r) => r.location?.latitude && r.location?.longitude)
                .map((r) => r.location)}
              showsUserLocation
              containerStyle={styles.map}
            />
          </View>
        )}
        <RoutePlanner
          route={route ?? []}
          isLoading={isLoading}
          onOptimize={handleOptimize}
          onStartRoute={handleStartRoute}
          onReportPress={handleReportPress}
        />
      </Animated.ScrollView>
    </OperatorLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['5xl'],
  },
  mapSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    height: 240,
  },
  map: {
    borderRadius: 16,
  },
});
