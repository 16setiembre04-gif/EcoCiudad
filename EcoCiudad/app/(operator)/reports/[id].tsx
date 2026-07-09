import { Button } from '@/presentation/components/atoms/button';
import { Card } from '@/presentation/components/atoms/card';
import { CategoryChip } from '@/presentation/components/atoms/category-chip';
import { Icon } from '@/presentation/components/atoms/icon';
import { Input } from '@/presentation/components/atoms/input';
import { PriorityBadge } from '@/presentation/components/atoms/priority-badge';
import { StatusIndicator } from '@/presentation/components/atoms/status-indicator';
import { ThemedText } from '@/presentation/components/atoms/text';
import { ImageGallery } from '@/presentation/components/molecules/image-gallery';
import { Header } from '@/presentation/components/organisms/header';
import { OperatorLayout } from '@/presentation/components/templates/operator-layout';
import { useRejectReport, useReportDetails, useResolveReport } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function OperatorReportDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: report, isLoading } = useReportDetails(id);
  const { mutate: resolveReport, isPending: isResolving } = useResolveReport();
  const { mutate: rejectReport, isPending: isRejecting } = useRejectReport();

  const [notes, setNotes] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(t('common.locale'), {
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
      Alert.alert(t('common.error'), t('common.addResolutionNotes'));
      return;
    }

    resolveReport(
      { reportId: id, notes: notes.trim() },
      {
        onSuccess: () => {
          Alert.alert(t('common.success'), t('common.reportResolvedSuccess'));
          router.back();
        },
        onError: (error) => {
          Alert.alert(t('common.error'), error.message || t('common.failedToResolveReport'));
        },
      }
    );
  }, [id, notes, resolveReport, router, t]);

  const handleReject = useCallback(() => {
    if (!notes.trim()) {
      Alert.alert(t('common.error'), t('common.addRejectionReason'));
      return;
    }

    rejectReport(
      { reportId: id, reason: notes.trim() },
      {
        onSuccess: () => {
          Alert.alert(t('common.success'), t('common.reportRejectedSuccess'));
          router.back();
        },
        onError: (error) => {
          Alert.alert(t('common.error'), error.message || t('common.failedToRejectReport'));
        },
      }
    );
  }, [id, notes, rejectReport, router, t]);

  if (isLoading || !report) {
    return (
      <OperatorLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>{t('common.loadingReportDetails')}</ThemedText>
        </View>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout
      header={
        <Header
          title={t('common.reportDetails')}
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
              {t('common.created')}: {formatDate(report.createdAt)}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {report.location.address || t('common.noAddressProvided')}
            </ThemedText>
          </View>

          <CategoryChip category={report.category} />
        </Card>

        <Card variant="elevated" padding="md" style={styles.section}>
          <ThemedText type="subtitle">{t('common.description')}</ThemedText>
          <ThemedText type="body" color={theme.colors.textSecondary}>
            {report.description}
          </ThemedText>
        </Card>

        {report.images && report.images.length > 0 && (
          <ImageGallery images={report.images} />
        )}

        {report.resolutionNotes && (
          <Card variant="elevated" padding="md" style={styles.section}>
            <ThemedText type="subtitle">{t('common.resolutionNotes')}</ThemedText>
            <ThemedText type="body" color={theme.colors.textSecondary}>
              {report.resolutionNotes}
            </ThemedText>
          </Card>
        )}

        {report.status !== 'resolved' && report.status !== 'rejected' && (
          <View style={styles.actionsContainer}>
            <ThemedText type="subtitle">{t('common.actions')}</ThemedText>

            {!showResolveForm && !showRejectForm && (
              <View style={styles.actionButtons}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={() => setShowResolveForm(true)}
                  iconName="check"
                >
                  {t('common.resolveReport')}
                </Button>
                <Button
                  variant="outlined"
                  size="lg"
                  fullWidth
                  onPress={() => setShowRejectForm(true)}
                  iconName="close"
                >
                  {t('common.rejectReport')}
                </Button>
              </View>
            )}

            {showResolveForm && (
              <View style={styles.formContainer}>
                <Input
                  label={t('common.resolutionNotesRequired')}
                  placeholder={t('common.describeResolutionPlaceholder')}
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
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onPress={handleResolve}
                    loading={isResolving}
                  >
                    {t('common.confirmResolution')}
                  </Button>
                </View>
              </View>
            )}

            {showRejectForm && (
              <View style={styles.formContainer}>
                <Input
                  label={t('common.rejectionReasonRequired')}
                  placeholder={t('common.explainRejectionPlaceholder')}
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
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="md"
                    onPress={handleReject}
                    loading={isRejecting}
                  >
                    {t('common.confirmRejection')}
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
