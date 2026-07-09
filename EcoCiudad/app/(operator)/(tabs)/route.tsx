import { Header } from '@/presentation/components/organisms/header';
import { RoutePlanner } from '@/presentation/components/organisms/route-planner';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useOptimizeRoute, useTodayRoute } from '@/presentation/hooks';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Linking, Platform, StyleSheet } from 'react-native';
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

    const destination = route[route.length - 1].location;
    const waypoints = route.slice(0, -1).map((r) => `${r.location.latitude},${r.location.longitude}`).join('|');

    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${destination.latitude},${destination.longitude}&directionsmode=driving${waypoints ? `&waypoints=${waypoints}` : ''}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving${waypoints ? `&waypoints=${waypoints}` : ''}`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        // Fallback to universal Google Maps web URL
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving${waypoints ? `&waypoints=${waypoints}` : ''}`;
        return Linking.openURL(webUrl);
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
});
