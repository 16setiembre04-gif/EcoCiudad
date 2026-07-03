import { Avatar } from '@/presentation/components/atoms/avatar';
import { Badge } from '@/presentation/components/atoms/badge';
import { useTheme } from '@/theme/context';
import { StyleSheet, View } from 'react-native';
import { type OperatorAvatarProps } from './types';

export function OperatorAvatar({
  name,
  avatarUrl,
  size = 'md',
  showBadge = false,
  style,
}: OperatorAvatarProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Avatar uri={avatarUrl} name={name} size={size} />
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Badge variant="filled" color="success" size="sm">
            OP
          </Badge>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
