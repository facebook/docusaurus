const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  extends: [
    'fbjs', // eslint-config-fbjs
    'prettier' // eslint-config-prettier
  ],
  overrides: [
    {
      files: ['lib/**/*.js'],
      rules: {
        // allow console
        'no-console': OFF,
        // require radix argument in parseInt
        'radix': ERROR,
        // disallow unused vars
        'no-unused-vars': ERROR,
        // almost certainly a bug
        'no-duplicate-case': ERROR,
      }
    },
    {
      files: ['examples/**/*.js'],
      rules: {
        'no-unused-vars': OFF
      }
    }
  ]
};