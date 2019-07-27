module.exports = function preset(context, opts = {}) {
  return {
    themes: [['@docusaurus/theme-classic', opts.test]],
    plugins: [['@docusaurus/plugin-test', opts.test]],
  };
};
