module.exports = function preset(context, opts = {}) {
  return {
    plugins: [
      {
        name: '@docusaurus/plugin-content-pages',
        options: opts.pages,
      },
      {
        name: '@docusaurus/plugin-sitemap',
        options: opts.sitemap,
      },
    ],
  };
};
