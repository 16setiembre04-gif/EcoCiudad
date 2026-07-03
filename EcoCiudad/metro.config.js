const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configure path aliases for Metro
config.resolver.alias = {
  '^@/(.+)': path.resolve(__dirname, 'src/$1'),
  '^@/assets/(.+)': path.resolve(__dirname, 'assets/$1'),
  '^@/domain/(.+)': path.resolve(__dirname, 'src/domain/$1'),
  '^@/data/(.+)': path.resolve(__dirname, 'src/data/$1'),
  '^@/presentation/(.+)': path.resolve(__dirname, 'src/presentation/$1'),
  '^@/infrastructure/(.+)': path.resolve(__dirname, 'src/infrastructure/$1'),
  '^@/theme/(.+)': path.resolve(__dirname, 'src/theme/$1'),
  '^@/lib/(.+)': path.resolve(__dirname, 'src/lib/$1'),
  '^@/services/(.+)': path.resolve(__dirname, 'src/services/$1'),
  '^@/utils/(.+)': path.resolve(__dirname, 'src/utils/$1'),
  '^@/types/(.+)': path.resolve(__dirname, 'src/types/$1'),
  '^@/providers/(.+)': path.resolve(__dirname, 'src/providers/$1'),
  '^@/hooks/(.+)': path.resolve(__dirname, 'src/presentation/hooks/$1'),
  '^@/stores/(.+)': path.resolve(__dirname, 'src/presentation/stores/$1'),
  '^@/presentation/components/(.+)': path.resolve(__dirname, 'src/presentation/components/$1'),
};

module.exports = withNativeWind(config, { input: './src/global.css' });
