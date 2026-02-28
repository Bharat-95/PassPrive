module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      './babel/plugins/inline-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: false,
      },
    ],
  ],
};
