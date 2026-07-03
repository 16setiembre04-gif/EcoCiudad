import { PARTICIPANT_STATUSES } from '@/constants/event.constants';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { Card } from '@/presentation/components/atoms/card';
import { ThemedText } from '@/presentation/components/atoms/text';
import { useTheme } from '@/theme/context';
import { spacing } from '@/theme/spacing';
import { StyleSheet, View } from 'react-native';
import { type ParticipantCardProps } from './types';

export function ParticipantCard({ participant, onPress, containerStyle }: ParticipantCardProps) {
  const theme = useTheme();
  const statusConfig = PARTICIPANT_STATUSES[participant.status];

  return (
    <Card
      variant="elevated"
      padding="md"
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <Avatar
        uri={participant.user?.avatarUrl}
        name={participant.user?.displayName}
        size="md"
      />
      <View style={styles.info}>
        <ThemedText type="body" numberOfLines={1}>
          {participant.user?.displayName ?? 'Unknown User'}
        </ThemedText>
        <ThemedText type="caption" color={theme.colors.textSecondary}>
          Joined {participant.registeredAt.toLocaleDateString()}
        </ThemedText>
      </View>
      <Badge variant="tonal" color={statusConfig.color as any} size="sm">
        {statusConfig.label}
      </Badge>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
