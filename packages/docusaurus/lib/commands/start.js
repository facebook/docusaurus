/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash');
const path = require('path');
const express = require('express');
const chalk = require('chalk');
const webpack = require('webpack');
const chokidar = require('chokidar');
const portfinder = require('portfinder');
const openBrowser = require('react-dev-utils/openBrowser');
const {prepareUrls} = require('react-dev-utils/WebpackDevServerUtils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const WebpackDevServer = require('webpack-dev-server');
const {normalizeUrl} = require('@docusaurus/utils');
const load = require('../load');
const loadConfig = require('../load/config');
const createClientConfig = require('../webpack/client');
const {applyConfigureWebpack} = require('../webpack/utils');

function getHost(reqHost) {
  return reqHost || 'localhost';
}

async function getPort(reqPort) {
  portfinder.basePort = parseInt(reqPort, 10) || 3000;
  const port = await portfinder.getPortPromise();
  return port;
}

module.exports = async function start(siteDir, cliOptions = {}) {
  console.log(chalk.blue('Starting the development server...'));

  // Process all related files as a prop.
  const props = await load(siteDir, cliOptions);

  // Reload files processing.
  if (!cliOptions.noWatch) {
    const reload = () => {
      load(siteDir).catch(err => {
        console.error(chalk.red(err.stack));
      });
    };
    const {plugins} = props;
    const pluginPaths = _.compact(
      _.flatten(
        plugins.map(
          plugin => plugin.getPathsToWatch && plugin.getPathsToWatch(),
        ),
      ),
    );
    const fsWatcher = chokidar.watch(
      [...pluginPaths, loadConfig.configFileName],
      {
        cwd: siteDir,
        ignoreInitial: true,
      },
    );
    ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(event =>
      fsWatcher.on(event, reload),
    );
  }

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const port = await getPort(cliOptions.port);
  const host = getHost(cliOptions.host);
  const {baseUrl} = props;
  const urls = prepareUrls(protocol, host, port);
  const openUrl = normalizeUrl([urls.localUrlForBrowser, baseUrl]);

  // Create compiler from generated webpack config.
  let config = createClientConfig(props);

  const {siteConfig, plugins = []} = props;
  config.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [
    {
      inject: false,
      hash: true,
      template: path.resolve(
        __dirname,
        '../core/templates/index.html.template.ejs',
      ),
      filename: 'index.html',
      title: siteConfig.title,
    },
  ]);
  // Needed for hot reload.
  config.plugin('hmr').use(HotModuleReplacementPlugin);
  config = config.toConfig();

  // Plugin lifecycle - configureWebpack
  plugins.forEach(plugin => {
    const {configureWebpack} = plugin;
    if (!configureWebpack) {
      return;
    }

    config = applyConfigureWebpack(
      configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
      config,
      false,
    );
  });

  // https://webpack.js.org/configuration/dev-server
  const devServerConfig = {
    compress: true,
    clientLogLevel: 'error',
    hot: true,
    // Do not fallback to page refresh if hot reload fails
    // https://webpack.js.org/configuration/dev-server/#devserverhotonly
    hotOnly: cliOptions.hotOnly,
    quiet: true,
    headers: {
      'access-control-allow-origin': '*', // Needed for CORS.
    },
    publicPath: baseUrl,
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: {
      rewrites: [{from: /\.html$/, to: '/'}],
    },
    disableHostCheck: true,
    overlay: false,
    host,
    // https://webpack.js.org/configuration/dev-server/#devserverbefore
    // eslint-disable-next-line
    before(app, server) {
      app.use(baseUrl, express.static(path.resolve(siteDir, 'static')));
      // TODO: add plugins beforeDevServer hook
    },
    // https://webpack.js.org/configuration/dev-server/#devserverbefore
    // eslint-disable-next-line
    after(app, server) {
      // TODO: add plugins afterDevServer hook
    },
  };
  WebpackDevServer.addDevServerEntrypoints(config, devServerConfig);
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, devServerConfig);
  devServer.listen(port, host, err => {
    if (err) {
      console.log(err);
    }
    openBrowser(openUrl);
  });
  ['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
      devServer.close();
      process.exit();
    });
  });
};
