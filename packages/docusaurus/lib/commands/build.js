/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const globby = require('globby');
const load = require('../load');
const createSitemap = require('../core/sitemap');
const createServerConfig = require('../webpack/server');
const createClientConfig = require('../webpack/client');
const {applyConfigureWebpack} = require('../webpack/utils');

function compile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
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
      resolve(stats.toJson({modules: false}));
    });
  });
}

module.exports = async function build(siteDir) {
  process.env.NODE_ENV = 'production';
  console.log('Build command invoked ...');

  const props = await load(siteDir);

  // Apply user webpack config.
  const {outDir, plugins} = props;

  const clientConfigObj = createClientConfig(props);
  // Remove/clean build folders before building bundles.
  clientConfigObj
    .plugin('clean')
    .use(CleanWebpackPlugin, [outDir, {verbose: false, allowExternal: true}]);
  let serverConfig = createServerConfig(props).toConfig();
  let clientConfig = clientConfigObj.toConfig();

  // Plugin lifecycle - configureWebpack
  plugins.forEach(({configureWebpack}) => {
    if (!configureWebpack) {
      return;
    }
    clientConfig = applyConfigureWebpack(configureWebpack, clientConfig, false);
    serverConfig = applyConfigureWebpack(configureWebpack, serverConfig, true);
  });

  // Build the client bundles first.
  // We cannot run them in parallel because the server needs to know
  // the correct client bundle name.
  await compile(clientConfig);

  // Build the server bundles (render the static HTML and pick client bundle),
  await compile(serverConfig);

  // Copy static files.
  const staticDir = path.resolve(siteDir, 'static');
  const staticFiles = await globby(['**'], {
    cwd: staticDir,
  });
  await Promise.all(
    staticFiles.map(async source => {
      const fromPath = path.resolve(staticDir, source);
      const toPath = path.resolve(outDir, source);
      return fs.copy(fromPath, toPath);
    }),
  );

  // Generate sitemap.
  const sitemap = await createSitemap(props);
  const sitemapPath = path.join(outDir, 'sitemap.xml');
  await fs.writeFile(sitemapPath, sitemap);

  const relativeDir = path.relative(process.cwd(), outDir);
  console.log(
    `\n${chalk.green('Success!')} Generated static files in ${chalk.cyan(
      relativeDir,
    )}.\n`,
  );
};
