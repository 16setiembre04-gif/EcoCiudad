import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { sizes } from '@/theme/sizes';
import { useTranslation } from '@/localization';
import { useRouter } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderProps } from './types';

export function Header({
  title,
  subtitle,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
  rightContent,
  showBackButton = false,
  onBackPress,
  containerStyle,
  testID,
}: HeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (onLeftIconPress) {
      onLeftIconPress();
    } else {
      router.back();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rightIconAccessibilityLabel = rightIcon ? t(`common.${rightIcon}` as any) : t('common.action');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          paddingTop: insets.top > 0 ? insets.top : spacing.md,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      <View style={styles.inner}>
        <View style={styles.leftSection}>
          {(showBackButton || leftIcon) && (
            <Pressable
              onPress={handleBack}
              style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}
              accessibilityRole="button"
              accessibilityLabel={showBackButton ? t('common.goBack') : t('common.menu')}
            >
              <Icon
                name={showBackButton ? 'arrow-left' : leftIcon || 'menu'}
                size={20}
                color={theme.colors.textPrimary}
              />
            </Pressable>
          )}
          <View style={styles.titleContainer}>
            <ThemedText type="title" numberOfLines={1} ellipsizeMode="tail">
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1} ellipsizeMode="tail">
                {subtitle}
              </ThemedText>
            )}
          </View>
        </View>
        {rightContent ? (
          rightContent
        ) : rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            style={[styles.iconButton, { backgroundColor: theme.colors.surfaceVariant }]}
            accessibilityRole="button"
            accessibilityLabel={rightIconAccessibilityLabel}
          >
            <Icon name={rightIcon} size={20} color={theme.colors.textPrimary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: sizes.touchTarget.min + spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconButton: {
    width: sizes.touchTarget.min,
    height: sizes.touchTarget.min,
    borderRadius: sizes.touchTarget.min / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
});
