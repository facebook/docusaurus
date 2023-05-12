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
import HtmlWebpackPlugin from 'html-webpack-plugin';
import openBrowser from 'react-dev-utils/openBrowser';
import {prepareUrls} from 'react-dev-utils/WebpackDevServerUtils';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import merge from 'webpack-merge';
import {load, type LoadContextOptions} from '../server';
import createClientConfig from '../webpack/client';
import {
  applyConfigureWebpack,
  applyConfigurePostCss,
  getHttpsConfig,
  formatStatsErrorMessage,
  printStatsWarnings,
} from '../webpack/utils';
import {getHostPort, type HostPortOptions} from '../server/getHostPort';

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

  function loadSite() {
    return load({
      siteDir,
      config: cliOptions.config,
      locale: cliOptions.locale,
      localizePath: undefined, // Should this be configurable?
    });
  }

  // Process all related files as a prop.
  const props = await loadSite();

  const protocol: string = process.env.HTTPS === 'true' ? 'https' : 'http';

  const {host, port} = await getHostPort(cliOptions);

  if (port === null) {
    process.exit();
  }

  const {baseUrl, headTags, preBodyTags, postBodyTags} = props;
  const urls = prepareUrls(protocol, host, port);
  const openUrl = normalizeUrl([urls.localUrlForBrowser, baseUrl]);

  logger.success`Docusaurus website is running at: url=${openUrl}`;

  // Reload files processing.
  const reload = _.debounce(() => {
    loadSite()
      .then(({baseUrl: newBaseUrl}) => {
        const newOpenUrl = normalizeUrl([urls.localUrlForBrowser, newBaseUrl]);
        if (newOpenUrl !== openUrl) {
          logger.success`Docusaurus website is running at: url=${newOpenUrl}`;
        }
      })
      .catch((err: Error) => {
        logger.error(err.stack);
      });
  }, 500);
  const {siteConfig, plugins, localizationDir} = props;

  const normalizeToSiteDir = (filepath: string) => {
    if (filepath && path.isAbsolute(filepath)) {
      return posixPath(path.relative(siteDir, filepath));
    }
    return posixPath(filepath);
  };

  const pluginPaths = plugins
    .flatMap((plugin) => plugin.getPathsToWatch?.() ?? [])
    .filter(Boolean)
    .map(normalizeToSiteDir);

  const pathsToWatch = [...pluginPaths, props.siteConfigPath, localizationDir];

  const pollingOptions = {
    usePolling: !!cliOptions.poll,
    interval: Number.isInteger(cliOptions.poll)
      ? (cliOptions.poll as number)
      : undefined,
  };
  const httpsConfig = await getHttpsConfig();
  const fsWatcher = chokidar.watch(pathsToWatch, {
    cwd: siteDir,
    ignoreInitial: true,
    ...{pollingOptions},
  });

  ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach((event) =>
    fsWatcher.on(event, reload),
  );

  let config: webpack.Configuration = merge(
    await createClientConfig(props, cliOptions.minify, false),
    {
      watchOptions: {
        ignored: /node_modules\/(?!@docusaurus)/,
        poll: cliOptions.poll,
      },
      infrastructureLogging: {
        // Reduce log verbosity, see https://github.com/facebook/docusaurus/pull/5420#issuecomment-906613105
        level: 'warn',
      },
      plugins: [
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
          template: path.join(
            __dirname,
            '../webpack/templates/index.html.template.ejs',
          ),
          // So we can define the position where the scripts are injected.
          inject: false,
          filename: 'index.html',
          title: siteConfig.title,
          headTags,
          preBodyTags,
          postBodyTags,
        }),
      ],
    },
  );

  // Plugin Lifecycle - configureWebpack and configurePostCss.
  plugins.forEach((plugin) => {
    const {configureWebpack, configurePostCss} = plugin;

    if (configurePostCss) {
      config = applyConfigurePostCss(configurePostCss.bind(plugin), config);
    }

    if (configureWebpack) {
      config = applyConfigureWebpack(
        configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
        config,
        false,
        props.siteConfig.webpack?.jsLoader,
        plugin.content,
      );
    }
  });

  const compiler = webpack(config);
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

  // https://webpack.js.org/configuration/dev-server
  const defaultDevServerConfig: WebpackDevServer.Configuration = {
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
