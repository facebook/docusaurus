/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const chokidar = require('chokidar');
const convert = require('koa-connect');
const range = require('koa-range');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const history = require('connect-history-api-fallback');
const portfinder = require('portfinder');
const serve = require('webpack-serve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const load = require('../load');
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
  console.log('Start command invoked ...');

  // Process all related files as a prop
  const props = await load(siteDir);

  // Reload files processing
  if (!cliOptions.noWatch) {
    const reload = () => {
      load(siteDir).catch(err => {
        console.error(chalk.red(err.stack));
      });
    };
    const docsRelativeDir = props.siteConfig.customDocsPath;
    const fsWatcher = chokidar.watch(
      [
        `../${docsRelativeDir}/**/*.md`,
        'blog/**/*.md',
        'siteConfig.js',
        'sidebars.json',
      ],
      {
        cwd: siteDir,
        ignoreInitial: true,
      },
    );
    fsWatcher.on('add', reload);
    fsWatcher.on('change', reload);
    fsWatcher.on('unlink', reload);
    fsWatcher.on('addDir', reload);
    fsWatcher.on('unlinkDir', reload);
  }

  const port = await getPort(cliOptions.port);
  const hotPort = await getPort(port + 1);
  const host = getHost(cliOptions.host);
  const {baseUrl} = props;

  // create compiler from generated webpack config
  let config = createClientConfig(props);

  const {siteConfig} = props;
  config.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [
    {
      inject: false,
      hash: true,
      template: path.resolve(__dirname, '../core/devTemplate.ejs'),
      filename: 'index.html',
      title: siteConfig.title,
    },
  ]);
  config = config.toConfig();

  // apply user webpack config
  const {
    siteConfig: {configureWebpack},
  } = props;
  config = applyConfigureWebpack(configureWebpack, config, false);

  const compiler = webpack(config);

  // webpack-serve
  await serve(
    {},
    {
      compiler,
      open: true,
      devMiddleware: {
        logLevel: 'silent',
      },
      hotClient: {
        port: hotPort,
        logLevel: 'error',
      },
      logLevel: 'error',
      port,
      host,
      add: app => {
        // serve static files
        const staticDir = path.resolve(siteDir, 'static');
        if (fs.existsSync(staticDir)) {
          app.use(mount(baseUrl, serveStatic(staticDir)));
        }

        // enable HTTP range requests
        app.use(range);

        // rewrite request to `/` since dev is only a SPA
        app.use(
          convert(
            history({
              rewrites: [{from: /\.html$/, to: '/'}],
            }),
          ),
        );
      },
    },
  );
};
