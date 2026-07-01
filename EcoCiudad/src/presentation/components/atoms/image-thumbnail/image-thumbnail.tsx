import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { borderRadius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { type ImageThumbnailProps } from './types';

export function ImageThumbnail({
  uri,
  size = 80,
  onPress,
  onRemove,
  style,
}: ImageThumbnailProps) {
  const theme = useTheme();

  const content = (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
      />
      {onRemove && (
        <Pressable
          style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Remove image"
        >
          <Icon name="close" size={12} color={theme.colors.onPrimary} />
        </Pressable>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="image">
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
