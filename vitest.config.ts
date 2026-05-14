/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fileURLToPath} from 'url';
import {defineConfig} from 'vitest/config';
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
  plugins: [
    // Apparently Vitest can't interpret .js files as JSX???
    docusaurusJsAsJsx(),
    // React plugin enables the automatic JSX runtime in `.tsx`/`.jsx` files
    // (required for React 19 + Testing Library).
    react(),
  ],

  resolve: {
    alias: [
      // Resolve `@docusaurus/<exportName>` to the live source in
      // `docusaurus-core` rather than the compiled `lib/` of consumer
      // packages, so tests always exercise current source.
      {
        find: /^@docusaurus\/(BrowserOnly|ComponentCreator|constants|ExecutionEnvironment|Head|Interpolate|isInternalUrl|Link|Noop|renderRoutes|router|Translate|use.*)$/,
        replacement: '@docusaurus/core/src/client/exports/$1',
      },

      // `@generated/*` only exists at runtime (produced by the Docusaurus
      // build). In tests we stub it with an empty module; test files that
      // need real data call `vi.mock('@generated/<x>', ...)` explicitly.
      {find: /^@generated\/.*/, replacement: `${rootDir}test/emptyModule.ts`},

      // `@theme/*` resolves to swizzlable theme components. For tests we
      // hard-code the classic theme; if we ever test another theme, switch
      // to Vitest "projects" with per-project aliases.
      {
        find: /^@theme\/(.*)$/,
        replacement: '@docusaurus/theme-classic/src/theme/$1',
      },
      // `@site/*` is the user site root. For our tests it's the local
      // website workspace.
      {find: /^@site\/(.*)$/, replacement: `${rootDir}website/$1`},

      // Subpath export — explicit alias since the regex above doesn't cover
      // sub-path entrypoints.
      {
        find: '@docusaurus/plugin-content-docs/client',
        replacement: '@docusaurus/plugin-content-docs/src/client/index.ts',
      },
    ],
  },
  test: {
    setupFiles: ['test/setup.ts'],
    // Inject `describe`/`it`/`expect`/`vi` as globals (no per-file imports).
    // Mirrors the Jest setup we migrated from; we may switch to explicit
    // imports later.
    globals: true,
    // Default to Node. Tests that need a DOM opt-in with a
    // `// @vitest-environment jsdom` docblock at the top of the file.
    environment: 'node',
    environmentOptions: {
      // Some client code reads `window.location`; pin a stable URL so
      // jsdom-based tests have predictable behavior.
      jsdom: {
        url: 'https://docusaurus.io/',
      },
    },
    // Default 5s timeout often fails on Windows runners.
    // See https://github.com/facebook/docusaurus/pull/8259
    testTimeout: 25000,
    exclude: ignorePatterns,
    sequence: {
      // Jest runs hooks in declaration order (outermost-first for
      // `beforeEach`, etc.). Vitest defaults to "stack" (innermost-first)
      // which would flip semantics; "list" preserves the Jest behavior our
      // tests were written against.
      hooks: 'list',
    },
    snapshotFormat: {
      // Avoid escaping every quote inside strings, which would explode
      // string snapshots into noisy `\"…\"` forms.
      escapeString: false,
      // Drop the `Object {` / class-name prefix from object snapshots —
      // matches what we had under Jest, keeps snapshots compact.
      printBasicPrototype: false,
    },
    snapshotSerializers: [
      // TOP: serializer applied last
      // Because Vitest doesn't Snapshot Error.cause automatically
      // see https://github.com/vitest-dev/vitest/issues/10339
      `test/snapshotErrorCause.ts`,
      // Strips absolute paths, the current Docusaurus version, ANSI codes,
      // and Windows backslashes so snapshots are stable across machines/CI.
      `test/snapshotPathNormalizer.ts`,
      // Turns ANSI escape sequences into human-readable `<cyan>…</color>`
      // tags so logger snapshots stay readable in diffs.
      'jest-serializer-ansi-escapes',
      // Serializes react-helmet-async output predictably.
      'jest-serializer-react-helmet-async',
      // BOTTOM: serializer applied first
    ],
    // GitHub Actions reporter emits annotations on failing tests directly
    // in the PR UI; enable it only in CI to keep local output clean.
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', 'github-actions']
      : ['default'],
  },
});
