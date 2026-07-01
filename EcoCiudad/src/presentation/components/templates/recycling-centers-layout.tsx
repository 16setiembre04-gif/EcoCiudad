import { ReactNode } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/context';

interface RecyclingCentersLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function RecyclingCentersLayout({ header, children, footer }: RecyclingCentersLayoutProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {header}
      <View style={styles.content}>{children}</View>
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
