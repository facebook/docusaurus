/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import {normalizeUrl, posixPath} from '@docusaurus/utils';
import chokidar from 'chokidar';
import openBrowser from 'react-dev-utils/openBrowser';
import {prepareUrls} from 'react-dev-utils/WebpackDevServerUtils';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import merge from 'webpack-merge';
import {load, type LoadContextOptions} from '../server';
import {createStartClientConfig} from '../webpack/client';
import {
  getHttpsConfig,
  formatStatsErrorMessage,
  printStatsWarnings,
  executePluginsConfigurePostCss,
  executePluginsConfigureWebpack,
} from '../webpack/utils';
import {getHostPort, type HostPortOptions} from '../server/getHostPort';
import {PerfLogger} from '../utils';
import type {Compiler} from 'webpack';
import type {Props} from '@docusaurus/types';

export type StartCLIOptions = HostPortOptions &
  Pick<LoadContextOptions, 'locale' | 'config'> & {
    hotOnly?: boolean;
    open?: boolean;
    poll?: boolean | number;
    minify?: boolean;
  };

export async function start(
  siteDirParam: string = '.',
  cliOptions: Partial<StartCLIOptions> = {},
): Promise<void> {
  // Temporary workaround to unlock the ability to translate the site config
  // We'll remove it if a better official API can be designed
  // See https://github.com/facebook/docusaurus/issues/4542
  process.env.DOCUSAURUS_CURRENT_LOCALE = cliOptions.locale;

  const siteDir = await fs.realpath(siteDirParam);

  logger.info('Starting the development server...');

  async function loadSite() {
    PerfLogger.start('Loading site');
    const result = await load({
      siteDir,
      config: cliOptions.config,
      locale: cliOptions.locale,
      localizePath: undefined, // Should this be configurable?
    });
    PerfLogger.end('Loading site');
    return result;
  }

  // Process all related files as a prop.
  const props = await loadSite();

  const {host, port, getOpenUrl} = await createUrlUtils({cliOptions});
  const openUrl = getOpenUrl({baseUrl: props.baseUrl});

  logger.success`Docusaurus website is running at: url=${openUrl}`;

  // Reload files processing.
  const reload = _.debounce(() => {
    loadSite()
      .then(({baseUrl: newBaseUrl}) => {
        const newOpenUrl = getOpenUrl({baseUrl: newBaseUrl});
        if (newOpenUrl !== openUrl) {
          logger.success`Docusaurus website is running at: url=${newOpenUrl}`;
        }
      })
      .catch((err: Error) => {
        logger.error(err.stack);
      });
  }, 500);

  // TODO this is historically not optimized!
  //  When any site file changes, we reload absolutely everything :/
  //  At least we should try to reload only one plugin individually?
  setupFileWatchers({
    props,
    cliOptions,
    onFileChange: () => {
      reload();
    },
  });

  const config = await getStartClientConfig({
    props,
    minify: cliOptions.minify ?? true,
    poll: cliOptions.poll,
  });

  const compiler = webpack(config);
  registerE2ETestHook(compiler);

  const defaultDevServerConfig = await createDevServerConfig({
    cliOptions,
    props,
    host,
    port,
  });

  // Allow plugin authors to customize/override devServer config
  const devServerConfig: WebpackDevServer.Configuration = merge(
    [defaultDevServerConfig, config.devServer].filter(Boolean),
  );

  const devServer = new WebpackDevServer(devServerConfig, compiler);
  devServer.startCallback(() => {
    if (cliOptions.open) {
      openBrowser(openUrl);
    }
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      devServer.stop();
      process.exit();
    });
  });
}

function createPollingOptions({cliOptions}: {cliOptions: StartCLIOptions}) {
  return {
    usePolling: !!cliOptions.poll,
    interval: Number.isInteger(cliOptions.poll)
      ? (cliOptions.poll as number)
      : undefined,
  };
}

function setupFileWatchers({
  props,
  cliOptions,
  onFileChange,
}: {
  props: Props;
  cliOptions: StartCLIOptions;
  onFileChange: () => void;
}) {
  const {siteDir} = props;
  const pathsToWatch = getPathsToWatch({props});

  const pollingOptions = createPollingOptions({cliOptions});
  const fsWatcher = chokidar.watch(pathsToWatch, {
    cwd: siteDir,
    ignoreInitial: true,
    ...{pollingOptions},
  });

  ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach((event) =>
    fsWatcher.on(event, onFileChange),
  );
}

function getPathsToWatch({props}: {props: Props}): string[] {
  const {siteDir, siteConfigPath, plugins, localizationDir} = props;

  const normalizeToSiteDir = (filepath: string) => {
    if (filepath && path.isAbsolute(filepath)) {
      return posixPath(path.relative(siteDir, filepath));
    }
    return posixPath(filepath);
  };

  const pluginsPaths = plugins
    .flatMap((plugin) => plugin.getPathsToWatch?.() ?? [])
    .filter(Boolean)
    .map(normalizeToSiteDir);

  return [...pluginsPaths, siteConfigPath, localizationDir];
}

async function createUrlUtils({cliOptions}: {cliOptions: StartCLIOptions}) {
  const protocol: string = process.env.HTTPS === 'true' ? 'https' : 'http';

  const {host, port} = await getHostPort(cliOptions);
  if (port === null) {
    return process.exit();
  }

  const getOpenUrl = ({baseUrl}: {baseUrl: string}) => {
    const urls = prepareUrls(protocol, host, port);
    return normalizeUrl([urls.localUrlForBrowser, baseUrl]);
  };

  return {host, port, getOpenUrl};
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

  const pollingOptions = createPollingOptions({cliOptions});

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
      publicPath: baseUrl,
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

// E2E_TEST=true docusaurus start
// Makes "docusaurus start" exit immediately on success/error, for E2E test
function registerE2ETestHook(compiler: Compiler) {
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

async function getStartClientConfig({
  props,
  minify,
  poll,
}: {
  props: Props;
  minify: boolean;
  poll: number | boolean | undefined;
}) {
  const {plugins, siteConfig} = props;
  let {clientConfig: config} = await createStartClientConfig({
    props,
    minify,
    poll,
  });
  config = executePluginsConfigurePostCss({plugins, config});
  config = executePluginsConfigureWebpack({
    plugins,
    config,
    isServer: false,
    jsLoader: siteConfig.webpack?.jsLoader,
  });
  return config;
}
