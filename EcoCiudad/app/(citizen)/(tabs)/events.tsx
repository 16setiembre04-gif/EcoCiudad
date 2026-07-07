import { useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { EventsLayout } from '@/presentation/components/templates/events-layout';
import { Header } from '@/presentation/components/organisms/header';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { UpcomingEventsList } from '@/presentation/components/organisms/upcoming-events-list';
import { CalendarView } from '@/presentation/components/organisms/calendar-view';
import { Chip } from '@/presentation/components/atoms/chip';
import { useEventDashboard, useToggleFavorite } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { EVENT_CATEGORIES } from '@/constants/event.constants';
import { type EventCategory } from '@/domain/entities';

export default function EventsHomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);

  const {
    upcomingEvents,
    popularEvents,
    myEvents,
    favoriteIds,
    registeredIds,
    isLoading,
  } = useEventDashboard();

  const { mutate: toggleFavorite } = useToggleFavorite();

  const filteredUpcoming = upcomingEvents.filter((event) => {
    const matchesSearch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEventPress = useCallback((id: string) => {
    router.push(`/(citizen)/events/${id}`);
  }, [router]);

  const handleFavoritePress = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const handleCreatePress = useCallback(() => {
    router.push('/(citizen)/events/create');
  }, [router]);

  const handleMyEventsPress = useCallback(() => {
    router.push('/(citizen)/events/my-events');
  }, [router]);

  return (
    <EventsLayout
      header={
        <Header
          title="Events"
          showBackButton={false}
          rightIcon="plus"
          onRightIconPress={handleCreatePress}
        />
      }
    >
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} tintColor={theme.colors.primary} />
        }
      >
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search events..."
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Chip
            variant={selectedCategory ? 'tonal' : 'filled'}
            size="sm"
            onPress={() => setSelectedCategory(undefined)}
          >
            All
          </Chip>
          {Object.entries(EVENT_CATEGORIES).map(([key, config]) => (
            <Chip
              key={key}
              variant={selectedCategory === key ? 'filled' : 'tonal'}
              size="sm"
              iconName={config.icon}
              onPress={() => setSelectedCategory(key as EventCategory)}
            >
              {config.label}
            </Chip>
          ))}
        </View>

        <View style={styles.toggleContainer}>
          <Chip
            variant={!showCalendar ? 'filled' : 'tonal'}
            size="sm"
            iconName="list"
            onPress={() => setShowCalendar(false)}
          >
            List
          </Chip>
          <Chip
            variant={showCalendar ? 'filled' : 'tonal'}
            size="sm"
            iconName="calendar"
            onPress={() => setShowCalendar(true)}
          >
            Calendar
          </Chip>
        </View>

        {showCalendar ? (
          <CalendarView
            events={filteredUpcoming}
            onEventPress={handleEventPress}
          />
        ) : (
          <>
            <UpcomingEventsList
              events={filteredUpcoming}
              isLoading={isLoading}
              favorites={favoriteIds}
              registeredEvents={registeredIds}
              onEventPress={handleEventPress}
              onFavoritePress={handleFavoritePress}
              title="Upcoming Events"
              horizontal={false}
            />

            {popularEvents.length > 0 && (
              <View style={styles.sectionSpacer}>
                <UpcomingEventsList
                  events={popularEvents.slice(0, 5)}
                  favorites={favoriteIds}
                  registeredEvents={registeredIds}
                  onEventPress={handleEventPress}
                  onFavoritePress={handleFavoritePress}
                  title="Popular Events"
                  horizontal
                />
              </View>
            )}

            {myEvents.length > 0 && (
              <View style={styles.sectionSpacer}>
                <UpcomingEventsList
                  events={myEvents.slice(0, 5)}
                  favorites={favoriteIds}
                  registeredEvents={registeredIds}
                  onEventPress={handleEventPress}
                  onFavoritePress={handleFavoritePress}
                  title="My Events"
                  horizontal
                  onViewAllPress={handleMyEventsPress}
                />
              </View>
            )}
          </>
        )}
      </Animated.ScrollView>
    </EventsLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['5xl'],
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionSpacer: {
    marginTop: spacing.xl,
  },
});
