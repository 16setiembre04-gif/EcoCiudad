import { View } from 'react-native';
import { Card } from '@/components/atoms/card';
import { ThemedText } from '@/components/atoms/text';
import { Icon } from '@/components/atoms/icon';
import { Badge } from '@/components/atoms/badge';
import { NotificationItemProps } from './types';
import { spacing } from '@/theme/spacing';
import { useTheme } from '@/theme/context';

export function NotificationItem({
  title,
  message,
  time,
  icon,
  isRead = false,
  onPress,
  containerStyle,
  testID,
}: NotificationItemProps) {
  const theme = useTheme();

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
      <View style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: theme.colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Icon name={icon} size={20} color={theme.colors.primary} />
      </View>
      
      <View style={{ flex: 1, gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <ThemedText 
              type="subtitle" 
              numberOfLines={1}
              style={{ fontWeight: isRead ? '400' : '600' }}
            >
              {title}
            </ThemedText>
            {!isRead && <Badge variant="filled" color="primary" dot />}
          </View>
          <ThemedText type="caption" color={theme.colors.textSecondary}>
            {time}
          </ThemedText>
        </View>
        
        <ThemedText 
          type="bodySmall" 
          color={theme.colors.textSecondary} 
          numberOfLines={2}
        >
          {message}
        </ThemedText>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Card 
        variant={isRead ? 'outlined' : 'elevated'} 
        padding="lg" 
        onPress={onPress} 
        style={containerStyle} 
        testID={testID}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card 
      variant={isRead ? 'outlined' : 'elevated'} 
      padding="lg" 
      style={containerStyle} 
      testID={testID}
    >
      {content}
    </Card>
  );
}
