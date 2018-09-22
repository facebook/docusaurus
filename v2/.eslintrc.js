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
  extends: ['airbnb', 'prettier'],
  rules: {
    'no-console': OFF,
    'func-names': OFF,
    'react/jsx-filename-extension': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/prop-types': OFF,
    'react/destructuring-assignment': OFF, // too many lines
    'import/no-unresolved': WARNING, // because it couldn't resolve webpack alias
    'react/prefer-stateless-function': WARNING,
  },
};
