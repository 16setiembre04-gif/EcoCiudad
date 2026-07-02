import { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Input } from '@/presentation/components/atoms/input';
import { Button } from '@/presentation/components/atoms/button';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Card } from '@/presentation/components/atoms/card';
import { Chip } from '@/presentation/components/atoms/chip';
import { Loader } from '@/presentation/components/atoms/loader';
import { useCommunity, useUpdateCommunity } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { COMMUNITY_CATEGORIES } from '@/constants';
import { CommunityCategory, CommunityPrivacy } from '@/domain/entities/community';

export default function EditCommunityScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: community, isLoading } = useCommunity(id ?? '');
  const updateMutation = useUpdateCommunity();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>(CommunityCategory.ENVIRONMENTAL);
  const [privacy, setPrivacy] = useState<CommunityPrivacy>(CommunityPrivacy.PUBLIC);
  const [rulesText, setRulesText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description);
      setCategory(community.category);
      setPrivacy(community.privacy);
      setRulesText(community.rules?.join('\n') ?? '');
    }
  }, [community]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (name.length > 100) newErrors.name = 'Name must be less than 100 characters';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (description.length > 500) newErrors.description = 'Description must be less than 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, description]);

  const handleSubmit = useCallback(async () => {
    if (!validate() || !id) return;

    const rules = rulesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .slice(0, 10);

    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: name.trim(),
          description: description.trim(),
          category,
          privacy,
          rules: rules.length > 0 ? rules : undefined,
        },
      });
      router.back();
    } catch (error) {
      console.error('Failed to update community:', error);
    }
  }, [validate, id, name, description, category, privacy, rulesText, updateMutation, router]);

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
        <Header title="Edit Community" showBackButton />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card variant="elevated" padding="lg" style={styles.formCard}>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Community name"
            errorText={errors.name}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What is this community about?"
            errorText={errors.description}
            multiline
            numberOfLines={4}
          />

          <View style={styles.section}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Category
            </ThemedText>
            <View style={styles.chipRow}>
              {Object.entries(COMMUNITY_CATEGORIES).map(([key, config]) => (
                <Chip
                  key={key}
                  selected={category === key}
                  onPress={() => setCategory(key as CommunityCategory)}
                  iconName={config.icon}
                >
                  {config.label}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Privacy
            </ThemedText>
            <View style={styles.privacyRow}>
              <Button
                variant={privacy === CommunityPrivacy.PUBLIC ? 'primary' : 'outlined'}
                size="md"
                onPress={() => setPrivacy(CommunityPrivacy.PUBLIC)}
                style={{ flex: 1 }}
              >
                Public
              </Button>
              <Button
                variant={privacy === CommunityPrivacy.PRIVATE ? 'primary' : 'outlined'}
                size="md"
                onPress={() => setPrivacy(CommunityPrivacy.PRIVATE)}
                style={{ flex: 1 }}
              >
                Private
              </Button>
            </View>
          </View>

          <View style={styles.section}>
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
          </View>

          <Button
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            loading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </Card>
      </ScrollView>
    </CommunityTemplate>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  formCard: {
    margin: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  privacyRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
