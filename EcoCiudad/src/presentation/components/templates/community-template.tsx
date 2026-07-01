import { ReactNode } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/context';

interface CommunityTemplateProps {
  header?: ReactNode;
  search?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function CommunityTemplate({ header, search, children, footer }: CommunityTemplateProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {header}
      {search && <View style={styles.searchContainer}>{search}</View>}
      <View style={styles.content}>{children}</View>
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
});
