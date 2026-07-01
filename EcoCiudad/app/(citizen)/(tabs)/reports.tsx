import { useCallback, useState } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { ReportList } from '@/presentation/components/organisms/report-list';
import { ReportFilters } from '@/presentation/components/organisms/report-filters';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { useMyReports } from '@/presentation/hooks/use-report-queries.hook';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type ReportCategory, type ReportStatus } from '@/domain/entities';

export default function ReportsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | undefined>();

  const { data: reports, isLoading, isRefetching, refetch } = useMyReports({
    category: selectedCategory,
    status: selectedStatus,
    search: searchQuery || undefined,
  });

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(citizen)/report/${id}`);
  }, [router]);

  const handleCreatePress = useCallback(() => {
    router.push('/(citizen)/report/create');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setSearchQuery('');
  }, []);

  return (
    <DashboardTemplate
      header={
        <Header
          title="My Reports"
          showBackButton={false}
          rightIcon="plus"
          onRightPress={handleCreatePress}
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

        <ReportFilters
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onClearFilters={handleClearFilters}
        />

        <ReportList
          reports={reports ?? []}
          isLoading={isLoading}
          onReportPress={handleReportPress}
        />
      </Animated.ScrollView>
    </DashboardTemplate>
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
});
