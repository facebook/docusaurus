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
  root: true,
  env: {
    browser: true,
    commonjs: true,
    jest: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  globals: {
    JSX: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  reportUnusedDisableDirectives: true,
  plugins: ['react-hooks', 'header', 'jest', '@typescript-eslint'],
  rules: {
    'array-callback-return': WARNING,
    camelcase: WARNING,
    'class-methods-use-this': OFF, // It's a way of allowing private variables.
    curly: [WARNING, 'all'],
    'global-require': WARNING,
    'lines-between-class-members': OFF,
    'max-len': [
      WARNING,
      {
        code: Infinity, // Code width is already enforced by Prettier
        tabWidth: 2,
        comments: 80,
        ignoreUrls: true,
        ignorePattern: '(eslint-disable|@)',
      },
    ],
    'no-await-in-loop': OFF,
    'no-case-declarations': WARNING,
    'no-console': OFF,
    'no-control-regex': WARNING,
    'no-else-return': [WARNING, {allowElseIf: true}],
    'no-empty': [WARNING, {allowEmptyCatch: true}],
    'no-lonely-if': WARNING,
    'no-nested-ternary': WARNING,
    'no-param-reassign': [WARNING, {props: false}],
    'no-prototype-builtins': WARNING,
    'no-restricted-exports': OFF,
    'no-useless-escape': WARNING,
    'no-template-curly-in-string': WARNING,
    'no-restricted-imports': [
      ERROR,
      {
        paths: [
          {
            name: 'lodash',
            importNames: [
              // TODO: TS doesn't make Boolean a narrowing function yet,
              // so filter(Boolean) is problematic type-wise
              // 'compact',
              'filter',
              'flatten',
              'flatMap',
              'map',
              'reduce',
              'take',
              'takeRight',
              'head',
              'tail',
              'initial',
            ],
            message: 'These APIs have their ES counterparts.',
          },
        ],
      },
    ],
    'no-restricted-syntax': WARNING,
    'no-unused-expressions': [WARNING, {allowTaggedTemplates: true}],
    'prefer-destructuring': WARNING,
    'prefer-named-capture-group': WARNING,
    'prefer-template': WARNING,
    yoda: WARNING,

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

    'import/extensions': OFF,
    // Ignore certain webpack aliases because they can't be resolved
    'import/no-unresolved': [
      ERROR,
      {
        ignore: ['^@theme', '^@docusaurus', '^@generated', '^@site'],
      },
    ],
    'import/order': OFF,
    'import/prefer-default-export': OFF,

    'jest/prefer-expect-resolves': WARNING,
    'jest/expect-expect': OFF,
    'jest/valid-title': OFF,

    'jsx-a11y/click-events-have-key-events': WARNING,
    'jsx-a11y/no-noninteractive-element-interactions': WARNING,
    'jsx-a11y/html-has-lang': OFF,

    'react-hooks/rules-of-hooks': ERROR,
    'react-hooks/exhaustive-deps': ERROR,

    // Sometimes we do need the props as a whole, e.g. when spreading
    'react/destructuring-assignment': OFF,
    'react/function-component-definition': [
      WARNING,
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/no-array-index-key': OFF, // We build a static site, and nearly all components don't change.
    'react/no-unstable-nested-components': [WARNING, {allowAsProps: true}],
    'react/prefer-stateless-function': WARNING,
    'react/prop-types': OFF,
    'react/require-default-props': [ERROR, {ignoreFunctionalComponents: true}],

    '@typescript-eslint/ban-ts-comment': [
      ERROR,
      {'ts-expect-error': 'allow-with-description'},
    ],
    '@typescript-eslint/consistent-type-imports': [
      WARNING,
      {disallowTypeAnnotations: false},
    ],
    '@typescript-eslint/explicit-module-boundary-types': WARNING,
    '@typescript-eslint/method-signature-style': ERROR,
    '@typescript-eslint/no-empty-function': OFF,
    '@typescript-eslint/no-empty-interface': [
      ERROR,
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/no-inferrable-types': OFF,
    'no-use-before-define': OFF,
    '@typescript-eslint/no-use-before-define': [
      ERROR,
      {functions: false, classes: false, variables: true},
    ],
    '@typescript-eslint/no-non-null-assertion': OFF,
    'no-redeclare': OFF,
    '@typescript-eslint/no-redeclare': ERROR,
    'no-shadow': OFF,
    '@typescript-eslint/no-shadow': ERROR,
    'no-unused-vars': OFF,
    '@typescript-eslint/no-unused-vars': [
      ERROR,
      {argsIgnorePattern: '^_', ignoreRestSiblings: true},
    ],
  },
  overrides: [
    {
      files: [
        'packages/docusaurus-*/src/theme/**/*.js',
        'packages/docusaurus-*/src/theme/**/*.ts',
        'packages/docusaurus-*/src/theme/**/*.tsx',
      ],
      rules: {
        'import/no-named-export': ERROR,
      },
    },
    {
      files: [
        'packages/create-docusaurus/templates/**/*.js',
        'packages/create-docusaurus/templates/**/*.ts',
        'packages/create-docusaurus/templates/**/*.tsx',
      ],
      rules: {
        'header/header': OFF,
        'global-require': OFF,
        '@typescript-eslint/no-var-requires': OFF,
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-duplicates': OFF,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': OFF,
        'import/no-import-module-exports': OFF,
      },
    },
    {
      files: ['*.js', '*.mjs', '.cjs'],
      rules: {
        // Make JS code directly runnable in Node.
        '@typescript-eslint/no-var-requires': OFF,
        '@typescript-eslint/explicit-module-boundary-types': OFF,
      },
    },
  ],
};
