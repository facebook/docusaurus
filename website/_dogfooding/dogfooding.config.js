/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** @type {import('@docusaurus/types').PluginConfig[]} */
const dogfoodingThemeInstances = [
  /** @type {import('@docusaurus/types').PluginModule} */
  function swizzleThemeTests() {
    return {
      name: 'swizzle-theme-tests',
      getThemePath: () => './_swizzle_theme_tests/src/theme',
    };
  },
];
exports.dogfoodingThemeInstances = dogfoodingThemeInstances;

/** @type {import('@docusaurus/types').PluginConfig[]} */
const dogfoodingPluginInstances = [
  [
    'content-docs', // Shorthand
    /** @type {import('@docusaurus/plugin-content-docs').Options} */
    ({
      id: 'docs-tests',
      routeBasePath: '/tests/docs',
      sidebarPath: '_dogfooding/docs-tests-sidebars.js',
      versions: {
        current: {
          noIndex: true,
        },
      },

      // Using a _ prefix to test against an edge case regarding MDX partials: https://github.com/facebook/docusaurus/discussions/5181#discussioncomment-1018079
      path: '_dogfooding/_docs tests',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      sidebarItemsGenerator(args) {
        return args.defaultSidebarItemsGenerator({
          ...args,
          isCategoryIndex({fileName, directories}) {
            const eligibleDocIndexNames = [
              'index',
              'readme',
              directories[0].toLowerCase(),
              'intro',
            ];
            return eligibleDocIndexNames.includes(fileName.toLowerCase());
          },
        });
      },
    }),
  ],

  [
    '@docusaurus/plugin-content-blog', // Longhand
    /** @type {import('@docusaurus/plugin-content-blog').Options} */
    ({
      id: 'blog-tests',
      path: '_dogfooding/_blog tests',
      routeBasePath: '/tests/blog',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/main/website/_dogfooding/_blog-tests',
      postsPerPage: 3,
      feedOptions: {
        type: 'all',
        title: 'Docusaurus Tests Blog',
        copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
      },
      readingTime: ({content, frontMatter, defaultReadingTime}) =>
        frontMatter.hide_reading_time
          ? undefined
          : defaultReadingTime({content, options: {wordsPerMinute: 5}}),
    }),
  ],

  [
    require.resolve('@docusaurus/plugin-content-pages'), // Full path
    /** @type {import('@docusaurus/plugin-content-pages').Options} */
    ({
      id: 'pages-tests',
      path: '_dogfooding/_pages tests',
      routeBasePath: '/tests/pages',
    }),
  ],

  /** @type {import('@docusaurus/types').Plugin} */
  function clientModuleTestPlugin() {
    return {
      name: 'client-module-test-plugin',
      getClientModules() {
        return [
          require.resolve('./clientModuleExample.ts'),
          require.resolve('./clientModuleCSS.css'),
        ];
      },
    };
  },
];

exports.dogfoodingPluginInstances = dogfoodingPluginInstances;
