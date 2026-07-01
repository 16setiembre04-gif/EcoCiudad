import { View } from 'react-native';
import { EmptyStateProps } from './types';
import { getEmptyStateStyles } from './styles';
import { useTheme } from '@/theme/context';
import { Icon } from '../icon';
import { ThemedText } from '../text';

export function EmptyState({
  iconName,
  title,
  description,
  action,
  style,
}: EmptyStateProps) {
  const theme = useTheme();
  const styles = getEmptyStateStyles(theme.colors);

  return (
    <View style={[styles.container, style]}>
      {iconName && (
        <View style={styles.iconContainer}>
          <Icon
            name={iconName}
            size={64}
            color={theme.colors.disabled}
          />
        </View>
      )}
      
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      
      {description && (
        <ThemedText type="body" style={styles.description}>
          {description}
        </ThemedText>
      )}
      
      {action && (
        <View style={styles.actionContainer}>
          {action}
        </View>
      )}
    </View>
  );
}
