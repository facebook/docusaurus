/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack, {Configuration, Plugin} from 'webpack';
import merge from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReactLoadableSSRAddon from 'react-loadable-ssr-addon';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import {load, CLIOptions, Props} from '../server';
import {createClientConfig} from '../webpack/client';
import {createServerConfig} from '../webpack/server';
import {applyConfigureWebpack} from '../webpack/utils';
import {STATIC_DIR_NAME} from '../constants';

function compile(config: Configuration[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.hasErrors()) {
        stats.toJson().errors.forEach(e => {
          console.error(e);
        });
        reject(new Error('Failed to compile with errors.'));
      }
      if (stats.hasWarnings()) {
        stats.toJson().warnings.forEach(warning => {
          console.warn(warning);
        });
      }
      resolve();
    });
  });
}

export async function build(
  siteDir: string,
  cliOptions: CLIOptions = {},
): Promise<void> {
  process.env.NODE_ENV = 'production';
  console.log(chalk.blue('Creating an optimized production build...'));

  const props: Props = await load(siteDir, cliOptions);

  // Apply user webpack config.
  const {outDir, plugins} = props;

  let clientConfig: Configuration = merge(createClientConfig(props), {
    plugins: [
      // Remove/clean build folders before building bundles.
      new CleanWebpackPlugin({verbose: false}),
      // Visualize size of webpack output files with an interactive zoomable treemap.
      cliOptions.bundleAnalyzer && new BundleAnalyzerPlugin(),
      // Generate client manifests file that will be used for server bundle
      new ReactLoadableSSRAddon({
        filename: 'client-manifest.json',
      }),
    ].filter(Boolean) as Plugin[],
  });

  let serverConfig: Configuration = createServerConfig(props);

  const staticDir = path.resolve(siteDir, STATIC_DIR_NAME);
  if (fs.existsSync(staticDir)) {
    serverConfig = merge(serverConfig, {
      plugins: [
        new CopyWebpackPlugin([
          {
            from: staticDir,
            to: outDir,
          },
        ]),
      ],
    });
  }

  // Plugin lifecycle - configureWebpack
  plugins.forEach(plugin => {
    const {configureWebpack} = plugin;
    if (!configureWebpack) {
      return;
    }
    clientConfig = applyConfigureWebpack(
      configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
      clientConfig,
      false,
    );
    serverConfig = applyConfigureWebpack(
      configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
      serverConfig,
      true,
    );
  });

  // Run webpack to build JS bundle (client) and static html files (server).
  await compile([clientConfig, serverConfig]);

  // Remove server.bundle.js because it is useless
  if (serverConfig.output && serverConfig.output.filename) {
    const serverBundle = path.join(outDir, serverConfig.output.filename);
    fs.existsSync(serverBundle) && fs.unlinkSync(serverBundle);
  }

  /* Plugin lifecycle - postBuild */
  await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.postBuild) {
        return;
      }
      await plugin.postBuild(props);
    }),
  );

  const relativeDir = path.relative(process.cwd(), outDir);
  console.log(
    `\n${chalk.green('Success!')} Generated static files in ${chalk.cyan(
      relativeDir,
    )}.\n`,
  );
}
