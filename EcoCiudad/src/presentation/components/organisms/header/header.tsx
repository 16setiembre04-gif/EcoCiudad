import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';
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

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (onLeftIconPress) {
      onLeftIconPress();
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
              accessibilityLabel={showBackButton ? 'Go back' : 'Menu'}
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
            accessibilityLabel="Action"
          >
            <Icon name={rightIcon} size={20} color={theme.colors.textPrimary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
