module.exports = function preset(context, opts = {}) {
  return {
    themes: [
      {
        name: '@docusaurus/theme-classic',
        options: opts.test,
      },
    ],
    plugins: [
      {
        name: '@docusaurus/plugin-test',
        options: opts.test,
      },
    ],
  };
};
