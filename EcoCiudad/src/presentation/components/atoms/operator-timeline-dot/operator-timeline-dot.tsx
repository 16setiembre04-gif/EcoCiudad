import { View, StyleSheet } from 'react-native';
import { Icon } from '@/components/atoms/icon';
import { useTheme } from '@/theme/context';
import { OPERATOR_ACTIONS } from '@/constants/operator.constants';
import { type OperatorTimelineDotProps } from './types';

export function OperatorTimelineDot({
  action,
  isActive = false,
  style,
}: OperatorTimelineDotProps) {
  const theme = useTheme();
  const config = OPERATOR_ACTIONS[action];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceVariant,
          borderColor: isActive ? theme.colors.primary : theme.colors.border,
        },
        style,
      ]}
    >
      <Icon
        name={config.icon}
        size={16}
        color={isActive ? theme.colors.onPrimary : theme.colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
