/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fileURLToPath} from 'url';

process.env.TZ = 'UTC';

const ignorePatterns = [
  '/node_modules/',
  '__fixtures__',
  '__mocks__',
  '/testUtils.ts',
  '/packages/docusaurus/lib',
  '/packages/docusaurus-logger/lib',
  '/packages/docusaurus-utils/lib',
  '/packages/docusaurus-utils-common/lib',
  '/packages/docusaurus-utils-validation/lib',
  '/packages/docusaurus-plugin-content-blog/lib',
  '/packages/docusaurus-plugin-content-docs/lib',
  '/packages/docusaurus-plugin-content-pages/lib',
  '/packages/docusaurus-theme-classic/lib',
  '/packages/docusaurus-theme-common/lib',
  '/packages/docusaurus-migrate/lib',
  '/jest',
];

export default {
  rootDir: fileURLToPath(new URL('.', import.meta.url)),
  verbose: true,
  testEnvironmentOptions: {
    url: 'https://docusaurus.io/',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ignorePatterns,
  // Default 5s timeout often fails on Windows :s,
  // see https://github.com/facebook/docusaurus/pull/8259
  testTimeout: 15000,
  coveragePathIgnorePatterns: [
    ...ignorePatterns,
    // We also ignore all package entry points
    '/packages/docusaurus-utils/src/index.ts',
  ],
  transform: {
    '^.+\\.[jt]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2020',
        },
      },
    ],
  },
  errorOnDeprecated: true,
  reporters: ['default', 'github-actions'],
  moduleNameMapper: {
    // Jest can't resolve CSS or asset imports
    '^.+\\.(css|jpe?g|png|svg|webp)$': '<rootDir>/jest/emptyModule.ts',

    // Using src instead of lib, so we always get fresh source
    '@docusaurus/(BrowserOnly|ComponentCreator|constants|ExecutionEnvironment|Head|Interpolate|isInternalUrl|Link|Noop|renderRoutes|router|Translate|use.*)':
      '@docusaurus/core/src/client/exports/$1',

    // TODO create dedicated testing utility for mocking contexts
    // Maybe point to a fixture?
    '@generated/.*': '<rootDir>/jest/emptyModule.ts',
    // TODO use "projects" + multiple configs if we work on another theme?
    '@theme/(.*)': '@docusaurus/theme-classic/src/theme/$1',
    '@site/(.*)': 'website/$1',

    // Using src instead of lib, so we always get fresh source
    '@docusaurus/plugin-content-docs/client':
      '@docusaurus/plugin-content-docs/src/client/index.ts',

    '@testing-utils/(.*)': '<rootDir>/jest/utils/$1.ts',
  },
  snapshotSerializers: [
    '<rootDir>/jest/snapshotPathNormalizer.ts',
    'jest-serializer-ansi-escapes',
    'jest-serializer-react-helmet-async',
  ],
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },
};
