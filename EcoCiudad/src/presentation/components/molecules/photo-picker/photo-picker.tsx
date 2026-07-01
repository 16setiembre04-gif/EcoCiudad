import { View, Pressable, StyleSheet } from 'react-native';
import { ImageThumbnail } from '@/components/atoms/image-thumbnail';
import { Icon } from '@/components/atoms/icon';
import { ThemedText } from '@/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { borderRadius } from '@/theme/radius';
import { IMAGE_UPLOAD_CONFIG } from '@/constants/report.constants';
import { type PhotoPickerProps } from './types';

export function PhotoPicker({
  images,
  onAddImage,
  onRemoveImage,
  maxImages = IMAGE_UPLOAD_CONFIG.MAX_IMAGES,
  style,
}: PhotoPickerProps) {
  const theme = useTheme();
  const canAddMore = images.length < maxImages;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageList}>
        {images.map((uri, index) => (
          <ImageThumbnail
            key={`${uri}-${index}`}
            uri={uri}
            onRemove={() => onRemoveImage(index)}
          />
        ))}
        {canAddMore && (
          <Pressable
            style={[styles.addButton, { borderColor: theme.colors.border }]}
            onPress={onAddImage}
            accessibilityRole="button"
            accessibilityLabel="Add photo"
          >
            <Icon name="camera" size={24} color={theme.colors.textSecondary} />
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              Add Photo
            </ThemedText>
          </Pressable>
        )}
      </View>
      <ThemedText type="caption" color={theme.colors.textSecondary}>
        {images.length}/{maxImages} photos
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
