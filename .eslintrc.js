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
    'react/jsx-filename-extension': OFF, // Enable in future when migrating.
  },
};