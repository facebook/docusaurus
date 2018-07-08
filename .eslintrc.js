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
    // allow console
    'no-console': OFF,
    // require radix argument in parseInt
    radix: ERROR,
    'class-methods-use-this': OFF,
    'no-empty': [ERROR, {allowEmptyCatch: true}],
    'no-param-reassign': OFF,
    'no-plusplus': OFF,
    'import/no-extraneous-dependencies': OFF,
    'react/jsx-closing-bracket-location': OFF, // Formatting left to Prettier.
    'react/jsx-filename-extension': OFF,
    'react/no-danger': OFF,
    'react/no-multi-comp': OFF,
    'react/no-unescaped-entities': [ERROR, {forbid: ['>', '}']}],

    // Existing ESLint errors sorted by frequency, silencing first.
    'react/button-has-type': OFF, // 1
    'react/forbid-prop-types': OFF, // 1
    'react/require-default-props': OFF, // 1
    'jsx-a11y/anchor-is-valid': OFF, // 9
    'import/no-unresolved': OFF, // 15
    'react/prefer-stateless-function': OFF, // 22
    'prefer-arrow-callback': OFF, // 30
    'func-names': OFF, // 37
    'import/no-dynamic-require': OFF, // 46
    'prefer-destructuring': OFF, // 69
    'global-require': OFF, // 85
    'react/jsx-one-expression-per-line': OFF, // 129
    'react/prop-types': OFF, // 197
    'prefer-template': OFF, // 292
    'react/destructuring-assignment': OFF, // 342
  },
};
