import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { Header } from '@/components/organisms/header';
import { RoutePlanner } from '@/components/organisms/route-planner';
import { useTodayRoute, useOptimizeRoute } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';

export default function OperatorRouteScreen() {
  const theme = useTheme();
  const router = useRouter();

  const { data: route, isLoading, refetch } = useTodayRoute();
  const { mutate: optimizeRoute, isPending: isOptimizing } = useOptimizeRoute();

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
    // TODO: Implement route start logic
    console.log('Starting route...');
  }, []);

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(operator)/reports/${id}`);
  }, [router]);

  return (
    <OperatorLayout
      header={
        <Header
          title="Route Planning"
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
