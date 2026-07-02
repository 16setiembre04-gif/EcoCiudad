module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
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
          },
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        },
      ],
    ],
  };
};
