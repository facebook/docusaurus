const path = require('path');
const createBaseConfig = require('./base');

module.exports = function createDevConfig(props) {
  const config = createBaseConfig(props);

  config.entry('main').add(path.resolve(__dirname, '../core/index.js'));

  return config;
};
