const fs = require('fs');
const path = require('path');

exports.dogfoodingPluginInstances = [
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'docs-tests',
      routeBasePath: '/tests/docs',
      sidebarPath: '_dogfooding/docs-tests-sidebars.js',

      // Using a symlinked folder as source, test for use-case https://github.com/facebook/docusaurus/issues/3272
      // The target folder uses a _ prefix to test against an edge case regarding MDX partials: https://github.com/facebook/docusaurus/discussions/5181#discussioncomment-1018079
      path: fs.realpathSync('_dogfooding/docs-tests-symlink'),
    },
  ],

  [
    '@docusaurus/plugin-content-blog',
    {
      id: 'blog-tests',
      path: '_dogfooding/_blog tests',
      routeBasePath: '/tests/blog',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/main/website/_dogfooding/_blog-tests',
      postsPerPage: 3,
      feedOptions: {
        type: 'all',
        copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
      },
    },
  ],

  [
    '@docusaurus/plugin-content-pages',
    {
      id: 'pages-tests',
      path: '_dogfooding/_pages tests',
      routeBasePath: '/tests/pages',
    },
  ],
];
