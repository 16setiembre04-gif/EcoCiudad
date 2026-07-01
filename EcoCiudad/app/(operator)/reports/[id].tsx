import { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { Header } from '@/components/organisms/header';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { PriorityBadge } from '@/components/atoms/priority-badge';
import { StatusIndicator } from '@/components/atoms/status-indicator';
import { CategoryChip } from '@/components/atoms/category-chip';
import { ImageGallery } from '@/components/molecules/image-gallery';
import { useReportDetails, useResolveReport, useRejectReport, useUpdateReportStatus } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { type ReportStatus } from '@/domain/entities';

export default function OperatorReportDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: report, isLoading } = useReportDetails(id);
  const { mutate: resolveReport, isPending: isResolving } = useResolveReport();
  const { mutate: rejectReport, isPending: isRejecting } = useRejectReport();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateReportStatus();

  const [notes, setNotes] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleResolve = useCallback(() => {
    if (!notes.trim()) {
      Alert.alert('Error', 'Please add resolution notes');
      return;
    }

    resolveReport(
      { reportId: id, notes: notes.trim() },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Report resolved successfully');
          router.back();
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to resolve report');
        },
      }
    );
  }, [id, notes, resolveReport, router]);

  const handleReject = useCallback(() => {
    if (!notes.trim()) {
      Alert.alert('Error', 'Please add rejection reason');
      return;
    }

    rejectReport(
      { reportId: id, reason: notes.trim() },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Report rejected successfully');
          router.back();
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to reject report');
        },
      }
    );
  }, [id, notes, rejectReport, router]);

  const handleStatusChange = useCallback((status: ReportStatus) => {
    updateStatus(
      { reportId: id, status },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Status updated successfully');
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to update status');
        },
      }
    );
  }, [id, updateStatus]);

  if (isLoading || !report) {
    return (
      <OperatorLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading report details...</ThemedText>
        </View>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout
      header={
        <Header
          title="Report Details"
          onBackPress={() => router.back()}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" padding="md" style={styles.section}>
          <View style={styles.headerRow}>
            <ThemedText type="headline">{report.title}</ThemedText>
            <View style={styles.badges}>
              {report.priority && <PriorityBadge priority={report.priority} />}
              <StatusIndicator status={report.status} />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              Created: {formatDate(report.createdAt)}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {report.location.address || 'No address provided'}
            </ThemedText>
          </View>

          <CategoryChip category={report.category} />
        </Card>

        <Card variant="elevated" padding="md" style={styles.section}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText type="body" color={theme.colors.textSecondary}>
            {report.description}
          </ThemedText>
        </Card>

        {report.images && report.images.length > 0 && (
          <ImageGallery images={report.images} />
        )}

        {report.resolutionNotes && (
          <Card variant="elevated" padding="md" style={styles.section}>
            <ThemedText type="subtitle">Resolution Notes</ThemedText>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {report.resolutionNotes}
            </ThemedText>
          </Card>
        )}

        {report.status !== 'resolved' && report.status !== 'rejected' && (
          <View style={styles.actionsContainer}>
            <ThemedText type="subtitle">Actions</ThemedText>

            {!showResolveForm && !showRejectForm && (
              <View style={styles.actionButtons}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={() => setShowResolveForm(true)}
                  iconName="check"
                >
                  Resolve Report
                </Button>
                <Button
                  variant="outlined"
                  size="lg"
                  fullWidth
                  onPress={() => setShowRejectForm(true)}
                  iconName="close"
                >
                  Reject Report
                </Button>
              </View>
            )}

            {showResolveForm && (
              <View style={styles.formContainer}>
                <Input
                  label="Resolution Notes *"
                  placeholder="Describe how you resolved this issue..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
                <View style={styles.formButtons}>
                  <Button
                    variant="outlined"
                    size="md"
                    onPress={() => {
                      setShowResolveForm(false);
                      setNotes('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onPress={handleResolve}
                    loading={isResolving}
                  >
                    Confirm Resolution
                  </Button>
                </View>
              </View>
            )}

            {showRejectForm && (
              <View style={styles.formContainer}>
                <Input
                  label="Rejection Reason *"
                  placeholder="Explain why this report is being rejected..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
                <View style={styles.formButtons}>
                  <Button
                    variant="outlined"
                    size="md"
                    onPress={() => {
                      setShowRejectForm(false);
                      setNotes('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="md"
                    onPress={handleReject}
                    loading={isRejecting}
                  >
                    Confirm Rejection
                  </Button>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </OperatorLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    gap: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionsContainer: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButtons: {
    gap: spacing.md,
  },
  formContainer: {
    gap: spacing.md,
  },
  formButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
