/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
// import header from 'eslint-plugin-header'; // TODO replace
import importPlugin from 'eslint-plugin-import';
import vitest from '@vitest/eslint-plugin';
// @ts-expect-error: no types provided
import jsxA11y from 'eslint-plugin-jsx-a11y';
import docusaurus from '@docusaurus/eslint-plugin';
import regexp from 'eslint-plugin-regexp';
import prettier from 'eslint-config-prettier/flat';

import rules from './eslint.rules';

const plugins = defineConfig([
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  vitest.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  regexp.configs.recommended,
  prettier,
  docusaurus.configs.flat.all,
]);

export default defineConfig(plugins, rules, {
  extends: [
    // TODO:
    // 'header/header',
  ],

  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.commonjs,
      JSX: true,
    },
    parserOptions: {
      projectService: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  ignores: [
    '__fixtures__',
    '__mocks__',
    'dist',
    'node_modules',
    '.yarn',
    '.history',
    'build',
    'coverage',
    'examples/',
    'packages/lqip-loader/lib/',
    'packages/docusaurus/lib/',
    'packages/docusaurus-*/lib/*',
    'packages/eslint-plugin/lib/',
    'packages/stylelint-copyright/lib/',
    'packages/create-docusaurus/lib/*',
    'packages/create-docusaurus/templates/facebook',
    'website/_dogfooding/_swizzle_theme_tests',
    'website/_dogfooding/_asset-tests/badSyntax.js',
    'packages/docusaurus-plugin-ideal-image/src/theme/IdealImageLegacy',
  ],
});
