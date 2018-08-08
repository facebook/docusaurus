const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackNiceLog = require('webpack-nicelog');
const createBaseConfig = require('./base');

module.exports = function createDevConfig(props) {
  const config = createBaseConfig(props);

  config.entry('main').add(path.resolve(__dirname, '../core/devEntry.js'));

  const {siteConfig} = props;
  config.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [
    {
      inject: false,
      hash: true,
      template: path.resolve(__dirname, '../core/devTemplate.ejs'),
      filename: 'index.html',
      title: siteConfig.title
    }
  ]);
  config.plugin('WebpackNiceLog').use(webpackNiceLog, [
    {
      name: 'Development'
    }
  ]);

  return config;
};
