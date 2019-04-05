/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CSSExtractPlugin = require('mini-css-extract-plugin');
const Config = require('webpack-chain');
const cacheLoaderVersion = require('cache-loader/package.json').version;
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const isWsl = require('is-wsl');
const {applyBabel, applyCacheLoader, applyStyle} = require('./utils');

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;

module.exports = function createBaseConfig(props, isServer) {
  const {
    outDir,
    themePath,
    siteDir,
    baseUrl,
    generatedFilesDir,
    cliOptions: {cacheLoader},
  } = props;

  const config = new Config();
  const isProd = process.env.NODE_ENV === 'production';

  config
    .mode(isProd ? 'production' : 'development')
    .output.path(outDir)
    .filename(isProd ? '[name].[chunkhash].js' : '[name].js')
    .chunkFilename(isProd ? '[name].[chunkhash].js' : '[name].js')
    .publicPath(baseUrl);

  if (!isProd) {
    config.devtool('cheap-module-eval-source-map');
  }

  config.resolve
    .set('symlinks', true)
    .alias.set('@theme', themePath)
    .set('@site', siteDir)
    .set('@build', outDir)
    .set('@generated', generatedFilesDir)
    .set('@core', path.resolve(__dirname, '../core'))
    .set('@docusaurus', path.resolve(__dirname, '../docusaurus'))
    .end()
    .modules.add(path.resolve(__dirname, '../../node_modules')) // Prioritize our own node modules.
    .add(path.resolve(siteDir, 'node_modules')) // load user node_modules
    .add(path.resolve(process.cwd(), 'node_modules'))
    .add('node_modules');

  const jsRule = config.module
    .rule('js')
    .test(/\.jsx?$/)
    .exclude.add(filepath => {
      // Always transpile lib directory
      if (filepath.startsWith(path.join(__dirname, '..'))) {
        return false;
      }
      // Don't transpile node_modules
      return /node_modules/.test(filepath);
    })
    .end();
  applyCacheLoader(jsRule, {
    cacheLoader,
    siteDir,
    cacheLoaderVersion,
    isServer,
  });
  applyBabel(jsRule, {isServer});

  applyStyle(config.module.rule('css'), {
    cssOptions: {
      importLoaders: 1,
      sourceMap: !isProd,
      minimize: true,
    },
    isProd,
    isServer,
  })
    .test(CSS_REGEX)
    .exclude.add(CSS_MODULE_REGEX)
    .end();

  // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
  // using the extension .module.css
  applyStyle(config.module.rule('css-module'), {
    cssOptions: {
      modules: true,
      importLoaders: 1,
      localIdentName: `[local]_[hash:base64:8]`,
      sourceMap: !isProd,
      minimize: true,
    },
    isProd,
    isServer,
  }).test(CSS_MODULE_REGEX);

  // mini-css-extract plugin
  config.plugin('extractCSS').use(CSSExtractPlugin, [
    {
      filename: isProd ? '[name].[chunkhash].css' : '[name].css',
      chunkFilename: isProd ? '[name].[chunkhash].css' : '[name].css',
    },
  ]);

  // https://webpack.js.org/plugins/split-chunks-plugin/
  config.optimization.splitChunks({
    // We set max requests to Infinity because of HTTP/2
    maxInitialRequests: Infinity,
    maxAsyncRequests: Infinity,
    cacheGroups: {
      // disable the built-in cacheGroups
      default: false,
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 20,
        // create chunk regardless of the size of the chunk
        enforce: true,
      },
      common: {
        name: 'common',
        chunks: 'all',
        minChunks: 2,
        priority: 10,
        reuseExistingChunk: true,
        enforce: true,
      },
    },
  });

  if (isProd) {
    config.optimization.minimizer([
      new TerserPlugin({
        cache: true,
        // We can't run in parallel for WSL due to upstream bug
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: !isWsl,
        sourceMap: true,
        terserOptions: {
          ecma: 6,
          mangle: true,
          output: {
            comments: false,
          },
        },
      }),
    ]);
  }

  return config;
};
