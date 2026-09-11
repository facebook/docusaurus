/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RcFile} from 'syncpack';

// const lernaJson = await fs.readJSON('./lerna.json');
// const CurrentDocusaurusVersion = lernaJson.version;

export default {
  source: [
    'package.json',
    'packages/*/package.json',
    'website/package.json',
    'argos/package.json',
    'packages/create-docusaurus/templates/*/package.json',
  ],

  semverGroups: [
    {
      label: 'Use ~ for TypeScript monorepo root and init templates',
      dependencies: ['typescript'],
      range: '~',
    },
  ],

  versionGroups: [
    {
      label: 'Ignore * deps in type-alias packages',
      packages: [
        '@docusaurus/module-type-aliases',
        '@docusaurus/theme-common',
        '@docusaurus/types',
      ],
      dependencies: [
        'react',
        'react-dom',
        '@types/react',
        '@types/react-router-config',
        '@types/react-router-dom',
      ],
      isIgnored: true,
    },

    {
      label: 'Ignore * internal peerDependencies',
      packages: [
        '@docusaurus/core',
        '@docusaurus/bundler',
        '@docusaurus/faster',

        // TODO Docusaurus v4: refactor, these peerDeps shouldn't be needed
        '@docusaurus/plugin-content-blog',
        '@docusaurus/theme-common',
      ],
      dependencyTypes: ['peer'],
      dependencies: [
        '@docusaurus/faster',
        '@docusaurus/plugin-content-docs',
        '@docusaurus/types',
      ],
      isIgnored: true,
    },

    {
      label: 'Ignore broad ESLint peerDep range in ESLint plugin',
      packages: ['@docusaurus/eslint-plugin'],
      dependencyTypes: ['peer'],
      dependencies: ['eslint'],
      isIgnored: true,
    },

    {
      label: 'Ignore >= TS range in @docusaurus/tsconfig',
      packages: ['@docusaurus/tsconfig'],
      dependencyTypes: ['peer'],
      isIgnored: true,
    },

    {
      label:
        'Templates should use pinned versions, not the workspace:* protocol',
      packages: [
        'docusaurus-2-classic-template',
        'docusaurus-2-classic-typescript-template',
      ],
      dependencies: ['@docusaurus/**'],
      pinVersion: '4.0.0', // TODO make this dynamic
    },

    {
      label:
        'Internal @docusaurus/* monorepo packages use the workspace:* protocol',
      dependencies: [
        '@docusaurus/**',
        'create-docusaurus',
        'stylelint-copyright',

        // These are not monorepo packages
        '!@docusaurus/responsive-loader',
        '!@docusaurus/responsive-loader',
      ],
      pinVersion: 'workspace:*',
    },

    // Default: all remaining dependencies — highest version wins (syncpack default)
  ],
} satisfies RcFile;
