/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import type {RcFile} from 'syncpack';

const lernaJson = await fs.readJSON('./lerna.json');

const CurrentDocusaurusVersion = lernaJson.version;

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
    // TODO temporary, need to upgrade jiti deps
    {
      dependencies: ['jiti'],
      isIgnored: true,
    },

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
      label: 'Internal @docusaurus/* monorepo packages use pinned version',
      dependencies: [
        '@docusaurus/**',

        // This one is not a monorepo package
        '!@docusaurus/responsive-loader',
      ],
      pinVersion: CurrentDocusaurusVersion,
    },

    // Default: all remaining dependencies — highest version wins (syncpack default)
  ],
} satisfies RcFile;
