const path = require('path');
const createBaseConfig = require('./base');

module.exports = function createProdConfig(props) {
  const config = createBaseConfig(props);

  config.entry('main').add(path.resolve(__dirname, '../core/prodEntry.js'));

  // TODO

  return config;
};
