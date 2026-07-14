import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { ReportList } from '@/presentation/components/organisms/report-list';
import { ReportFilters } from '@/presentation/components/organisms/report-filters';
import { SearchBar } from '@/presentation/components/molecules/search-bar';
import { StatCard } from '@/presentation/components/atoms/stat-card';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Button } from '@/presentation/components/atoms/button';
import { type StatCardProps } from '@/presentation/components/atoms/stat-card/types';
import { useMyReports } from '@/presentation/hooks/use-report-queries.hook';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { type ReportCategory, type ReportStatus } from '@/domain/entities';

export default function ReportHubScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | undefined>();

  const { data: reports, isLoading, isRefetching, refetch, error } = useMyReports({
    category: selectedCategory,
    status: selectedStatus,
    search: searchQuery || undefined,
  });

  const stats = useMemo<StatCardProps[]>(() => {
    const list = reports ?? [];
    const total = list.length;
    const resolved = list.filter((r) => r.status === 'resolved').length;
    const pending = list.filter((r) => r.status === 'pending').length;
    const inReview = list.filter((r) => r.status === 'in_review').length;
    return [
      { label: t('reports.title'), value: total, iconName: 'report', style: styles.statCard },
      { label: t('reports.resolved'), value: resolved, iconName: 'check', color: theme.colors.success, style: styles.statCard },
      { label: t('reports.pending'), value: pending, iconName: 'info', color: theme.colors.warning, style: styles.statCard },
      { label: t('reports.inReview'), value: inReview, iconName: 'search', color: theme.colors.info, style: styles.statCard },
    ];
  }, [reports, t, theme]);

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
          title={t('reports.title')}
          showBackButton={false}
          rightIcon="plus"
          onRightIconPress={handleCreatePress}
        />
      }
    >
      <ScrollView
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
        <Button
          variant="primary"
          size="lg"
          iconName="report"
          onPress={handleCreatePress}
        >
          {t('reports.report')}
        </Button>

        <View style={styles.statsSection}>
          <ThemedText type="headline" style={styles.sectionTitle}>
            {t('reports.summary')}
          </ThemedText>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('reports.searchPlaceholder')}
          />
        </View>

        <ReportFilters
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onClearFilters={handleClearFilters}
        />

        {error ? (
          <View style={styles.errorContainer}>
            <ThemedText color={theme.colors.error}>{error.message || t('common.error')}</ThemedText>
            <Button variant="outlined" onPress={() => refetch()} style={{ marginTop: spacing.md }}>
              {t('common.retry')}
            </Button>
          </View>
        ) : (
          <ReportList
            reports={reports ?? []}
            isLoading={isLoading}
            onReportPress={handleReportPress}
          />
        )}
      </ScrollView>
    </DashboardTemplate>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.lg,
  },
  statsSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
  },
  searchContainer: {
    paddingTop: spacing.md,
  },
  errorContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
