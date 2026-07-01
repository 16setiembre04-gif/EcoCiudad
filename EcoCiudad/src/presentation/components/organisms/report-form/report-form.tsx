import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { FormField } from '@/components/molecules/form-field';
import { Button } from '@/components/atoms/button';
import { ThemedText } from '@/components/atoms/text';
import { Chip } from '@/components/atoms/chip';
import { Divider } from '@/components/atoms/divider';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';
import { ReportFormProps, ReportFormData } from './types';

const defaultCategories = [
  { value: 'waste', label: 'Waste', icon: 'recycle' as const },
  { value: 'pollution', label: 'Pollution', icon: 'water' as const },
  { value: 'green_space', label: 'Green Space', icon: 'tree' as const },
  { value: 'noise', label: 'Noise', icon: 'noise' as const },
  { value: 'other', label: 'Other', icon: 'help' as const },
];

export function ReportForm({
  onSubmit,
  onCancel,
  isLoading = false,
  categories = defaultCategories,
  containerStyle,
  testID,
}: ReportFormProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    images: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReportFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ReportFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: theme.colors.background }, containerStyle]}
      contentContainerStyle={{ padding: spacing.lg }}
      testID={testID}
    >
      <View style={{ gap: spacing.lg }}>
        <FormField
          label="Title"
          placeholder="Enter report title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          error={errors.title}
          required
          icon="edit"
        />

        <FormField
          label="Description"
          placeholder="Describe the issue in detail"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          error={errors.description}
          required
          multiline
          numberOfLines={4}
          icon="message"
        />

        <View style={{ gap: spacing.sm }}>
          <ThemedText type="body" style={{ fontWeight: '600' }}>
            Category *
          </ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {categories.map((cat) => (
              <Chip
                key={cat.value}
                variant={formData.category === cat.value ? 'filled' : 'outlined'}
                iconName={cat.icon}
                onPress={() => {
                  setFormData({ ...formData, category: cat.value });
                  setErrors({ ...errors, category: undefined });
                }}
              >
                {cat.label}
              </Chip>
            ))}
          </View>
          {errors.category && (
            <ThemedText type="bodySmall" color={theme.colors.error}>
              {errors.category}
            </ThemedText>
          )}
        </View>

        <FormField
          label="Location"
          placeholder="Enter location or use GPS"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
          error={errors.location}
          required
          icon="location"
          rightIcon="map"
        />

        <Divider orientation="horizontal" />

        <View style={{ gap: spacing.md }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            iconName="send"
          >
            Submit Report
          </Button>
          {onCancel && (
            <Button
              variant="outlined"
              size="lg"
              fullWidth
              onPress={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
