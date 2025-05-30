const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

// Filter out `.svg` from assetExts and add it to sourceExts
const assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
const sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

const config = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts,
    sourceExts,
  },
});

module.exports = withNativeWind(config, {
  input: './src/styles/global.css',
});
