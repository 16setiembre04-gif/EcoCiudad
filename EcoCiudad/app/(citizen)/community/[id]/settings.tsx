import { useState, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Input } from '@/presentation/components/atoms/input';
import { Button } from '@/presentation/components/atoms/button';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Card } from '@/presentation/components/atoms/card';
import { Loader } from '@/presentation/components/atoms/loader';
import { useCommunity, useUpdateCommunity, useDeleteCommunity } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { CommunityPrivacy } from '@/domain/entities/community';

export default function CommunitySettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: community, isLoading } = useCommunity(id ?? '');
  const updateMutation = useUpdateCommunity();
  const deleteMutation = useDeleteCommunity();

  const [rulesText, setRulesText] = useState('');

  useEffect(() => {
    if (community) {
      setRulesText(community.rules?.join('\n') ?? '');
    }
  }, [community]);

  const handleSaveRules = useCallback(async () => {
    if (!id) return;

    const rules = rulesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .slice(0, 10);

    try {
      await updateMutation.mutateAsync({
        id,
        data: { rules: rules.length > 0 ? rules : undefined },
      });
    } catch (error) {
      console.error('Failed to update rules:', error);
    }
  }, [id, rulesText, updateMutation]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      router.replace('/(citizen)/(tabs)/community' as any);
    } catch (error) {
      console.error('Failed to delete community:', error);
    }
  }, [id, deleteMutation, router]);

  if (isLoading || !community) {
    return (
      <CommunityTemplate>
        <Loader size="lg" />
      </CommunityTemplate>
    );
  }

  return (
    <CommunityTemplate
      header={
        <Header title="Settings" showBackButton />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" padding="lg" style={styles.section}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            Privacy
          </ThemedText>
          <ThemedText type="body" color={theme.colors.textSecondary}>
            This community is {community.privacy === CommunityPrivacy.PUBLIC ? 'Public' : 'Private'}
          </ThemedText>
        </Card>

        <Card variant="elevated" padding="lg" style={styles.section}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            Rules
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            One rule per line (max 10)
          </ThemedText>
          <Input
            value={rulesText}
            onChangeText={setRulesText}
            placeholder="Rule 1&#10;Rule 2&#10;Rule 3"
            multiline
            numberOfLines={5}
          />
          <Button
            variant="primary"
            size="md"
            onPress={handleSaveRules}
            loading={updateMutation.isPending}
          >
            Save Rules
          </Button>
        </Card>

        <Card variant="elevated" padding="lg" style={styles.section}>
          <ThemedText type="subtitle" style={{ fontWeight: '600', color: theme.colors.error }}>
            Danger Zone
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            Deleting a community is permanent and cannot be undone
          </ThemedText>
          <Button
            variant="destructive"
            size="md"
            onPress={handleDelete}
            loading={deleteMutation.isPending}
          >
            Delete Community
          </Button>
        </Card>
      </ScrollView>
    </CommunityTemplate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
});
