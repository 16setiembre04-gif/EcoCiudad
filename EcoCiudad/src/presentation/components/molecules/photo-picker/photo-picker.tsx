import { IMAGE_UPLOAD_CONFIG } from '@/constants/report.constants';
import { Icon } from '@/presentation/components/atoms/icon';
import { ImageThumbnail } from '@/presentation/components/atoms/image-thumbnail';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { Pressable, StyleSheet, View } from 'react-native';
import { type PhotoPickerProps } from './types';

export function PhotoPicker({
  images,
  onAddImage,
  onRemoveImage,
  maxImages = IMAGE_UPLOAD_CONFIG.MAX_IMAGES,
  style,
}: PhotoPickerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
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
            accessibilityLabel={t('common.addPhoto')}
          >
            <Icon name="camera" size={24} color={theme.colors.textSecondary} />
            <ThemedText type="caption" color={theme.colors.textSecondary}>
              {t('common.addPhoto')}
            </ThemedText>
          </Pressable>
        )}
      </View>
      <ThemedText type="caption" color={theme.colors.textSecondary}>
        {t('common.photosCount', { current: images.length, max: maxImages })}
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
