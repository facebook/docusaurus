/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

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
    'no-console': OFF,
    'func-names': OFF,
    'jsx-a11y/click-events-have-key-events': OFF, // Revisit in future™
    'jsx-a11y/no-noninteractive-element-interactions': OFF, // Revisit in future™
    'react/jsx-closing-bracket-location': OFF, // Conflicts with Prettier.
    'react/jsx-filename-extension': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/no-array-index-key': OFF, // Sometimes its ok, e.g. non-changing data.
    'react/prop-types': OFF,
    'react/destructuring-assignment': OFF, // Too many lines.
    'import/no-unresolved': WARNING, // Because it couldn't resolve webpack alias.
    'react/prefer-stateless-function': WARNING,
    'react-hooks/rules-of-hooks': ERROR,
  },
};
