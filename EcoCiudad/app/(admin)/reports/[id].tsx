import { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AdminLayout } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Card } from '@/presentation/components/atoms/card';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Badge } from '@/presentation/components/atoms/badge';
import { Button } from '@/presentation/components/atoms/button';
import { Divider } from '@/presentation/components/atoms/divider';
import { Icon } from '@/presentation/components/atoms/icon';
import { Loader } from '@/presentation/components/atoms/loader';
import { ImageGallery } from '@/presentation/components/molecules/image-gallery';
import {
  useAdminReport,
  useAdminAssignReport,
  useAdminUpdateReportStatus,
  useAdminUpdateReportPriority,
  useAdminUsers,
} from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import {
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  ADMIN_REPORT_PRIORITY_CONFIG,
} from '@/constants';
import { type ReportStatus, type ReportPriority, type UserRole } from '@/domain/entities';

export default function AdminReportDetailScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: report, isLoading, refetch } = useAdminReport(id ?? '');
  const { data: operators } = useAdminUsers({ role: 'operator' as UserRole });

  const assignMutation = useAdminAssignReport();
  const statusMutation = useAdminUpdateReportStatus();
  const priorityMutation = useAdminUpdateReportPriority();

  const [showOperatorSelector, setShowOperatorSelector] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [showPrioritySelector, setShowPrioritySelector] = useState(false);

  const handleAssignOperator = useCallback(async (operatorId: string) => {
    if (!id) return;
    try {
      await assignMutation.mutateAsync({ reportId: id, operatorId });
      await refetch();
      setShowOperatorSelector(false);
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToAssignOperator'));
    }
  }, [id, assignMutation, refetch, t]);

  const handleUpdateStatus = useCallback(async (status: ReportStatus) => {
    if (!id) return;
    Alert.alert(
      t('common.updateStatus'),
      `${t('common.confirmChangeStatusTo')} ${t(REPORT_STATUSES[status]?.labelKey as any) || status}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.update'),
          onPress: async () => {
            try {
              await statusMutation.mutateAsync({ reportId: id, status });
              await refetch();
              setShowStatusSelector(false);
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.failedToUpdateStatus'));
            }
          },
        },
      ]
    );
  }, [id, statusMutation, refetch, t]);

  const handleUpdatePriority = useCallback(async (priority: ReportPriority) => {
    if (!id) return;
    try {
      await priorityMutation.mutateAsync({ reportId: id, priority });
      await refetch();
      setShowPrioritySelector(false);
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToUpdatePriority'));
    }
  }, [id, priorityMutation, refetch, t]);

  const handleOpenInMaps = useCallback(async () => {
    if (!report?.location) return;
    const { latitude, longitude } = report.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('common.error'), t('common.failedToOpenMaps'));
    }
  }, [report, t]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(t('common.locale'), {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Loader size="lg" />
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout
        header={<Header title={t('common.reportDetails')} showBackButton />}
      >
        <View style={styles.errorContainer}>
          <ThemedText color={theme.colors.error}>{t('reports.loadingReport')}</ThemedText>
          <Button variant="outlined" onPress={() => refetch()} style={{ marginTop: spacing.md }}>
            {t('common.retry')}
          </Button>
        </View>
      </AdminLayout>
    );
  }

  const categoryConfig = REPORT_CATEGORIES[report.category];
  const statusConfig = REPORT_STATUSES[report.status];
  const priorityConfig = ADMIN_REPORT_PRIORITY_CONFIG[report.priority || 'medium'];

  return (
    <AdminLayout
      header={
        <Header title={t('common.reportDetails')} showBackButton />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Report Info Card */}
        <Card variant="elevated" padding="lg" style={styles.infoCard}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="title" style={{ fontWeight: '700' }}>
                {report.title}
              </ThemedText>
              <View style={styles.badgeRow}>
                <Badge variant="tonal" color={statusConfig?.color || 'info'}>
                  {statusConfig ? t(statusConfig.labelKey) : report.status}
                </Badge>
                {report.priority && (
                  <Badge variant="tonal" color={priorityConfig.color === '#22C55E' ? 'success' : priorityConfig.color === '#F59E0B' ? 'warning' : priorityConfig.color === '#F97316' ? 'error' : 'error'}>
                    {t(priorityConfig.labelKey)}
                  </Badge>
                )}
              </View>
            </View>
          </View>

          <Divider orientation="horizontal" />

          <ThemedText type="body" color={theme.colors.textSecondary}>
            {report.description}
          </ThemedText>

          {/* Category */}
          <View style={styles.detailRow}>
            <Icon name={categoryConfig?.icon || 'help'} size={20} color={theme.colors.primary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('reports.category')}: {categoryConfig ? t(categoryConfig.labelKey) : report.category}
            </ThemedText>
          </View>

          {/* Location */}
          {report.location && (
            <View style={styles.detailRow}>
              <Icon name="location" size={20} color={theme.colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {report.location.address || t('common.noAddress')}
                </ThemedText>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleOpenInMaps}
                  style={{ marginTop: spacing.xs }}
                >
                  {t('common.openInMaps')}
                </Button>
              </View>
            </View>
          )}

          {/* Reporter */}
          <View style={styles.detailRow}>
            <Icon name="user" size={20} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.reporter')}: {report.isAnonymous ? t('common.anonymous') : report.reporterId}
            </ThemedText>
          </View>

          {/* Assignee */}
          {report.assigneeId && (
            <View style={styles.detailRow}>
              <Icon name="truck" size={20} color={theme.colors.secondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {t('common.assignedTo')}: {report.assigneeId}
              </ThemedText>
            </View>
          )}

          {/* Dates */}
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.created')}: {formatDate(report.createdAt)}
            </ThemedText>
          </View>

          {report.resolvedAt && (
            <View style={styles.detailRow}>
              <Icon name="check" size={20} color={theme.colors.success} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                {t('common.resolved')}: {formatDate(report.resolvedAt)}
              </ThemedText>
            </View>
          )}
        </Card>

        {/* Images */}
        {report.images && report.images.length > 0 && (
          <Card variant="elevated" padding="lg" style={styles.imagesCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.images')} ({report.images.length})
            </ThemedText>
            <ImageGallery images={report.images} />
          </Card>
        )}

        {/* Resolution Notes */}
        {report.resolutionNotes && (
          <Card variant="elevated" padding="lg" style={styles.notesCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.resolutionNotes')}
            </ThemedText>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {report.resolutionNotes}
            </ThemedText>
          </Card>
        )}

        {/* Admin Actions */}
        <Card variant="elevated" padding="lg" style={styles.actionsCard}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            {t('common.adminActions')}
          </ThemedText>

          {/* Assign Operator */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.assignOperator')}
            </ThemedText>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowOperatorSelector(true)}
              loading={assignMutation.isPending}
            >
              {report.assigneeId ? t('common.reassignOperator') : t('common.assignOperator')}
            </Button>
          </View>

          <Divider orientation="horizontal" />

          {/* Update Status */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.updateStatus')}
            </ThemedText>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowStatusSelector(true)}
              loading={statusMutation.isPending}
            >
              {t('common.changeStatus')}
            </Button>
          </View>

          <Divider orientation="horizontal" />

          {/* Update Priority */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {t('common.updatePriority')}
            </ThemedText>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowPrioritySelector(true)}
              loading={priorityMutation.isPending}
            >
              {t('common.changePriority')}
            </Button>
          </View>
        </Card>

        {/* Operator Selector Modal */}
        {showOperatorSelector && operators && (
          <Card variant="elevated" padding="lg" style={styles.selectorCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.selectOperator')}
            </ThemedText>
            {operators.map((operator) => (
              <Button
                key={operator.id}
                variant="ghost"
                size="md"
                onPress={() => handleAssignOperator(operator.id)}
                style={{ marginBottom: spacing.sm }}
              >
                {operator.displayName}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowOperatorSelector(false)}
            >
              {t('common.cancel')}
            </Button>
          </Card>
        )}

        {/* Status Selector Modal */}
        {showStatusSelector && (
          <Card variant="elevated" padding="lg" style={styles.selectorCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.selectStatus')}
            </ThemedText>
            {Object.entries(REPORT_STATUSES).map(([status, config]) => (
              <Button
                key={status}
                variant="ghost"
                size="md"
                onPress={() => handleUpdateStatus(status as ReportStatus)}
                style={{ marginBottom: spacing.sm }}
                disabled={report.status === status}
              >
                {t(config.labelKey as any)}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowStatusSelector(false)}
            >
              {t('common.cancel')}
            </Button>
          </Card>
        )}

        {/* Priority Selector Modal */}
        {showPrioritySelector && (
          <Card variant="elevated" padding="lg" style={styles.selectorCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              {t('common.selectPriority')}
            </ThemedText>
            {Object.entries(ADMIN_REPORT_PRIORITY_CONFIG).map(([priority, config]) => (
              <Button
                key={priority}
                variant="ghost"
                size="md"
                onPress={() => handleUpdatePriority(priority as ReportPriority)}
                style={{ marginBottom: spacing.sm }}
                disabled={report.priority === priority}
              >
                {t(config.labelKey)}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowPrioritySelector(false)}
            >
              {t('common.cancel')}
            </Button>
          </Card>
        )}
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  infoCard: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  imagesCard: {
    gap: spacing.md,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesCard: {
    gap: spacing.md,
  },
  actionsCard: {
    gap: spacing.md,
  },
  actionSection: {
    gap: spacing.md,
  },
  selectorCard: {
    gap: spacing.md,
  },
});
