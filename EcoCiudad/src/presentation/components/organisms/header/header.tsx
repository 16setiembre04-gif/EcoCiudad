import { Icon } from '@/presentation/components/atoms/icon';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { useTranslation } from '@/localization';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
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

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (onLeftIconPress) {
      onLeftIconPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
          {(showBackButton || leftIcon) && (
            <Pressable
              onPress={handleBack}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.colors.surfaceVariant,
                justifyContent: 'center',
                alignItems: 'center',
              }}
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
          <View style={{ flex: 1 }}>
            <ThemedText type="title" numberOfLines={1}>
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText type="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
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
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.surfaceVariant,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel={rightIcon ? t(`common.${rightIcon}` as any) : t('common.action')}
          >
            <Icon name={rightIcon} size={20} color={theme.colors.textPrimary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
