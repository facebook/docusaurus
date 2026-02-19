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
  '/argos',
];

export default {
  rootDir: fileURLToPath(new URL('.', import.meta.url)),
  verbose: true,
  // Default 5s timeout often fails on Windows :s,
  // see https://github.com/facebook/docusaurus/pull/8259
  testTimeout: 25000,
  setupFiles: ['./jest/setup.ts'],
  testEnvironmentOptions: {
    url: 'https://docusaurus.io/',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ignorePatterns,
  watchPathIgnorePatterns: ['/\\.docusaurus'],
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

    // MDX packages are ESM-only and it is a pain to use in Jest
    // So we use them in Jest tests as CJS versions
    // see https://mdxjs.com/docs/troubleshooting-mdx/#problems-integrating-mdx
    '^@mdx-js/mdx$': '<rootDir>/jest/vendor/@mdx-js__mdx@3.0.0.js',
    '^remark$': '<rootDir>/jest/vendor/remark@15.0.1.js',
    '^remark-rehype$': '<rootDir>/jest/vendor/remark-rehype@11.0.0.js',
    '^remark-mdx$': '<rootDir>/jest/vendor/remark-mdx@3.0.0.js',
    '^remark-directive$': '<rootDir>/jest/vendor/remark-directive@3.0.0.js',
    '^remark-gfm$': '<rootDir>/jest/vendor/remark-gfm@4.0.0.js',
    '^estree-util-value-to-estree$':
      '<rootDir>/jest/vendor/estree-util-value-to-estree@3.0.1.js',
    '^mdast-util-to-string$':
      '<rootDir>/jest/vendor/mdast-util-to-string@4.0.0.js',
    '^unist-util-visit$': '<rootDir>/jest/vendor/unist-util-visit@5.0.0.js',
    '^unist-util-remove-position$':
      '<rootDir>/jest/vendor/unist-util-remove-position@5.0.0.js',
    '^rehype-stringify$': '<rootDir>/jest/vendor/rehype-stringify@10.0.0.js',
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
