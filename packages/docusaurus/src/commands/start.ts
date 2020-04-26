/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {normalizeUrl, posixPath} from '@docusaurus/utils';
import chokidar from 'chokidar';
import express from 'express';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import portfinder from 'portfinder';
import openBrowser from 'react-dev-utils/openBrowser';
import {prepareUrls} from 'react-dev-utils/WebpackDevServerUtils';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import merge from 'webpack-merge';
import HotModuleReplacementPlugin from 'webpack/lib/HotModuleReplacementPlugin';
import {StartCLIOptions} from '@docusaurus/types';
import {load} from '../server';

import {CONFIG_FILE_NAME, STATIC_DIR_NAME, DEFAULT_PORT} from '../constants';
import {createClientConfig} from '../webpack/client';
import {applyConfigureWebpack} from '../webpack/utils';

import chalk = require('chalk');

function getHost(reqHost: string | undefined): string {
  return reqHost || 'localhost';
}

async function getPort(reqPort: string | undefined): Promise<number> {
  const basePort = reqPort ? parseInt(reqPort, 10) : DEFAULT_PORT;
  const port = await portfinder.getPortPromise({port: basePort});
  return port;
}

export default async function start(
  siteDir: string,
  cliOptions: Partial<StartCLIOptions> = {},
): Promise<void> {
  process.env.NODE_ENV = 'development';
  process.env.BABEL_ENV = 'development';
  console.log(chalk.blue('Starting the development server...'));

  // Process all related files as a prop.
  const props = await load(siteDir);

  // Reload files processing.
  const reload = (): void => {
    load(siteDir).catch((err) => {
      console.error(chalk.red(err.stack));
    });
  };
  const {siteConfig, plugins = []} = props;

  const normalizeToSiteDir = (filepath): string => {
    if (filepath && path.isAbsolute(filepath)) {
      return posixPath(path.relative(siteDir, filepath));
    }
    return posixPath(filepath);
  };

  const pluginPaths: string[] = ([] as string[])
    .concat(
      ...plugins
        .map<any>(
          (plugin) => plugin.getPathsToWatch && plugin.getPathsToWatch(),
        )
        .filter(Boolean),
    )
    .map(normalizeToSiteDir);
  const fsWatcher = chokidar.watch([...pluginPaths, CONFIG_FILE_NAME], {
    cwd: siteDir,
    ignoreInitial: true,
  });
  ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach((event) =>
    fsWatcher.on(event, reload),
  );

  const protocol: string = process.env.HTTPS === 'true' ? 'https' : 'http';
  const port: number = await getPort(cliOptions.port);
  const host: string = getHost(cliOptions.host);
  const {baseUrl, headTags, preBodyTags, postBodyTags} = props;
  const urls = prepareUrls(protocol, host, port);
  const openUrl = normalizeUrl([urls.localUrlForBrowser, baseUrl]);

  let config: webpack.Configuration = merge(createClientConfig(props), {
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          '../client/templates/index.html.template.ejs',
        ),
        // So we can define the position where the scripts are injected.
        inject: false,
        filename: 'index.html',
        title: siteConfig.title,
        headTags,
        preBodyTags,
        postBodyTags,
      }),
      // This is necessary to emit hot updates for webpack-dev-server.
      new HotModuleReplacementPlugin(),
    ],
  });

  // Plugin Lifecycle - configureWebpack.
  plugins.forEach((plugin) => {
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
  const devServerConfig: WebpackDevServer.Configuration = {
    compress: true,
    clientLogLevel: 'error',
    hot: true,
    hotOnly: cliOptions.hotOnly,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: 'ws',
    // Prevent a WS client from getting injected as we're already including
    // `webpackHotDevClient`.
    injectClient: false,
    quiet: true,
    headers: {
      'access-control-allow-origin': '*',
    },
    publicPath: baseUrl,
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: {
      rewrites: [{from: /\/*/, to: baseUrl}],
    },
    disableHostCheck: true,
    // Disable overlay on browser since we use CRA's overlay error reporting.
    overlay: false,
    host,
    before: (app, server) => {
      app.use(baseUrl, express.static(path.resolve(siteDir, STATIC_DIR_NAME)));

      // This lets us fetch source contents from webpack for the error overlay.
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());

      // TODO: add plugins beforeDevServer and afterDevServer hook
    },
  };
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, devServerConfig);
  devServer.listen(port, host, (err) => {
    if (err) {
      console.log(err);
    }
    if (cliOptions.open) {
      openBrowser(openUrl);
    }
  });
  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig as NodeJS.Signals, () => {
      devServer.close();
      process.exit();
    });
  });
}
