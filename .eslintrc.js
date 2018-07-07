const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  extends: ['airbnb', 'prettier'],
  rules: {
    // allow console
    'no-console': OFF,
    // require radix argument in parseInt
    radix: ERROR,
  },
};
