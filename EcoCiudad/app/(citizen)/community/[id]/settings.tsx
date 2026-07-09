import { useState, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
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
import { useTranslation } from '@/localization';
import { CommunityPrivacy } from '@/domain/entities/community';

export default function CommunitySettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
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
      Alert.alert(t('common.error'), t('errors.failedToUpdateRules'));
    }
  }, [id, rulesText, updateMutation, t]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      router.replace('/(citizen)/(tabs)/community' as any);
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.failedToDeleteCommunity'));
    }
  }, [id, deleteMutation, router, t]);

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
        <Header title={t('common.settings')} showBackButton />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="elevated" padding="lg" style={styles.section}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            {t('common.privacy')}
          </ThemedText>
          <ThemedText type="body" color={theme.colors.textSecondary}>
            {t('common.thisCommunityIs')} {community.privacy === CommunityPrivacy.PUBLIC ? t('common.public').toLowerCase() : t('common.private').toLowerCase()}
          </ThemedText>
        </Card>

        <Card variant="elevated" padding="lg" style={styles.section}>
          <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
            {t('common.rules')}
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.rulesHint')}
          </ThemedText>
          <Input
            value={rulesText}
            onChangeText={setRulesText}
            placeholder={t('common.rulesPlaceholder')}
            multiline
            numberOfLines={5}
          />
          <Button
            variant="primary"
            size="md"
            onPress={handleSaveRules}
            loading={updateMutation.isPending}
          >
            {t('common.saveRules')}
          </Button>
        </Card>

        <Card variant="elevated" padding="lg" style={styles.section}>
          <ThemedText type="subtitle" style={{ fontWeight: '600', color: theme.colors.error }}>
            {t('common.dangerZone')}
          </ThemedText>
          <ThemedText type="bodySmall" color={theme.colors.textSecondary}>
            {t('common.deleteCommunityWarning')}
          </ThemedText>
          <Button
            variant="destructive"
            size="md"
            onPress={handleDelete}
            loading={deleteMutation.isPending}
          >
            {t('common.deleteCommunity')}
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
