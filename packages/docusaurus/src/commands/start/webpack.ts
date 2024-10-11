/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import merge from 'webpack-merge';
import {formatStatsErrorMessage, printStatsWarnings} from '@docusaurus/bundler';
import logger from '@docusaurus/logger';
import WebpackDevServer from 'webpack-dev-server';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import {createPollingOptions} from './watcher';
import getHttpsConfig from '../../webpack/utils/getHttpsConfig';
import {
  createConfigureWebpackUtils,
  executePluginsConfigureWebpack,
} from '../../webpack/configure';
import {createStartClientConfig} from '../../webpack/client';
import type {StartCLIOptions} from './start';
import type {ConfigureWebpackUtils, Props} from '@docusaurus/types';
import type {Compiler} from 'webpack';
import type {OpenUrlContext} from './utils';

// E2E_TEST=true docusaurus start
// Makes "docusaurus start" exit immediately on success/error, for E2E test
function registerWebpackE2ETestHook(compiler: Compiler) {
  compiler.hooks.done.tap('done', (stats) => {
    const errorsWarnings = stats.toJson('errors-warnings');
    const statsErrorMessage = formatStatsErrorMessage(errorsWarnings);
    if (statsErrorMessage) {
      console.error(statsErrorMessage);
    }
    printStatsWarnings(errorsWarnings);
    if (process.env.E2E_TEST) {
      if (stats.hasErrors()) {
        logger.error('E2E_TEST: Project has compiler errors.');
        process.exit(1);
      }
      logger.success('E2E_TEST: Project can compile.');
      process.exit(0);
    }
  });
}

async function createDevServerConfig({
  cliOptions,
  props,
  host,
  port,
}: {
  cliOptions: StartCLIOptions;
  props: Props;
  host: string;
  port: number;
}): Promise<WebpackDevServer.Configuration> {
  const {baseUrl, siteDir, siteConfig} = props;

  const pollingOptions = createPollingOptions(cliOptions);

  const httpsConfig = await getHttpsConfig();

  // https://webpack.js.org/configuration/dev-server
  return {
    hot: cliOptions.hotOnly ? 'only' : true,
    liveReload: false,
    client: {
      progress: true,
      overlay: {
        warnings: false,
        errors: true,
      },
      webSocketURL: {
        hostname: '0.0.0.0',
        port: 0,
      },
    },
    headers: {
      'access-control-allow-origin': '*',
    },
    devMiddleware: {
      publicPath:
        siteConfig.future.experimental_router === 'hash' ? 'auto' : baseUrl,
      // Reduce log verbosity, see https://github.com/facebook/docusaurus/pull/5420#issuecomment-906613105
      stats: 'summary',
    },
    static: siteConfig.staticDirectories.map((dir) => ({
      publicPath: baseUrl,
      directory: path.resolve(siteDir, dir),
      watch: {
        // Useful options for our own monorepo using symlinks!
        // See https://github.com/webpack/webpack/issues/11612#issuecomment-879259806
        followSymlinks: true,
        ignored: /node_modules\/(?!@docusaurus)/,
        ...{pollingOptions},
      },
    })),
    ...(httpsConfig && {
      server:
        typeof httpsConfig === 'object'
          ? {
              type: 'https',
              options: httpsConfig,
            }
          : 'https',
    }),
    historyApiFallback: {
      rewrites: [{from: /\/*/, to: baseUrl}],
    },
    allowedHosts: 'all',
    host,
    port,
    setupMiddlewares: (middlewares, devServer) => {
      // This lets us fetch source contents from webpack for the error overlay.
      middlewares.unshift(evalSourceMapMiddleware(devServer));
      return middlewares;
    },
  };
}

async function getStartClientConfig({
  props,
  minify,
  poll,
  configureWebpackUtils,
}: {
  props: Props;
  minify: boolean;
  poll: number | boolean | undefined;
  configureWebpackUtils: ConfigureWebpackUtils;
}) {
  const {plugins} = props;
  let {clientConfig: config} = await createStartClientConfig({
    props,
    minify,
    faster: props.siteConfig.future.experimental_faster,
    poll,
    configureWebpackUtils,
  });
  config = executePluginsConfigureWebpack({
    plugins,
    config,
    isServer: false,
    configureWebpackUtils,
  });
  return config;
}

export async function createWebpackDevServer({
  props,
  cliOptions,
  openUrlContext,
}: {
  props: Props;
  cliOptions: StartCLIOptions;
  openUrlContext: OpenUrlContext;
}): Promise<WebpackDevServer> {
  const configureWebpackUtils = await createConfigureWebpackUtils({
    siteConfig: props.siteConfig,
  });

  const config = await getStartClientConfig({
    props,
    minify: cliOptions.minify ?? true,
    poll: cliOptions.poll,
    configureWebpackUtils,
  });

  const compiler = props.currentBundler.instance(config);
  registerWebpackE2ETestHook(compiler);

  const defaultDevServerConfig = await createDevServerConfig({
    cliOptions,
    props,
    host: openUrlContext.host,
    port: openUrlContext.port,
  });

  // Allow plugin authors to customize/override devServer config
  const devServerConfig: WebpackDevServer.Configuration = merge(
    [defaultDevServerConfig, config.devServer].filter(Boolean),
  );

  return new WebpackDevServer(devServerConfig, compiler);
}
