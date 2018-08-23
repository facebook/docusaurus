const path = require('path');
const webpackNiceLog = require('webpack-nicelog');
const {StatsWriterPlugin} = require('webpack-stats-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const createBaseConfig = require('./base');

module.exports = function createClientConfig(props) {
  const config = createBaseConfig(props);
  config.entry('main').add(path.resolve(__dirname, '../core/clientEntry.js'));

  // remove/clean build folders before building bundles
  const {outDir} = props;
  config
    .plugin('clean')
    .use(cleanWebpackPlugin, [outDir, {verbose: false, allowExternal: true}]);

  // write webpack stats object so we can pickup correct client bundle path in server.
  config
    .plugin('stats')
    .use(StatsWriterPlugin, [{filename: 'client.stats.json'}]);

  // show compilation progress bar and build time
  config.plugin('niceLog').use(webpackNiceLog, [{name: 'Client'}]);
  return config;
};
