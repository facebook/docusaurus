/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    jest: true,
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-hooks'],
  rules: {
    'no-console': 'off',
    'func-names': 'off',
    'jsx-a11y/click-events-have-key-events': 'off', // Revisit in future™
    'jsx-a11y/no-noninteractive-element-interactions': 'off', // Revisit in future™
    'react/jsx-closing-bracket-location': 'off', // Conflicts with Prettier.
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off', // Too many lines.
    'import/no-unresolved': 'warn', // Because it couldn't resolve webpack alias.
    'react/prefer-stateless-function': 'warn',
    'react-hooks/rules-of-hooks': 'error',
  },
};
