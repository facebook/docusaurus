const path = require('path');
const webpackNiceLog = require('webpack-nicelog');
const {StatsWriterPlugin} = require('webpack-stats-plugin');
const createBaseConfig = require('./base');

module.exports = function createClientConfig(props) {
  const config = createBaseConfig(props);

  config.entry('main').add(path.resolve(__dirname, '../core/clientEntry.js'));

  // write webpack stats object to a file so we can
  // programmatically refer to the correct bundle path in Node.js server.
  config
    .plugin('stats')
    .use(StatsWriterPlugin, [{filename: 'client.stats.json'}]);

  config.plugin('niceLog').use(webpackNiceLog, [{name: 'Client'}]);

  return config;
};
