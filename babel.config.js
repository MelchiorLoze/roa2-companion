module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: process.env.NODE_ENV === 'test' ? [] : [['react-native-unistyles/plugin']],
  };
};
