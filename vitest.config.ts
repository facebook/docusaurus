/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fileURLToPath} from 'url';
import {defineConfig, type ViteUserConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

import {transformWithOxc} from 'vite';

// Force UTC so snapshots involving dates are stable across local & CI runs.
process.env.TZ = 'UTC';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

const ignorePatterns = [
  '**/node_modules/**',
  '**/__fixtures__/**',
  '**/__mocks__/**',
  '**/testUtils.ts',
  // Built outputs — we test sources, not the compiled `lib/`.
  '**/packages/docusaurus/lib/**',
  '**/packages/docusaurus-logger/lib/**',
  '**/packages/docusaurus-utils/lib/**',
  '**/packages/docusaurus-utils-common/lib/**',
  '**/packages/docusaurus-utils-validation/lib/**',
  '**/packages/docusaurus-plugin-content-blog/lib/**',
  '**/packages/docusaurus-plugin-content-docs/lib/**',
  '**/packages/docusaurus-plugin-content-pages/lib/**',
  '**/packages/docusaurus-theme-classic/lib/**',
  '**/packages/docusaurus-theme-common/lib/**',
  '**/packages/docusaurus-migrate/lib/**',
  '**/test/**',
  '**/argos/**',
];

type AliasOptions = NonNullable<ViteUserConfig['resolve']>['alias'];

const resolveAliases: AliasOptions = [
  // Resolve `@docusaurus/<exportName>` to `docusaurus-core` source files
  {
    find: /^@docusaurus\/(BrowserOnly|ComponentCreator|constants|ExecutionEnvironment|Head|Interpolate|isInternalUrl|Link|Noop|renderRoutes|router|Translate|use.*)$/,
    replacement: '@docusaurus/core/src/client/exports/$1',
  },

  // Stub `@generated/*` modules for tests
  {find: /^@generated\/.*/, replacement: `${rootDir}test/emptyModule.ts`},

  // Resolve `@theme/*` aliases to theme-classic components
  // This won't always be true, but good enough for now
  {
    find: /^@theme\/(.*)$/,
    replacement: '@docusaurus/theme-classic/src/theme/$1',
  },

  // Resolve `@site/*` aliases against our own website
  // Because our own site can have tests involving that alias
  {find: /^@site\/(.*)$/, replacement: `${rootDir}website/$1`},

  // Resolving content plugins client exports to src instead of lib
  // This way, tests work without having to rebuild those packages

  {
    find: /^@docusaurus\/plugin-content-(docs|blog|pages)\/client$/,
    replacement: '@docusaurus/plugin-content-$1/src/client/index.ts',
  },
];

// Apparently Vitest can't interpret .js files as JSX?
// and we have many files like that in theme lib/theme output dir
// Not sure why we need this to ensure .js files are parsed as JSX by Oxc
// This must be configurable??? But can't find how
function docusaurusJsAsJsx() {
  return {
    name: 'docusaurus-js-as-jsx',
    enforce: 'pre' as const,
    async transform(code: string, id: string) {
      const cleanId = id.split('?')[0];
      if (
        cleanId.endsWith('.js') &&
        cleanId.includes('/packages/docusaurus-')
      ) {
        return transformWithOxc(code, cleanId, {
          lang: 'jsx',
        });
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [docusaurusJsAsJsx(), react()],
  resolve: {
    alias: resolveAliases,
  },
  test: {
    setupFiles: ['test/setup.ts'],
    globals: true,
    environment: 'node',
    environmentOptions: {
      jsdom: {
        url: 'https://docusaurus.io/',
      },
    },
    // Default 5s timeout often fails on Windows runners.
    // See https://github.com/facebook/docusaurus/pull/8259
    testTimeout: 25000,
    exclude: ignorePatterns,
    snapshotFormat: {
      // Vitest defaults are fine
    },
    snapshotSerializers: [
      // TOP: applied last
      // Capture Error.cause in snapshots, see https://github.com/vitest-dev/vitest/issues/10339
      `test/snapshotErrorCause.ts`,
      // Normalize absolute/Windows/posix/temp paths across machines/CI.
      `test/snapshotPathNormalizer.ts`,
      // Turns ANSI escape sequences into human-readable `<cyan>…</color>` tags
      'jest-serializer-ansi-escapes',
      // Serializes react-helmet-async output predictably.
      'jest-serializer-react-helmet-async',
      // BOTTOM: applied first
    ],
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', 'github-actions']
      : ['default'],
  },
});
