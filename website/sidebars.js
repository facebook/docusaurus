/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    'Getting Started': [
      'introduction',
      'installation',
      'project-structure',
      'deployment',
    ],
    Guides: [
      {
        type: 'link',
        label: 'Github',
        href: 'http://github.com',
      },
      {
        type: 'ref',
        id: 'configuration',
      },
      'creating-pages',
      'writing-documentation',
      'assets',
      'markdown',
      'styling-layout',
      'using-plugins',
      'using-themes',
      'search',
      'analytics',
    ],
    'Advanced Guides': ['blog', 'plugins', 'themes', 'presets'],
    'API Reference': [
      'cli',
      'docusaurus-core',
      'docusaurus.config.js',
      'plugins-api',
    ],
    Contributing: ['how-to-contribute', 'motivation', 'design-principles'],
  },
};
