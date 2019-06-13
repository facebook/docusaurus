module.exports = function preset(context, opts = {}) {
  return {
    plugins: [
      ['@docusaurus/plugin-content-docs', opts.docs],
      ['@docusaurus/plugin-content-blog', opts.blog],
    ],
  };
};
