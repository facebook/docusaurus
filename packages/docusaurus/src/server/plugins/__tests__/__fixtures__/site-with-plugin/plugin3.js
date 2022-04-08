module.exports = function (context, options) {
  return {
    name: 'third-plugin',
  };
};

module.exports.validateThemeConfig = function ({validate, themeConfig}) {
  return {a: 1};
};
