import { Button } from '@/presentation/components/atoms/button';
import { CategoryChip } from '@/presentation/components/atoms/category-chip';
import { Icon } from '@/presentation/components/atoms/icon';
import { SeverityBadge } from '@/presentation/components/atoms/severity-badge';
import { StatusBadge } from '@/presentation/components/atoms/status-badge';
import { ThemedText } from '@/presentation/components/atoms/text';
import { ImageGallery } from '@/presentation/components/molecules/image-gallery';
import { StatusTimeline } from '@/presentation/components/molecules/status-timeline';
import { Header } from '@/presentation/components/organisms/header';
import { DashboardTemplate } from '@/presentation/components/templates';
import { useAddReportComment, useReport, useReportComments, useReportTimeline } from '@/presentation/hooks';
import { useAuthStore } from '@/presentation/stores';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReportDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);

  const { data: report, isLoading } = useReport(id);
  const { data: comments } = useReportComments(id);
  const { data: timeline } = useReportTimeline(id);
  const { mutate: addComment, isPending: isAddingComment } = useAddReportComment();

  const [newComment, setNewComment] = useState('');

  const handleShare = useCallback(async () => {
    if (!report) return;
    try {
      await Share.share({
        message: `Check out this report: ${report.title}\n${report.description}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share report');
    }
  }, [report]);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !user || !id) return;

    addComment(
      {
        reportId: id,
        authorId: user.id,
        authorName: user.displayName,
        content: newComment.trim(),
      },
      {
        onSuccess: () => {
          setNewComment('');
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to add comment');
        },
      }
    );
  }, [newComment, user, id, addComment]);

  if (isLoading || !report) {
    return (
      <DashboardTemplate
        header={<Header title="Report Detail" onBackPress={() => router.back()} />}
      >
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      header={
        <Header
          title="Report Detail"
          onBackPress={() => router.back()}
          rightIcon="share"
          onRightIconPress={handleShare}
        />
      }
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeIn} style={styles.container}>
          <View style={styles.headerRow}>
            <StatusBadge status={report.status} />
            {report.severity && <SeverityBadge severity={report.severity} />}
          </View>

          <ThemedText type="title">{report.title}</ThemedText>
          <ThemedText type="body" color={theme.colors.textSecondary}>
            {report.description}
          </ThemedText>

          <View style={styles.infoRow}>
            <CategoryChip category={report.category} />
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              {formatDate(report.createdAt)}
            </ThemedText>
          </View>

          {report.images.length > 0 && (
            <ImageGallery images={report.images} />
          )}

          <View style={styles.locationContainer}>
            <Icon name="location" size={16} color={theme.colors.textSecondary} />
            <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
              {report.location.address ?? 'Location not available'}
            </ThemedText>
          </View>

          {timeline && timeline.length > 0 && (
            <StatusTimeline entries={timeline} currentStatus={report.status} />
          )}

          <View style={styles.commentsSection}>
            <ThemedText type="subtitle">Comments</ThemedText>

            {comments && comments.length > 0 ? (
              <View style={styles.commentsList}>
                {comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <ThemedText type="bodySmall" style={{ fontWeight: '600' }}>
                        {comment.authorName}
                      </ThemedText>
                      <ThemedText type="caption" color={theme.colors.textSecondary}>
                        {formatDate(comment.createdAt)}
                      </ThemedText>
                    </View>
                    <ThemedText type="bodySmall">{comment.content}</ThemedText>
                  </View>
                ))}
              </View>
            ) : (
              <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
                No comments yet
              </ThemedText>
            )}

            {user && (
              <View style={styles.commentInput}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    },
                  ]}
                  placeholder="Add a comment..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <Button
                  variant="primary"
                  size="sm"
                  onPress={handleAddComment}
                  loading={isAddingComment}
                  disabled={!newComment.trim()}
                >
                  Post
                </Button>
              </View>
            )}
          </View>
        </Animated.View>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  commentsSection: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  commentsList: {
    gap: spacing.md,
  },
  commentItem: {
    padding: spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentInput: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    fontSize: 14,
  },
});
