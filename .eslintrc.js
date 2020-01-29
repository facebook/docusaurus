/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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
  globals: {
    PRISM_ADDITIONAL_LANGUAGES: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-hooks', 'header'],
  rules: {
    'class-methods-use-this': OFF, // It's a way of allowing private variables.
    'func-names': OFF,
    // Ignore certain webpack alias because it can't be resolved
    'import/no-unresolved': [
      ERROR,
      {ignore: ['^@theme', '^@docusaurus', '^@generated']},
    ],
    'import/extensions': OFF,
    'header/header': [
      ERROR,
      'block',
      [
        '*',
        ' * Copyright (c) Facebook, Inc. and its affiliates.',
        ' *',
        ' * This source code is licensed under the MIT license found in the',
        ' * LICENSE file in the root directory of this source tree.',
        ' ',
      ],
    ],
    'jsx-a11y/click-events-have-key-events': WARNING,
    'jsx-a11y/no-noninteractive-element-interactions': WARNING,
    'no-console': OFF,
    'no-underscore-dangle': OFF,
    curly: [WARNING, 'all'],
    'react/jsx-closing-bracket-location': OFF, // Conflicts with Prettier.
    'react/jsx-filename-extension': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/no-array-index-key': OFF, // Sometimes its ok, e.g. non-changing data.
    'react/prop-types': OFF,
    'react/destructuring-assignment': OFF, // Too many lines.
    'react/prefer-stateless-function': WARNING,
    'react/jsx-props-no-spreading': OFF,
    'react-hooks/rules-of-hooks': ERROR,
  },
  overrides: [
    {
      files: ['packages/docusaurus-init/templates/classic/**/*.js'],
      rules: {
        'header/header': 'off',
      },
    },
  ],
};
