import { View } from 'react-native';
import { ThemedText } from '@/presentation/components/atoms';
import { useTheme } from '@/theme/context';

export default function AdminHomeScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ThemedText type="title">Admin Dashboard</ThemedText>
    </View>
  );
}
