module.exports = function preset(context, opts = {}) {
  return {
    plugins: [
      {
        name: '@docusaurus/plugin-content-docs',
        options: opts.docs,
      },
      {
        name: '@docusaurus/plugin-content-blog',
        options: opts.blog,
      },
    ],
  };
};
