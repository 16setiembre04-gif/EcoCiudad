import { useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { Header } from '@/components/organisms/header';
import { SearchBar } from '@/components/molecules/search-bar';
import { AssignedReportsList } from '@/components/organisms/assigned-reports-list';
import { Chip } from '@/components/atoms/chip';
import { useAssignedReports } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { REPORT_CATEGORIES } from '@/constants/report.constants';
import { type ReportStatus } from '@/domain/entities';

type StatusFilter = 'all' | ReportStatus;

export default function OperatorReportsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const { data: reports, isLoading, refetch, isRefetching } = useAssignedReports({
    status: statusFilter === 'all' ? undefined : statusFilter,
    category: categoryFilter,
    search: searchQuery || undefined,
  });

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(operator)/reports/${id}`);
  }, [router]);

  return (
    <OperatorLayout
      header={
        <Header
          title="Assigned Reports"
          showBackButton={false}
        />
      }
    >
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reports..."
          />
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            {(['all', 'pending', 'assigned', 'in_progress', 'resolved'] as StatusFilter[]).map((status) => (
              <Chip
                key={status}
                variant={statusFilter === status ? 'filled' : 'tonal'}
                size="sm"
                onPress={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Chip>
            ))}
          </View>

          <View style={styles.filterRow}>
            <Chip
              variant={!categoryFilter ? 'filled' : 'tonal'}
              size="sm"
              onPress={() => setCategoryFilter(undefined)}
            >
              All Categories
            </Chip>
            {Object.entries(REPORT_CATEGORIES).map(([key, config]) => (
              <Chip
                key={key}
                variant={categoryFilter === key ? 'filled' : 'tonal'}
                size="sm"
                iconName={config.icon}
                onPress={() => setCategoryFilter(key)}
              >
                {config.label}
              </Chip>
            ))}
          </View>
        </View>

        <AssignedReportsList
          reports={reports ?? []}
          isLoading={isLoading}
          onReportPress={handleReportPress}
          title="Reports"
          horizontal={false}
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  filtersContainer: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
