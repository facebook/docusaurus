/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {KnipConfig} from 'knip';

type WorkspaceConfig = NonNullable<KnipConfig['workspaces']>[string];

// Plugins and themes expose their theme components through getThemePath():
// all these files can be resolved through the @theme/* alias or swizzled.
function themePackageConfig({
  entry = [],
  ...rest
}: WorkspaceConfig = {}): WorkspaceConfig {
  return {
    entry: ['src/theme/**/*.{js,jsx,ts,tsx}', ...[entry].flat()],
    ...rest,
  };
}

const config: KnipConfig = {
  ignore: ['**/__fixtures__/**'],
  ignoreDependencies: [
    // Docusaurus client API aliases, see packages/docusaurus/src/client/exports
    // Plugins and themes depend on @docusaurus/core for these aliases
    /^@docusaurus\/(?:BrowserOnly|ComponentCreator|constants|ErrorBoundary|ExecutionEnvironment|Head|Interpolate|isInternalUrl|Link|Noop|renderRoutes|router|Translate|use[A-Z]\w*)$/,
    '@docusaurus/core',
    // Docusaurus theme aliases and generated modules
    /^@(?:theme|theme-init|theme-original|generated)\//,
    /^@site\//,
    // Compiled code imports helpers, see importHelpers in tsconfig.base.json
    'tslib',
  ],
  ignoreBinaries: [
    // System binaries
    'awk',
    'openssl',
    // Not installed, expected to be run through npx
    'serve',
  ],
  workspaces: {
    '.': {
      entry: [
        'admin/scripts/*.js',
        // Vitest alias for @generated/* modules
        'test/emptyModule.ts',
      ],
      ignore: ['examples/**'],
      ignoreDependencies: [
        // Only needed to typecheck DocSearch
        '@ai-sdk/react',
        // Resolved by tests through Vitest aliases
        '@docusaurus/plugin-content-blog',
        '@docusaurus/plugin-content-pages',
      ],
      ignoreBinaries: [
        // False positives, not binaries
        'create',
        'typecheck',
        // Installed in the argos workspace
        'playwright',
      ],
    },
    'packages/create-docusaurus': {
      // Used to test the CLI package
      ignoreBinaries: ['create-docusaurus'],
    },
    'packages/docusaurus': {
      entry: [
        // Programmatic API, imported by bin/docusaurus.mjs as lib/index.js
        'src/index.ts',
        // Resolved with path.join(__dirname, ...)
        'src/client/clientEntry.tsx',
        'src/client/serverEntry.tsx',
        'src/client/exports/*.{ts,tsx}',
        'src/client/theme-fallback/**/*.tsx',
        'src/ssg/ssgWorkerThread.ts',
        'src/babel/preset.ts',
        // Ambient declarations with triple-slash directives
        'src/**/*.d.ts',
      ],
      ignoreDependencies: [
        // Polyfills for Babel preset-env "useBuiltIns: entry"
        'core-js',
        // Resolved from the site dir, only when using a theme
        '@docusaurus/theme-common',
        // JSDoc type, provided by webpack-dev-server
        'express',
      ],
    },
    'packages/docusaurus-bundler': {
      ignoreDependencies: [
        // Used through CssMinimizerPlugin.cssnanoMinify/cleanCssMinify
        'clean-css',
        'cssnano',
        // Optional peer dependency, dynamically imported
        '@docusaurus/faster',
      ],
    },
    'packages/docusaurus-module-type-aliases': {
      // Knip doesn't detect imports in "declare module" blocks
      ignoreDependencies: [/.*/],
    },
    'packages/docusaurus-plugin-content-blog': {
      // Knip doesn't detect imports in "declare module" blocks
      ignoreDependencies: ['utility-types'],
    },
    'packages/docusaurus-plugin-content-docs': {
      // Knip doesn't detect imports in "declare module" blocks
      ignoreDependencies: ['@types/react-router-config'],
    },
    'packages/docusaurus-plugin-debug': themePackageConfig(),
    // Client modules are resolved through getClientModules()
    'packages/docusaurus-plugin-google-gtag': {
      entry: ['src/gtag.ts', 'src/vendor-gtag.ts'],
    },
    'packages/docusaurus-plugin-ideal-image': themePackageConfig(),
    'packages/docusaurus-plugin-pwa': themePackageConfig({
      entry: ['src/registerSw.ts', 'src/sw.ts'],
      ignoreDependencies: [
        // Used as a webpack loader name
        'babel-loader',
        // Polyfills for Babel preset-env "useBuiltIns: entry"
        'core-js',
      ],
    }),
    'packages/docusaurus-plugin-svgr': {
      // TODO: used for types, see options.ts
      ignoreDependencies: ['@svgr/core'],
    },
    'packages/docusaurus-plugin-vercel-analytics': {
      entry: ['src/analytics.ts'],
    },
    'packages/docusaurus-preset-classic': {
      // Resolved with require.resolve(name)
      ignoreDependencies: ['@docusaurus/plugin-css-cascade-layers'],
    },
    'packages/docusaurus-theme-classic': themePackageConfig({
      entry: ['src/nprogress.ts', 'src/prism-include-languages.ts'],
      ignoreDependencies: [
        // Resolved with require.resolve(`infima/...`)
        'infima',
        // Knip doesn't detect imports in "declare module" blocks
        '@docusaurus/mdx-loader',
      ],
    }),
    'packages/docusaurus-theme-live-codeblock': themePackageConfig({
      // Knip doesn't detect imports in "declare module" blocks
      ignoreDependencies: ['@types/buble'],
    }),
    'packages/docusaurus-theme-mermaid': themePackageConfig(),
    'packages/docusaurus-types': {
      // All types are public: this package has no exports field
      entry: ['src/*.d.ts'],
    },
    'packages/docusaurus-theme-search-algolia': themePackageConfig({
      // Knip doesn't detect imports in "declare module" blocks
      ignoreDependencies: ['utility-types'],
    }),
    website: {
      entry: [
        'docusaurus.config*.{js,ts}',
        'sidebars*.{js,ts}',
        '*.d.json.ts',
        '_dogfooding/*-sidebars.js',
        '_dogfooding/{clientModuleExample,migrateStorageNamespace}.ts',
        '_dogfooding/_{docs,blog,pages} tests/**/*.{js,jsx,ts,tsx}',
        '**/*.mdx',
        // Knip ignores MDX imports in ```mdx-code-block fences
        'src/components/**/*.{js,jsx,ts,tsx}',
        'blog/**/*.{js,jsx,ts,tsx}',
        'src/theme/**/*.{js,jsx,ts,tsx}',
        'src/plugins/changelog/index.ts',
        'src/plugins/changelog/theme/**/*.{js,jsx,ts,tsx}',
        'src/plugins/featureRequests/FeatureRequestsPlugin.js',
        'src/plugins/featureRequests/FeatureRequestsPage.tsx',
        'src/sw.js',
        'svgo.config.js',
      ],
      ignore: [
        // Intentionally broken files for testing purposes
        '_dogfooding/_asset-tests/**',
      ],
      ignoreDependencies: [
        // Plugins and themes referenced by short name in docusaurus.config.ts
        '@docusaurus/plugin-pwa',
        '@docusaurus/plugin-rsdoctor',
        '@docusaurus/theme-mermaid',
        // Netlify build plugin, see netlify.toml
        'netlify-plugin-cache',
        // Used by theme components ejected in CI, see testSwizzleThemeClassic.mjs
        '@docusaurus/utils-common',
        // Imported in ```mdx-code-block fences
        'react-medium-image-zoom',
        // Used by versioned docs through !!raw-loader! imports
        'raw-loader',
        // Peer dependency of raw-loader
        'webpack',
      ],
    },
  },
};

export default config;
