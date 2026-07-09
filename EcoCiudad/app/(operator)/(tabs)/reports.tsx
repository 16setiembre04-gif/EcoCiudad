import { REPORT_CATEGORIES } from '@/constants/report.constants';
import { type ReportStatus } from '@/domain/entities';
import { Chip } from '@/presentation/components/atoms/chip';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Button } from '@/presentation/components/atoms/button';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { AssignedReportsList } from '@/presentation/components/organisms/assigned-reports-list';
import { Header } from '@/presentation/components/organisms/header';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useAssignedReports } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

type StatusFilter = 'all' | ReportStatus;

export default function OperatorReportsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const { data: reports, isLoading, refetch, isRefetching, error } = useAssignedReports({
    status: statusFilter === 'all' ? undefined : statusFilter,
    category: categoryFilter,
    search: searchQuery || undefined,
  });

  const handleReportPress = useCallback((id: string) => {
    router.push(`/(operator)/reports/${id}`);
  }, [router]);

  const formatStatusLabel = (status: StatusFilter) => {
    if (status === 'all') return t('common.all');
    return t(`reportStatuses.${status}`);
  };

  return (
    <OperatorLayout
      header={
        <Header
          title={t('common.assignedReports')}
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
            placeholder={t('common.searchReports')}
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
                {formatStatusLabel(status)}
              </Chip>
            ))}
          </View>

          <View style={styles.filterRow}>
            <Chip
              variant={!categoryFilter ? 'filled' : 'tonal'}
              size="sm"
              onPress={() => setCategoryFilter(undefined)}
            >
              {t('common.allCategories')}
            </Chip>
            {Object.entries(REPORT_CATEGORIES).map(([key, config]) => (
              <Chip
                key={key}
                variant={categoryFilter === key ? 'filled' : 'tonal'}
                size="sm"
                iconName={config.icon}
                onPress={() => setCategoryFilter(key)}
              >
                {t(config.labelKey)}
              </Chip>
            ))}
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <ThemedText color={theme.colors.error}>{error.message || t('common.error')}</ThemedText>
            <Button variant="outlined" onPress={() => refetch()} style={{ marginTop: spacing.md }}>
              {t('common.retry')}
            </Button>
          </View>
        ) : (
          <AssignedReportsList
            reports={reports ?? []}
            isLoading={isLoading}
            onReportPress={handleReportPress}
            title={t('common.reports')}
            horizontal={false}
          />
        )}
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
  errorContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
