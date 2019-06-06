module.exports = function preset(context, opts = {}) {
  return {
    plugins: [
      ['@docusaurus/plugin-content-pages', opts.pages],
      ['@docusaurus/plugin-sitemap', opts.sitemap],
    ],
  };
};
