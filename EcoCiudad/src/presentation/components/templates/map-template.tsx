import { ReactNode } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/context';

interface MapTemplateProps {
  map: ReactNode;
  controls?: ReactNode;
  overlay?: ReactNode;
}

export function MapTemplate({ map, controls, overlay }: MapTemplateProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.mapContainer}>{map}</View>
        {controls && <View style={styles.controlsContainer}>{controls}</View>}
        {overlay && <View style={styles.overlayContainer}>{overlay}</View>}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  mapContainer: {
    ...StyleSheet.absoluteFill,
  },
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
  },
});
