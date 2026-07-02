import { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CommunityTemplate } from '@/presentation/components/templates';
import { Header } from '@/presentation/components/organisms/header';
import { Input } from '@/presentation/components/atoms/input';
import { Button } from '@/presentation/components/atoms/button';
import { ThemedText } from '@/presentation/components/atoms/text';
import { Card } from '@/presentation/components/atoms/card';
import { Chip } from '@/presentation/components/atoms/chip';
import { useCreateCommunity } from '@/presentation/hooks';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { COMMUNITY_CATEGORIES } from '@/constants';
import { CommunityCategory, CommunityPrivacy } from '@/domain/entities/community';

export default function CreateCommunityScreen() {
  const theme = useTheme();
  const router = useRouter();
  const createMutation = useCreateCommunity();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>(CommunityCategory.ENVIRONMENTAL);
  const [privacy, setPrivacy] = useState<CommunityPrivacy>(CommunityPrivacy.PUBLIC);
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!validate()) return;

    const rules = rulesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .slice(0, 10);

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        category,
        privacy,
        location: department && district ? { department: department.trim(), district: district.trim() } : undefined,
        rules: rules.length > 0 ? rules : undefined,
        ownerId: '',
      });
      router.replace('/(citizen)/community/my-communities' as any);
    } catch (error) {
      console.error('Failed to create community:', error);
    }
  }, [validate, name, description, category, privacy, department, district, rulesText, createMutation, router]);

  return (
    <CommunityTemplate
      header={
        <Header title="Create Community" showBackButton />
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
              Location (Optional)
            </ThemedText>
            <Input
              label="Department"
              value={department}
              onChangeText={setDepartment}
              placeholder="Your department"
            />
            <Input
              label="District"
              value={district}
              onChangeText={setDistrict}
              placeholder="Your district"
            />
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={{ fontWeight: '600' }}>
              Rules (Optional)
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
            loading={createMutation.isPending}
          >
            Create Community
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
