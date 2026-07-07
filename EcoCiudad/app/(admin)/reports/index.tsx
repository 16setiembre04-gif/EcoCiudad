import { useState, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { AdminLayout } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { ReportCard } from '@/presentation/components/molecules/report-card';
import { ReportFilters } from '@/presentation/components/organisms/report-filters';
import { Card } from '@/presentation/components/atoms/card';
import { Badge } from '@/presentation/components/atoms/badge';
import { Skeleton } from '@/presentation/components/atoms/skeleton';
import { EmptyState } from '@/presentation/components/atoms/empty-state';
import { useAdminReports } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { REPORT_CATEGORIES } from '@/constants';
import { type Report, type ReportStatus, type ReportCategory } from '@/domain/entities';
import { type ReportFilters as ReportFiltersType } from '@/domain/repositories';

export default function AdminReportsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  const filters = useMemo<ReportFiltersType>(() => ({
    search: search || undefined,
    status: statusFilter,
    category: categoryFilter,
    limit: 20,
  }), [search, statusFilter, categoryFilter]);

  const { data: reports, isLoading, refetch } = useAdminReports(filters);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(admin)/reports/${id}` as any);
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setStatusFilter(undefined);
    setCategoryFilter(undefined);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const renderReport = useCallback(({ item }: { item: Report }) => {
    const categoryConfig = REPORT_CATEGORIES[item.category];

    return (
      <Card
        variant="elevated"
        padding="md"
        onPress={() => handleReportPress(item.id)}
        style={styles.reportCard}
      >
        <ReportCard
          title={item.title}
          description={item.description}
          status={item.status as any}
          category={categoryConfig?.icon || 'help'}
          location={item.location.address || 'No location'}
          date={formatDate(item.createdAt)}
        />
        <View style={styles.additionalInfo}>
          {item.priority && (
            <Badge variant="tonal" color={item.priority === 'critical' ? 'error' : item.priority === 'high' ? 'warning' : 'info'}>
              {item.priority}
            </Badge>
          )}
          {item.assigneeId && (
            <Badge variant="tonal" color="info">
              Assigned
            </Badge>
          )}
        </View>
      </Card>
    );
  }, [handleReportPress]);

  const renderSkeleton = useCallback(() => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} variant="elevated" padding="md" style={styles.reportCard}>
          <View style={{ gap: spacing.md }}>
            <Skeleton width="60%" height={20} variant="text" />
            <Skeleton width="100%" height={14} variant="text" />
            <Skeleton width="80%" height={14} variant="text" />
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Skeleton width={60} height={24} variant="rect" />
              <Skeleton width={60} height={24} variant="rect" />
            </View>
          </View>
        </Card>
      ))}
    </View>
  ), []);

  return (
    <AdminLayout
      header={
        <Header title="Reports Management" />
      }
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search reports..."
          />
        </View>

        <ReportFilters
          selectedCategory={categoryFilter}
          selectedStatus={statusFilter}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={renderReport}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                iconName="report"
                title="No reports found"
                description="Try adjusting your search or filters"
              />
            }
          />
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  reportCard: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  additionalInfo: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  skeletonContainer: {
    paddingHorizontal: spacing.lg,
  },
});
