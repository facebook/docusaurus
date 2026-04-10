/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import type {RcFile} from 'syncpack';

const lernaJson = fs.readJSON('./lerna.json');

export default {
  source: [
    'package.json',
    'packages/*/package.json',
    'website/package.json',
    'argos/package.json',
    'packages/create-docusaurus/templates/*/package.json',
  ],
  versionGroups: [
    // Ignore npm:-aliased dependencies
    {
      label: 'Ignore npm:-aliased dependencies',
      dependencies: ['react-helmet-async', 'react-loadable'],
      isIgnored: true,
    },
    // Ignore template react/react-dom/@types/react (intentionally broader for users)
    {
      label: 'Ignore template react/react-dom',
      packages: [
        'docusaurus-2-classic-template',
        'docusaurus-2-classic-typescript-template',
      ],
      dependencies: ['react', 'react-dom', '@types/react'],
      isIgnored: true,
    },
    // Ignore * deps in type-alias/type-definition packages
    // These packages use * for react, @types/react, etc. on purpose
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
    // Ignore * internal peerDependencies (optional/flexible deps)
    {
      label: 'Ignore * internal peerDependencies',
      dependencies: [
        '@docusaurus/faster',
        '@docusaurus/plugin-content-docs',
        '@docusaurus/types',
      ],
      dependencyTypes: ['peer'],
      isIgnored: true,
    },
    // Ignore broad peerDep ranges (eslint >=6, jimp *)
    {
      label: 'Ignore broad peerDep ranges',
      dependencies: ['eslint', 'jimp'],
      dependencyTypes: ['peer'],
      isIgnored: true,
    },
    // Ignore non-caret pinned third-party deps (handled manually)
    {
      label: 'Ignore non-caret pinned third-party dependencies',
      dependencies: [
        'typescript',
        'lint-staged',
        'infima',
        '@svgr/core',
        'netlify-plugin-cache',
        'cheerio',
        'mermaid',
        '@docsearch/react',
      ],
      isIgnored: true,
    },
    // Ignore @docusaurus/responsive-loader (external package)
    {
      label: 'Ignore @docusaurus/responsive-loader (external package)',
      dependencies: ['@docusaurus/responsive-loader'],
      isIgnored: true,
    },
    // Internal @docusaurus/* packages pinned to monorepo version
    {
      label: 'Internal @docusaurus/* packages use pinned version',
      dependencies: ['@docusaurus/**'],
      pinVersion: lernaJson.version,
    },
    // Default: all remaining dependencies — highest version wins (syncpack default)
  ],
} satisfies RcFile;
