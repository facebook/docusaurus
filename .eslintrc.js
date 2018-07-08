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
    'react/no-multi-comp': OFF,
    'import/no-extraneous-dependencies': OFF,
    'react/no-danger': OFF,
    'no-empty': [ERROR, {allowEmptyCatch: true}],

    // Existing ESLint errors sorted by frequency, silencing first.
    'react/button-has-type': OFF, // 1
    'react/forbid-prop-types': OFF, // 1
    'react/require-default-props': OFF, // 1
    'jsx-a11y/anchor-is-valid': OFF, // 9
    'arrow-body-style': OFF, // 10
    'react/jsx-curly-brace-presence': OFF, // 11
    'react/no-unescaped-entities': OFF, // 12
    'no-param-reassign': OFF, // 12
    'spaced-comment': OFF, // 14
    'import/no-unresolved': OFF, // 15
    'object-shorthand': OFF, // 16
    'dot-notation': OFF, // 19
    'react/prefer-stateless-function': OFF, // 22
    'no-plusplus': OFF, // 23
    'prefer-arrow-callback': OFF, // 30
    'react/jsx-filename-extension': OFF, // 31
    'import/newline-after-import': OFF, // 31
    'react/jsx-closing-bracket-location': OFF, // 36
    'func-names': OFF, // 37
    'import/no-dynamic-require': OFF, // 46
    'prefer-destructuring': OFF, // 69
    'prefer-const': OFF, // 71
    'global-require': OFF, // 85
    'react/jsx-one-expression-per-line': OFF, // 129
    'react/prop-types': OFF, // 197
    'prefer-template': OFF, // 292
    'react/destructuring-assignment': OFF, // 342
  },
};
