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
  extends: ['airbnb', 'prettier'],
  rules: {
    'no-console': OFF, // We have console.error, console.warn, etc.
    radix: ERROR,
    'class-methods-use-this': OFF,
    'func-names': OFF,
    'no-empty': [ERROR, {allowEmptyCatch: true}],
    'no-param-reassign': OFF,
    'no-plusplus': OFF,
    'prefer-template': OFF,
    'import/no-extraneous-dependencies': OFF,
    'react/jsx-closing-bracket-location': OFF, // Formatting is left to Prettier.
    'react/jsx-filename-extension': OFF, // Enable in future when migrating.
    'react/jsx-one-expression-per-line': OFF, // Formatting is left to Prettier.
    'react/no-array-index-key': OFF, // It's ok if you use it for static content.
    'react/no-danger': OFF, // Need this to inject scripts.
    'react/no-multi-comp': OFF, // One component per file creates too many files.
    'react/no-unescaped-entities': [ERROR, {forbid: ['>', '}']}],

    // Existing ESLint errors sorted by frequency, silencing first.
    'react/button-has-type': OFF, // 1
    'react/forbid-prop-types': OFF, // 1
    'react/require-default-props': OFF, // 1
    'jsx-a11y/anchor-is-valid': OFF, // 9
    'import/no-unresolved': OFF, // 15
    'react/prefer-stateless-function': OFF, // 22
    'import/no-dynamic-require': OFF, // 46
    'prefer-destructuring': OFF, // 69
    'global-require': OFF, // 85
    'react/prop-types': OFF, // 197
    'react/destructuring-assignment': OFF, // 342
  },
};
