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
import {
  useAdminReport,
  useAdminAssignReport,
  useAdminUpdateReportStatus,
  useAdminUpdateReportPriority,
  useAdminUsers,
} from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import {
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  ADMIN_REPORT_PRIORITY_CONFIG,
} from '@/constants';
import { type ReportStatus, type ReportPriority, type UserRole } from '@/domain/entities';

export default function AdminReportDetailScreen() {
  const theme = useTheme();
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
      console.error('Failed to assign operator:', error);
    }
  }, [id, assignMutation, refetch]);

  const handleUpdateStatus = useCallback(async (status: ReportStatus) => {
    if (!id) return;
    Alert.alert(
      'Update Status',
      `Are you sure you want to change the status to ${REPORT_STATUSES[status]?.label || status}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            try {
              await statusMutation.mutateAsync({ reportId: id, status });
              await refetch();
              setShowStatusSelector(false);
            } catch (error) {
              console.error('Failed to update status:', error);
            }
          },
        },
      ]
    );
  }, [id, statusMutation, refetch]);

  const handleUpdatePriority = useCallback(async (priority: ReportPriority) => {
    if (!id) return;
    try {
      await priorityMutation.mutateAsync({ reportId: id, priority });
      await refetch();
      setShowPrioritySelector(false);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  }, [id, priorityMutation, refetch]);

  const handleOpenInMaps = useCallback(() => {
    if (!report?.location) return;
    const { latitude, longitude } = report.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  }, [report]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading || !report) {
    return (
      <AdminLayout>
        <Loader size="lg" />
      </AdminLayout>
    );
  }

  const categoryConfig = REPORT_CATEGORIES[report.category];
  const statusConfig = REPORT_STATUSES[report.status];
  const priorityConfig = ADMIN_REPORT_PRIORITY_CONFIG[report.priority || 'medium'];

  return (
    <AdminLayout
      header={
        <Header title="Report Details" showBackButton />
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
                  {statusConfig?.label || report.status}
                </Badge>
                {report.priority && (
                  <Badge variant="tonal" color={priorityConfig.color === '#22C55E' ? 'success' : priorityConfig.color === '#F59E0B' ? 'warning' : priorityConfig.color === '#F97316' ? 'error' : 'error'}>
                    {priorityConfig.label}
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
              Category: {categoryConfig?.label || report.category}
            </ThemedText>
          </View>

          {/* Location */}
          {report.location && (
            <View style={styles.detailRow}>
              <Icon name="location" size={20} color={theme.colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                  {report.location.address || 'No address'}
                </ThemedText>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleOpenInMaps}
                  style={{ marginTop: spacing.xs }}
                >
                  Open in Maps
                </Button>
              </View>
            </View>
          )}

          {/* Reporter */}
          <View style={styles.detailRow}>
            <Icon name="user" size={20} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Reporter: {report.isAnonymous ? 'Anonymous' : report.reporterId}
            </ThemedText>
          </View>

          {/* Assignee */}
          {report.assigneeId && (
            <View style={styles.detailRow}>
              <Icon name="truck" size={20} color={theme.colors.secondary} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Assigned to: {report.assigneeId}
              </ThemedText>
            </View>
          )}

          {/* Dates */}
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Created: {formatDate(report.createdAt)}
            </ThemedText>
          </View>

          {report.resolvedAt && (
            <View style={styles.detailRow}>
              <Icon name="check" size={20} color={theme.colors.success} />
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                Resolved: {formatDate(report.resolvedAt)}
              </ThemedText>
            </View>
          )}
        </Card>

        {/* Images */}
        {report.images && report.images.length > 0 && (
          <Card variant="elevated" padding="lg" style={styles.imagesCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Images ({report.images.length})
            </ThemedText>
            <View style={styles.imagesGrid}>
              {report.images.map((_image, index) => (
                <View key={index} style={styles.imagePlaceholder}>
                  <Icon name="image" size={32} color={theme.colors.textSecondary} />
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Resolution Notes */}
        {report.resolutionNotes && (
          <Card variant="elevated" padding="lg" style={styles.notesCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Resolution Notes
            </ThemedText>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {report.resolutionNotes}
            </ThemedText>
          </Card>
        )}

        {/* Admin Actions */}
        <Card variant="elevated" padding="lg" style={styles.actionsCard}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            Admin Actions
          </ThemedText>

          {/* Assign Operator */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Assign Operator
            </ThemedText>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowOperatorSelector(true)}
              loading={assignMutation.isPending}
            >
              {report.assigneeId ? 'Reassign Operator' : 'Assign Operator'}
            </Button>
          </View>

          <Divider orientation="horizontal" />

          {/* Update Status */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Update Status
            </ThemedText>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowStatusSelector(true)}
              loading={statusMutation.isPending}
            >
              Change Status
            </Button>
          </View>

          <Divider orientation="horizontal" />

          {/* Update Priority */}
          <View style={styles.actionSection}>
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Update Priority
            </ThemedText>
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowPrioritySelector(true)}
              loading={priorityMutation.isPending}
            >
              Change Priority
            </Button>
          </View>
        </Card>

        {/* Operator Selector Modal */}
        {showOperatorSelector && operators && (
          <Card variant="elevated" padding="lg" style={styles.selectorCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Select Operator
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
              Cancel
            </Button>
          </Card>
        )}

        {/* Status Selector Modal */}
        {showStatusSelector && (
          <Card variant="elevated" padding="lg" style={styles.selectorCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Select Status
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
                {config.label}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowStatusSelector(false)}
            >
              Cancel
            </Button>
          </Card>
        )}

        {/* Priority Selector Modal */}
        {showPrioritySelector && (
          <Card variant="elevated" padding="lg" style={styles.selectorCard}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Select Priority
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
                {config.label}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="md"
              onPress={() => setShowPrioritySelector(false)}
            >
              Cancel
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
    gap: spacing.lg,
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
