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
    // Existing ESLint errors sorted by frequency, silencing first.
    'react/button-has-type': OFF, // 1
    null: OFF, // 1
    'react/no-unused-state': OFF, // 1
    'vars-on-top': OFF, // 1
    'react/forbid-prop-types': OFF, // 1
    'react/require-default-props': OFF, // 1
    'lines-between-class-members': OFF, // 1
    strict: OFF, // 1
    'no-restricted-syntax': OFF, // 1
    'no-path-concat': OFF, // 2
    'one-var': OFF, // 2
    'no-unused-expressions': OFF, // 2
    'react/jsx-boolean-value': OFF, // 2
    'jsx-a11y/html-has-lang': OFF, // 2
    'no-var': OFF, // 2
    'no-useless-return': OFF, // 2
    'jsx-a11y/anchor-has-content': OFF, // 2
    'react/jsx-no-comment-textnodes': OFF, // 3
    'no-continue': OFF, // 3
    'jsx-a11y/alt-text': OFF, // 3
    'react/jsx-tag-spacing': OFF, // 3
    'no-lonely-if': OFF, // 3
    'react/sort-comp': OFF, // 4
    'no-cond-assign': OFF, // 4
    'no-use-before-define': OFF, // 4
    'no-empty': OFF, // 4
    'no-shadow': OFF, // 4
    'class-methods-use-this': OFF, // 5
    eqeqeq: OFF, // 5
    'react/no-multi-comp': OFF, // 5
    'react/no-array-index-key': OFF, // 6
    'no-underscore-dangle': OFF, // 6
    'array-callback-return': OFF, // 6
    'import/no-extraneous-dependencies': OFF, // 7
    'no-else-return': OFF, // 9
    'jsx-a11y/anchor-is-valid': OFF, // 9
    'import/order': OFF, // 10
    'arrow-body-style': OFF, // 10
    camelcase: OFF, // 10
    'react/jsx-curly-brace-presence': OFF, // 11
    'react/no-unescaped-entities': OFF, // 12
    'no-param-reassign': OFF, // 12
    'no-unused-vars': OFF, // 13
    'spaced-comment': OFF, // 14
    'import/no-unresolved': OFF, // 15
    'react/no-danger': OFF, // 16
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
