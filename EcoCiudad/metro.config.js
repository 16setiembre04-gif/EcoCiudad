const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': './src',
  '@/assets': './assets',
  '@/domain': './src/domain',
  '@/data': './src/data',
  '@/presentation': './src/presentation',
  '@/infrastructure': './src/infrastructure',
  '@/theme': './src/theme',
  '@/lib': './src/lib',
  '@/services': './src/services',
  '@/utils': './src/utils',
  '@/types': './src/types',
  '@/providers': './src/providers',
  '@/hooks': './src/presentation/hooks',
  '@/stores': './src/presentation/stores',
  '@/components': './src/presentation/components',
};

module.exports = withNativeWind(config, { input: './src/global.css' });
