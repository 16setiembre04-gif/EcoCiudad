import { useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { EventsLayout } from '@/presentation/components/templates/events-layout';
import { Header } from '@/presentation/components/organisms/header';
import { UpcomingEventsList } from '@/presentation/components/organisms/upcoming-events-list';
import { Chip } from '@/presentation/components/atoms/chip';
import { useMyEvents, useEventFavorites, useToggleFavorite } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';

type TabKey = 'upcoming' | 'completed' | 'cancelled';

export default function MyEventsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

  const { data: upcomingEvents, isLoading: upcomingLoading, refetch: refetchUpcoming, isRefetching: upcomingRefetching } = useMyEvents('upcoming');
  const { data: completedEvents, isLoading: completedLoading, refetch: refetchCompleted, isRefetching: completedRefetching } = useMyEvents('completed');
  const { data: cancelledEvents, isLoading: cancelledLoading, refetch: refetchCancelled, isRefetching: cancelledRefetching } = useMyEvents('cancelled');
  const { data: favorites } = useEventFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : activeTab === 'completed' ? completedEvents : cancelledEvents;
  const currentLoading = activeTab === 'upcoming' ? upcomingLoading : activeTab === 'completed' ? completedLoading : cancelledLoading;
  const currentRefetching = activeTab === 'upcoming' ? upcomingRefetching : activeTab === 'completed' ? completedRefetching : cancelledRefetching;

  const favoriteIds = favorites?.map((e) => e.id) ?? [];
  const registeredIds = [...(upcomingEvents ?? []), ...(completedEvents ?? [])].map((e) => e.id);

  const handleRefresh = useCallback(() => {
    refetchUpcoming();
    refetchCompleted();
    refetchCancelled();
  }, [refetchUpcoming, refetchCompleted, refetchCancelled]);

  const handleEventPress = useCallback((id: string) => {
    router.push(`/(citizen)/events/${id}`);
  }, [router]);

  const handleFavoritePress = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const getTabTitle = (tab: TabKey) => {
    switch (tab) {
      case 'upcoming': return t('common.upcoming');
      case 'completed': return t('common.completed');
      case 'cancelled': return t('common.cancelled');
    }
  };

  const getListTitle = (tab: TabKey) => {
    switch (tab) {
      case 'upcoming': return t('common.upcomingEvents');
      case 'completed': return t('common.completedEvents');
      case 'cancelled': return t('common.cancelledEvents');
    }
  };

  return (
    <EventsLayout
      header={
        <Header
          title={t('common.myEvents')}
          onBackPress={() => router.back()}
        />
      }
    >
      <View style={styles.tabsContainer}>
        <Chip
          variant={activeTab === 'upcoming' ? 'filled' : 'tonal'}
          size="sm"
          iconName="calendar"
          onPress={() => setActiveTab('upcoming')}
        >
          {getTabTitle('upcoming')} ({upcomingEvents?.length ?? 0})
        </Chip>
        <Chip
          variant={activeTab === 'completed' ? 'filled' : 'tonal'}
          size="sm"
          iconName="check"
          onPress={() => setActiveTab('completed')}
        >
          {getTabTitle('completed')} ({completedEvents?.length ?? 0})
        </Chip>
        <Chip
          variant={activeTab === 'cancelled' ? 'filled' : 'tonal'}
          size="sm"
          iconName="close"
          onPress={() => setActiveTab('cancelled')}
        >
          {getTabTitle('cancelled')} ({cancelledEvents?.length ?? 0})
        </Chip>
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={currentRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <UpcomingEventsList
          events={currentEvents ?? []}
          isLoading={currentLoading}
          favorites={favoriteIds}
          registeredEvents={registeredIds}
          onEventPress={handleEventPress}
          onFavoritePress={handleFavoritePress}
          title={getListTitle(activeTab)}
          horizontal={false}
        />
      </Animated.ScrollView>
    </EventsLayout>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['5xl'],
  },
});
